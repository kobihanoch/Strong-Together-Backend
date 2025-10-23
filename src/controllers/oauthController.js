import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import {
  queryBumpTokenVersionAndGetSelfData,
  querySetUserFirstLoginFalse,
} from "../queries/authQueries.js";
import {
  queryCreateUserWithAppleInfo,
  queryCreateUserWithGoogleInfo,
  queryFindUserIdWithAppleUserId,
  queryFindUserIdWithGoogleUserId,
  queryTryToLinkUserWithEmailApple,
  queryTryToLinkUserWithEmailGoogle,
} from "../queries/oauthQueries.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";
import {
  isEnglishName,
  verifyAppleIdToken,
  verifyGoogleIdToken,
} from "../utils/oauthUtils.js";

const validateJkt = (req) => {
  const jkt = req.headers["dpop-key-binding"];
  if (process.env.DPOP_ENABLED === "true") {
    if (!jkt) {
      throw createError(400, "DPoP-Key-Binding header is missing.");
    }
  }

  return jkt;
};

// @desc    Create or Login a user with
// @route   POST /api/oauth/google
// @access  Public
export const createOrSignInWithGoogle = async (req, res) => {
  const jkt = validateJkt(req);
  const idToken = req.body.idToken;

  if (!idToken) throw createError(400, "Missing google id token");
  //Verify the Google ID token
  const { googleSub, email, emailVerified, fullName, picture } =
    await verifyGoogleIdToken(idToken);

  // Check OAuth accounts to get user_id and fetch is first login from users
  let { userId, missing_fields } = await queryFindUserIdWithGoogleUserId(
    googleSub
  );
  let userExistOnOAuthUsers = !!userId;
  let missingFieldsPayload = null;
  // If trying to log in and only missing fields (to show UI to  update these fields)
  if (userExistOnOAuthUsers && missing_fields)
    missingFieldsPayload = missing_fields.split(",");

  // If user doesn't exist as OAuth
  if (!userExistOnOAuthUsers) {
    // Try to link, if not register
    // If email is verified and there is a record with email in users => link user
    let isLinked = false;
    console.log("User doesnt exist, try to link");
    if (emailVerified) {
      const { userId: userIdFromLink } =
        await queryTryToLinkUserWithEmailGoogle(email, googleSub);
      if (userIdFromLink) {
        userId = userIdFromLink;
        isLinked = true;
        console.log("User linked succesffuly!");
      }
    }

    // Linking failed => Create a new user
    if (!isLinked) {
      console.log("Linking failed - try to create a new user");
      // If email is missing send a flag we need email (UX)
      // If full name is missing send a flag we need full name (UX)
      const username = email?.split("@")[0].toLowerCase() || null;

      const isValidEmail = !!email;
      const isValidFullname = !!fullName && isEnglishName(fullName);
      //const isValidGender = false;

      let missingFields = "";
      if (!isValidEmail) missingFields += "email,";
      //if (!isValidGender) missingFields += "gender,"; // Always missing for now
      if (!isValidFullname) missingFields += "name";

      const userIdFromRegister = await queryCreateUserWithGoogleInfo(
        username,
        isValidEmail ? email : null,
        isValidFullname ? fullName : null,
        missingFields !== "" ? missingFields : null,
        googleSub,
        email
      );
      userId = userIdFromRegister;

      console.log("User created");

      if (missingFields !== "") missingFieldsPayload = missingFields.split(",");
    }
  }

  console.log("User exists in oauth => Logging in", userId);

  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(userId);
  const [{ token_version, user_data: userData }] = rowsUserData;
  // If first log in send welcome message
  if (userData.is_first_login && !missingFieldsPayload) {
    await querySetUserFirstLoginFalse(userId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name);
    } catch (e) {
      console.log(e);
    }
  }

  // Login user
  const cnfClaim = {
    cnf: {
      jkt: jkt.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""),
    },
  };

  const accessToken = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = missingFieldsPayload
    ? null
    : jwt.sign(
        {
          id: userData.id,
          role: userData.role,
          tokenVer: token_version,
          ...cnfClaim,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "14d" }
      );
  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    message: "Login successful",
    user: userData?.id,
    missingFields: missingFieldsPayload,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

// @desc    Create or Login a user with Apple
// @route   POST /api/oauth/apple
// @access  Public
export const createOrSignInWithApple = async (req, res) => {
  const jkt = validateJkt(req);
  const { idToken, rawNonce, name, email } = req.body || {};

  if (!idToken || typeof idToken !== "string") {
    throw createError(400, "Missing or invalid Apple identityToken");
  }
  if (!rawNonce || typeof rawNonce !== "string") {
    throw createError(400, "Missing rawNonce");
  }

  // 1) Verify Apple ID token cryptographically
  const {
    appleSub,
    email: tokenEmail,
    emailVerified,
    fullName: normalizedName,
  } = await verifyAppleIdToken({
    identityToken: idToken,
    rawNonce,
    name, // may exist only on first sign-in; not cryptographically verified
  });

  // Prefer email from token when present; else fall back to client-provided
  const resolvedEmail = tokenEmail ?? email ?? null;

  // 2) Lookup by Apple sub in oauth_accounts
  let { userId, missing_fields } = await queryFindUserIdWithAppleUserId(
    appleSub
  );
  const userExistOnOAuthUsers = !!userId;

  // 3) Prepare UI missing-fields payload, if already linked but incomplete
  let missingFieldsPayload = null;
  if (userExistOnOAuthUsers && missing_fields) {
    missingFieldsPayload = missing_fields.split(",");
  }

  // 4) If not linked yet: try to link by verified email, else create user
  if (!userExistOnOAuthUsers) {
    let isLinked = false;

    // Try link only if Apple says email is verified
    if (emailVerified && resolvedEmail) {
      const { userId: linkedId } = await queryTryToLinkUserWithEmailApple(
        resolvedEmail,
        appleSub
      );
      if (linkedId) {
        userId = linkedId;
        isLinked = true;
      }
    }

    if (!isLinked) {
      // Build username and derive missing fields like Google flow
      const username = resolvedEmail?.split("@")[0].toLowerCase() || null;

      const isValidEmail = !!resolvedEmail;

      const candidateFullName = normalizedName;

      const isValidFullname = true; // Apple requested not to get full name as its coming from Apple OAuth already
      //!!candidateFullName && isEnglishName(candidateFullName);

      let missingFields = "";
      if (!isValidEmail) missingFields += "email,";
      if (!isValidFullname) missingFields += "name";

      const newUserId = await queryCreateUserWithAppleInfo(
        username,
        isValidEmail ? resolvedEmail : null,
        isValidFullname ? candidateFullName : null,
        missingFields !== "" ? missingFields : null,
        appleSub,
        resolvedEmail
      );
      userId = newUserId;

      if (missingFields !== "") {
        missingFieldsPayload = missingFields.split(",");
      }
    }
  }

  // 5) Bump token version + fetch user data (same as Google path)
  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(userId);
  const [{ token_version, user_data: userData }] = rowsUserData;

  // First login welcome
  if (userData.is_first_login && !missingFieldsPayload) {
    await querySetUserFirstLoginFalse(userId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name);
    } catch (e) {
      console.log(e);
    }
  }

  // 6) Issue session (same logic as Google)
  const cnfClaim = {
    cnf: {
      jkt: jkt.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""),
    },
  };

  const accessToken = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = missingFieldsPayload
    ? null
    : jwt.sign(
        {
          id: userData.id,
          role: userData.role,
          tokenVer: token_version,
          ...cnfClaim,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "14d" }
      );

  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    message: "Login successful",
    user: userData?.id,
    missingFields: missingFieldsPayload,
    accessToken,
    refreshToken,
  });
};

// @desc    Create or Login a user with
// @route   POST /api/oauth/proceedauth
// @access  Private
export const proceedLogin = async (req, res) => {
  const jkt = req.dpopJkt;
  const userId = req.user.id;

  const [{ missing_fields }] = await sql`
    SELECT missing_fields FROM oauth_accounts WHERE user_id=${userId} `;

  if (missing_fields) {
    throw createError(409, "Profile not completed yet");
  }

  // Bump and release new tokens
  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(userId);
  const [{ token_version, user_data: userData }] = rowsUserData;
  // If first log in send welcome message
  if (userData.is_first_login) {
    await querySetUserFirstLoginFalse(userId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name);
    } catch (e) {
      console.log(e);
    }
  }

  // Login user
  const cnfClaim = {
    cnf: {
      jkt: jkt.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""),
    },
  };

  const accessTokenRes = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "5m" }
  );

  const refreshTokenRes = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "14d" }
  );
  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    message: "Login successful",
    user: userData?.id,
    accessToken: accessTokenRes,
    refreshToken: refreshTokenRes,
  });
};

import createError from "http-errors";
import jwt from "jsonwebtoken";
import {
  queryBumpTokenVersionAndGetSelfData,
  querySetUserFirstLoginFalse,
} from "../queries/authQueries.js";
import {
  queryCreateUserWithGoogleInfo,
  queryFindUserIdWithGoogleUserId,
  queryTryToLinkUserWithEmail,
} from "../queries/oauthQueries.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";
import { verifyGoogleIdToken } from "../utils/oauthUtils.js";

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

  //console.log({ googleSub, email, emailVerified, fullName, picture });

  // Check OAuth accounts to get user_id and fetch is first login from users
  let { userId, missing_fields } = await queryFindUserIdWithGoogleUserId(
    googleSub
  );
  let userExistOnOAuthUsers = !!userId;

  // If trying to log in and only missing fields (to show UI to  update these fields)
  if (userExistOnOAuthUsers && missing_fields)
    return res
      .status(200)
      .json({ message: "Following fields are missing", missing_fields });

  // If user doesn't exist as OAuth
  if (!userExistOnOAuthUsers) {
    // Try to link, if not register
    // If email is verified and there is a record with email in users => link user
    let isLinked = false;
    console.log("User doesnt exist, try to link");
    if (emailVerified) {
      const { userId: userIdFromLink } = await queryTryToLinkUserWithEmail(
        email,
        googleSub
      );
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
      const isValidFullname = !!fullName;
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
    }
  }

  console.log("User exists in oauth => Logging in", userId);

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

  const refreshToken = jwt.sign(
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
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

// @desc    Create or Login a user with
// @route   POST /api/oauth/apple
// @access  Public
export const createOrSignInWithApple = async (req, res) => {
  const jkt = validateJkt();
  const idFromApple = null; ///
  let [userId] = await queryFindUserIdWithAppleUserId(idFromApple);
  if (!userId) {
    //Register user
  }

  // Login user
  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(userId);
  const [{ token_version, user_data: userData }] = rowsUserData;
};

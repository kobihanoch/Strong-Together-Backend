import crypto from "crypto";

export const makeJobId = (suffix, userId) => {
  const userHash = crypto
    .createHash("md5")
    .update(userId)
    .digest("hex")
    .slice(0, 8);

  const now = new Date();
  const iso = now.toISOString().replace(/[-:T.Z]/g, ""); // 20251106... clean string
  const rnd = crypto.randomUUID().slice(0, 8);

  return `user_${userHash}_${iso}_${rnd}_${suffix}`;
};

export type MessageResponse = {
  message: string;
};

export type RefreshTokenResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
};

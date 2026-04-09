export type OAuthLoginResponse = {
  message: string;
  user: string;
  accessToken: string;
  refreshToken: string | null;
  missingFields: string[] | null;
};

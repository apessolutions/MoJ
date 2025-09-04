export type Config = {
  secret: string;
  expires: string;
  forgotSecret: string;
  forgotExpires: string;
  confirmEmailSecret: string;
  confirmEmailExpires: string;
};

export type AuthConfig = {
  auth: Config;
};

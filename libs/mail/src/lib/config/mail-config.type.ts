export type Config = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
  codeImgUrl: string;
  logoUrl: string;
  codeBgColor: string;
  supportEmail: string;
};
export type MailConfig = {
  mail: Config;
};

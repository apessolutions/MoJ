export type Config = {
  accountSID: string;
  authToken: string;
  otpServiceId: string;
};

export type TwilioConfig = {
  twilio: Config;
};

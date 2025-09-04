import { EnvironmentEnum } from './app.config';

export type AppConfig = {
  nodeEnv: EnvironmentEnum;
  name: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  timezone: string;
};

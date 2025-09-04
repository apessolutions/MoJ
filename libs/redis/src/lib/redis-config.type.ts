export type Config = {
  host: string;
  port: number;
  password?: string;
};

export type RedisConfig = {
  redis: Config;
};

import { registerAs } from '@nestjs/config';
import { Config } from './mongo-config.type';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { ToInt } from '../../../../common/src/lib/decorators/transform.decorators';
import { validateConfig } from '../../../../common/src/lib/utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsString()
  MONGODB_HOST: string | undefined;

  @IsString()
  MONGODB_USERNAME: string | undefined;

  @IsString()
  MONGODB_PASSWORD: string | undefined;

  @ToInt()
  @IsInt()
  @Min(0)
  @Max(65535)
  MONGODB_PORT: number | undefined;
}

export default registerAs<Config>('mongo', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: `mongodb://${process.env['MONGODB_USERNAME']}:${process.env['MONGODB_PASSWORD']}@${process.env['MONGODB_HOST']}:${process.env['MONGODB_PORT']}`,
  } as Config;
});

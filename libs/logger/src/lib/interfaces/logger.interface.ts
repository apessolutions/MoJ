import { ModuleMetadata, Type } from '@nestjs/common';
import { LoggerOptions } from 'winston';

export interface SqbLoggerOptions {
  isGlobal: boolean;
  default: string;
  disableConsole: boolean;
  loggers: {
    [key: string]: LoggerOptions;
  };
}

export interface SqbLoggerAsyncOptionsFactory {
  createLoggerOptions(): Promise<SqbLoggerOptions> | SqbLoggerOptions;
}

export interface SqbLoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal: boolean;
  useExisting?: Type<SqbLoggerOptions>;
  useClass?: Type<SqbLoggerAsyncOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SqbLoggerOptions> | SqbLoggerOptions;
  inject?: any[];
}

export enum LogLevel {
  Emergency = 'emergency', // One or more systems are unusable.
  Fatal = 'fatal', // A person must take an action immediately
  Error = 'error', // Error events are likely to cause problems
  Warn = 'warn', // Warning events might cause problems in the future and deserve eyes
  Info = 'info', // Routine information, such as ongoing status or performance
  Debug = 'debug', // Debug or trace information
}

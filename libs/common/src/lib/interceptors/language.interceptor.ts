import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { type Observable } from 'rxjs';

import { LanguageCode } from '../constants/language-code.constants';
import { ContextProvider } from '@./common/providers/context.provider';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<undefined> {
    const request = context.switchToHttp().getRequest();
    const language: string = request.headers['x-language-code'];

    // @ts-ignore
    if (LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }

    return next.handle();
  }
}

export function UseLanguageInterceptor() {
  return UseInterceptors(LanguageInterceptor);
}

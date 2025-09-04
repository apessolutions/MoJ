import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ContextProvider } from '@./common/providers/context.provider';

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    // User Agent
    ContextProvider.setUserAgent(request.headers['user-agent'] ?? '');

    return next.handle();
  }
}

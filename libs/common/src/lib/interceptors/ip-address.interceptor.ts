import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class IpAddressInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    // IP Address headers
    ContextProvider.setIPAddress(request.ip ?? '');

    return next.handle();
  }
}

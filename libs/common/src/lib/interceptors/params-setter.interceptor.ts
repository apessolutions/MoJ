/* eslint-disable no-prototype-builtins */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { IParamRequest } from '../interfaces/IParam.interface';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class ParamsSetterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const params: IParamRequest[] = [];

    // Capture and store all request parameters
    for (const key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        params.push({ key, value: req.params[key] });
      }
    }
    ContextProvider.setParams(params);
    return next.handle();
  }
}

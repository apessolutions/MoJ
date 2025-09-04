import { Request } from 'express';
import * as _ from 'lodash';

export const formatRequest = (req: Request) => {
  return {
    headers: req.headers,
    body: _.omit(req.body, 'password'),
    originalUrl: req.originalUrl,
    ip: req.ip,
    method: req.method,
    userAgent: req.get('user-agent') || '',
  };
};

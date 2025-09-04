import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { LoggerFacade } from '../utils/logger.utils';
import { formatRequest } from '../utils/format.utils';

export const loggerMiddleware = (
  excludedRoutesExpr: string[],
  loggerChannel: any
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isExcluded = !!excludedRoutesExpr.find((excludedRoute) => {
      const isUrlEquals = req.originalUrl.includes(excludedRoute);
      return isUrlEquals;
    });

    if (!isExcluded) {
      LoggerFacade(loggerChannel).debug('here');
      LoggerFacade(loggerChannel).debug(JSON.stringify(formatRequest(req)));

      morgan('combined', {
        stream: {
          write: (message: string) => {
            LoggerFacade(loggerChannel).debug(message, {
              sourceClass: 'RequestLogger',
            });
          },
        },
      })(req, res, (_err) => {});
    }
    next();
  };
};

// const logRequest = (
//   level: LogLevel,
//   channel: Channels,
//   req: Request,
//   res: Response,
// ) => {
//   const request = formatRequest(req);

//   const rawResponse = res.write;
//   const rawResponseEnd = res.end;
//   const chunkBuffers = [];
//   res.write = (...chunks) => {
//     const resArgs = [];
//     for (let i = 0; i < chunks.length; i++) {
//       resArgs[i] = chunks[i];
//       if (!resArgs[i]) {
//         res.once('drain', res.write);
//         i--;
//       }
//     }
//     if (resArgs.length > 0 && resArgs[0]) {
//       chunkBuffers.push(Buffer.from(resArgs[0]));
//     }
//     return rawResponse.apply(res, resArgs);
//   };
//   res.end = (...chunk) => {
//     const resArgs = [];
//     for (let i = 0; i < chunk.length; i++) {
//       resArgs[i] = chunk[i];
//     }
//     if (resArgs.length > 0 && resArgs[0]) {
//       chunkBuffers.push(Buffer.from(resArgs[0]));
//     }
//     let body: any = '{}';
//     if (chunkBuffers.length > 0) {
//       body = Buffer.concat(chunkBuffers).toString('utf8');
//     }
//     res.setHeader('origin', 'restjs-req-res-logging-repo');
//     const responseLog = {
//       response: {
//         statusCode: res.statusCode,
//         body: JSON.parse(body) || body || {},
//         // Returns a shallow copy of the current outgoing headers
//         headers: res.getHeaders(),
//       },
//     };
//     LoggerFacade(channel).log(
//       level,
//       ` Request${JSON.stringify(request)} - Response ${JSON.stringify(
//         responseLog,
//       )}`,
//     );
//     rawResponseEnd.apply(res, resArgs);
//     return responseLog as unknown as Response;
//   };
// };

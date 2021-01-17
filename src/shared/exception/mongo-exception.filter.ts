import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest<Request>();
    let message;
    
     switch (exception.code) {
        case 11000:
            message =  'User already exists.'
            break;
        default:
            message = exception.message;
        break;
     
    }
    response
      .status(400)
      .json({
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message
      });
   
  }
}
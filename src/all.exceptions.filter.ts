import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

import { MyLoggerService } from './my-logger/my-logger.service';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObj = {
    statusCOde: number,
    timestamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new MyLoggerService(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();


        const myResponseObj: MyResponseObj = {
            statusCOde: 200,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        }

        if (exception instanceof HttpException) {
            myResponseObj.statusCOde = exception.getStatus();
            myResponseObj.response = exception.getResponse();
        } else if (exception instanceof PrismaClientValidationError) {
            myResponseObj.statusCOde = 422;
            myResponseObj.response = exception.message.replaceAll(/\n/g, '');
        } else {
            myResponseObj.statusCOde = HttpStatus.INTERNAL_SERVER_ERROR;
            myResponseObj.response = 'Internal Server Error';
        }

        response.status(myResponseObj.statusCOde).json(myResponseObj);
        this.logger.error(myResponseObj.response, AllExceptionsFilter.name);

        super.catch(exception, host);
    }
}
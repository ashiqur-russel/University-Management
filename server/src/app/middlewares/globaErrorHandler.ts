/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/zodError';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let stack = err?.stack || null;


  let errorSources: TErrorSource = [{
    message: '',
    path: 'Something went wrong!'
  }]

 
  if(err instanceof ZodError){
    const simplifiedError = handleZodError(err)

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;

  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.environment ==='development' ? stack : null
  });
};

export default globalErrorHandler;

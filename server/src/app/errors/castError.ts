import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../types/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;

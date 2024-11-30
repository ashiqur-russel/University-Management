/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from 'http-status';

import { NextFunction, Request, Response } from 'express';

const NotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'API is Not Found ',
    error: '',
  });
};

export default NotFound;

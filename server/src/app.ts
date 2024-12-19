import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './routes';
import globalErrorHandler from './app/middlewares/globaErrorHandler';
import NotFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(cookieParser());

app.use('/api/v1', router);
app.use(globalErrorHandler);

app.use(NotFound);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is up and running!',
  });
});

export default app;

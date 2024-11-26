import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import userRoutes from '../src/modules/user/user.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is up and running!',
  });
});
export default app;

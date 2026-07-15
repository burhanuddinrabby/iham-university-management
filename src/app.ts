import express, { Application, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser());

// app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(cors({ origin: ['http://localhost:5173', 'http://192.168.56.1:5173'], credentials: true }));
// app.use(cors({ origin: true, credentials: true }));

//all routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('This is IHAM University API!\n');
});

app.all('{*splat}', notFound);

//global error handling
app.use(globalErrorHandler);

export default app;

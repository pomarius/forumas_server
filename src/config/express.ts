import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { ORIGIN } from '../constants';
import { authRouter } from '../routes/auth.router';
import { commentRouter } from '../routes/comment.router';
import { indexRouter } from '../routes/index.router';
import { postRouter } from '../routes/post.router';
import { topicRouter } from '../routes/topic.router';

interface SyntaxError {
  type: string;
  status: number;
  message: string;
}

const expressConfig = () => {
  const app = express();

  app.use(cors({ origin: ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/api', indexRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/topic', topicRouter);
  app.use('/api/post', postRouter);
  app.use('/api/comment', commentRouter);

  app.use(
    (err: SyntaxError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send((err as SyntaxError).message);
      }
      next();
    }
  );

  return app;
};

export default expressConfig;

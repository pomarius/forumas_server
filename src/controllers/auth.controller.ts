import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { authService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const userId = await authService.login(username, password);

    res.status(200).send(userId);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    console.log(error);
    res.status(500).send();
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const userId = await authService.register(username, password);

    res.status(200).send(userId);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    console.log(error);
    res.status(500).send();
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.header('token');

    if (!refreshToken) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).send(tokens);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    console.log(error);
    res.status(500).send();
  }
};

export const authController = { login, register, refreshToken };

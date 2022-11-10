import { Request, Response } from 'express';

export const index = (req: Request, res: Response) => {
  try {
    res.status(200).send({ hello: 'All good' });
  } catch (error) {
    res.status(500).send();
  }
};

export const indexController = { index };

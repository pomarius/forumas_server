import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { topicService } from '../services/topic.service';
import { authService } from '../services/auth.service';

export const createTopic = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const { name, description } = req.body;

    if (!name || !description || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const topic = await topicService.createTopic(userId, name, description);

    res.status(200).send(topic);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    console.log(error);
    res.status(500).send();
  }
};

export const readTopic = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const topic = await topicService.readTopic(id);

    res.status(200).send(topic);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const readAllTopics = async (req: Request, res: Response) => {
  try {
    const topic = await topicService.readTopic();

    res.status(200).send(topic);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;
    const { name, description } = req.body;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const topic = await topicService.updateTopic(userId, id, name, description);

    res.status(200).send(topic);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    await topicService.deleteTopic(userId, id);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const addTopicModerator = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;
    const { username } = req.body;

    if (!id || !username || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    await topicService.addTopicModerator(userId, id, username);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;
    const { username } = req.body;

    if (!id || !username || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    await topicService.blockUser(userId, id, username);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const topicController = {
  createTopic,
  readTopic,
  readAllTopics,
  updateTopic,
  deleteTopic,
  addTopicModerator,
  blockUser,
};

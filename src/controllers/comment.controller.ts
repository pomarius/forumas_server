import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { authService } from '../services/auth.service';
import { commentService } from '../services/comment.service';

export const createComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const { content, postId } = req.body;

    if (!content || !postId || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const comment = await commentService.createComment(userId, postId, content);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const readComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const postId = req.params.postId;
    const topicId = req.params.topicId;

    if (id && (!postId || !topicId)) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const comment = await commentService.readComment(id, postId, topicId);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const readAllComments = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.readComment();

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;
    const { content } = req.body;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const comment = await commentService.updateComment(userId, id, content);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    await commentService.deleteComment(userId, id);

    res.status(200).send();
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const upvoteComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const comment = await commentService.upvoteComment(userId, id);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const downvoteComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const comment = await commentService.downvoteComment(userId, id);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const unvoteComment = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const comment = await commentService.unvoteComment(userId, id);

    res.status(200).send(comment);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const commentController = {
  createComment,
  readComment,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  unvoteComment,
};

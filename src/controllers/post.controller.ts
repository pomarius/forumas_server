import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { authService } from '../services/auth.service';
import { postService } from '../services/post.service';

export const createPost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const { name, content, topicId } = req.body;

    if (!name || !content || !topicId || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const post = await postService.createPost(userId, topicId, name, content);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const readPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const post = await postService.readPost(id);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const readAllPosts = async (req: Request, res: Response) => {
  try {
    const post = await postService.readPost();

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;
    const { name, content } = req.body;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const post = await postService.updatePost(userId, id, name, content);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    await postService.deletePost(userId, id);

    res.status(200).send();
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const upvotePost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const post = await postService.upvotePost(userId, id);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const downvotePost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const post = await postService.downvotePost(userId, id);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const unvotePost = async (req: Request, res: Response) => {
  try {
    const token = req.header('token');
    const id = req.params.id;

    if (!id || !token) {
      res.status(400).send({ error: 'Bad input' });
      return;
    }

    const { userId } = await authService.verifyToken(token);

    const post = await postService.unvotePost(userId, id);

    res.status(200).send(post);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).send(error.message);
    }
    res.status(500).send();
  }
};

export const postController = {
  createPost,
  readPost,
  readAllPosts,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  unvotePost,
};

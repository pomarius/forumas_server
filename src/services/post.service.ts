import { prisma } from '../config/prisma';
import { HttpException } from '../exceptions/httpException';

const createPost = async (userId: string, topicId: string, name: string, content: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id: topicId },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  const post = await prisma.post.create({
    data: { userId: userId, topicId: topicId, name: name, content: content },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });

  return post;
};

const readPost = async (topicId: string) => {
  const posts = await prisma.post.findMany({
    where: { topicId: topicId },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });

  return posts;
};

const updatePost = async (userId: string, id: string, name?: string, content?: string) => {
  const post = await prisma.post.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: post.topicId, moderators: { some: { userId: userId } } },
  });

  if (post.id !== userId && !moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  return await prisma.post.update({
    where: { id },
    data: { name: name, content: content },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });
};

const deletePost = async (userId: string, id: string) => {
  const post = await prisma.post.findFirst({
    where: { id: id },
    include: {
      userUpvotedPosts: true,
      userDownvotedPosts: true,
      comments: { include: { userDownvotedComments: true, userUpvotedComments: true } },
    },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: post.topicId, moderators: { some: { userId: userId } } },
  });

  if (post.id !== userId && !moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  for (let i = 0; i < post.comments.length; i++) {
    await prisma.userDownvotedComment.deleteMany({ where: { commentId: post.comments[i].id } });
    await prisma.userUpvotedComment.deleteMany({ where: { commentId: post.comments[i].id } });
  }
  await prisma.comment.deleteMany({ where: { postId: post.id } });

  await prisma.userUpvotedPost.deleteMany({ where: { postId: post.id } });
  await prisma.userDownvotedPost.deleteMany({ where: { postId: post.id } });

  await prisma.comment.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });
};

const upvotePost = async (userId: string, id: string) => {
  const post = await prisma.post.findFirst({
    where: { id: id },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  const userUpvotedPost = await prisma.userUpvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userUpvotedPost) {
    throw new HttpException(405, 'Already upvoted');
  }

  const userDownvotedPost = await prisma.userDownvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userDownvotedPost) {
    await prisma.userDownvotedPost.delete({
      where: { userId_postId: { postId: id, userId: userId } },
    });
  }

  return await prisma.post.update({
    where: { id },
    data: { userUpvotedPosts: { create: { userId: userId } } },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });
};

const downvotePost = async (userId: string, id: string) => {
  const post = await prisma.post.findFirst({
    where: { id: id },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  const userDownvotedPost = await prisma.userDownvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userDownvotedPost) {
    throw new HttpException(405, 'Already downvoted');
  }

  const userUpvotedPost = await prisma.userUpvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userUpvotedPost) {
    await prisma.userUpvotedPost.delete({
      where: { userId_postId: { postId: id, userId: userId } },
    });
  }

  return await prisma.post.update({
    where: { id },
    data: { userDownvotedPosts: { create: { userId: userId } } },
    include: {
      _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
      userUpvotedPosts: true,
      userDownvotedPosts: true,
    },
  });
};

const unvotePost = async (userId: string, id: string) => {
  const post = await prisma.post.findFirst({
    where: { id: id },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  const userUpvotedPost = await prisma.userUpvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userUpvotedPost) {
    await prisma.userUpvotedPost.delete({
      where: { userId_postId: { postId: id, userId: userId } },
    });

    return await prisma.post.findFirst({
      where: { id: id },
      include: {
        _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
        userUpvotedPosts: true,
        userDownvotedPosts: true,
      },
    });
  }

  const userDownvotedPost = await prisma.userDownvotedPost.findFirst({
    where: { userId: userId, postId: id },
  });

  if (userDownvotedPost) {
    await prisma.userDownvotedPost.delete({
      where: { userId_postId: { postId: id, userId: userId } },
    });

    return await prisma.post.findFirst({
      where: { id: id },
      include: {
        _count: { select: { userUpvotedPosts: true, userDownvotedPosts: true } },
        userUpvotedPosts: true,
        userDownvotedPosts: true,
      },
    });
  }

  throw new HttpException(405, 'Already not voted');
};

export const postService = {
  createPost,
  readPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  unvotePost,
};

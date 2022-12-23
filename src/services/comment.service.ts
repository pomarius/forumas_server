import { prisma } from '../config/prisma';
import { HttpException } from '../exceptions/httpException';

const createComment = async (userId: string, postId: string, content: string) => {
  const post = await prisma.post.findFirst({
    where: { id: postId },
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

  const comment = await prisma.comment.create({
    data: { userId: userId, postId: postId, content: content },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  return comment;
};

const readComment = async (postId?: string) => {
  const comment = await prisma.comment.findMany({
    where: { postId: postId },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  return comment;
};

const updateComment = async (userId: string, id: string, content?: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  const post = await prisma.post.findFirst({
    where: { id: comment.postId },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: post.topicId, moderators: { some: { userId: userId } } },
  });

  if (comment.id !== userId && !moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  return await prisma.comment.update({
    where: { id },
    data: { content: content },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });
};

const deleteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  const post = await prisma.post.findFirst({
    where: { id: comment.postId },
  });

  if (!post) {
    throw new HttpException(404, 'Post not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: post.topicId, moderators: { some: { userId: userId } } },
  });

  if (comment.id !== userId && !moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const blocked = await prisma.topic.findFirst({
    where: { id: post.topicId, blocked: { some: { userId: userId } } },
  });

  if (blocked) {
    throw new HttpException(401, 'User is blocked');
  }

  await prisma.userDownvotedComment.deleteMany({ where: { commentId: id } });
  await prisma.userUpvotedComment.deleteMany({ where: { commentId: id } });

  await prisma.comment.delete({ where: { id } });
};

const upvoteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  const post = await prisma.post.findFirst({
    where: { id: comment.postId },
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

  const userUpvotedComment = await prisma.userUpvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userUpvotedComment) {
    throw new HttpException(405, 'Already upvoted');
  }

  const userDownvotedComment = await prisma.userDownvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userDownvotedComment) {
    await prisma.userDownvotedComment.delete({
      where: { userId_commentId: { commentId: id, userId: userId } },
    });
  }

  return await prisma.comment.update({
    where: { id },
    data: { userUpvotedComments: { create: { userId: userId } } },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });
};

const downvoteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  const post = await prisma.post.findFirst({
    where: { id: comment.postId },
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

  const userDownvotedComment = await prisma.userDownvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userDownvotedComment) {
    throw new HttpException(405, 'Already downvoted');
  }

  const userUpvotedComment = await prisma.userUpvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userUpvotedComment) {
    await prisma.userUpvotedComment.delete({
      where: { userId_commentId: { commentId: id, userId: userId } },
    });
  }

  return await prisma.comment.update({
    where: { id },
    data: { userDownvotedComments: { create: { userId: userId } } },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });
};

const unvoteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: id },
    include: {
      _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
      userUpvotedComments: true,
      userDownvotedComments: true,
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  const post = await prisma.post.findFirst({
    where: { id: comment.postId },
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

  const userUpvotedComment = await prisma.userUpvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userUpvotedComment) {
    await prisma.userUpvotedComment.delete({
      where: { userId_commentId: { commentId: id, userId: userId } },
    });

    return await prisma.comment.findFirst({
      where: { id: id },
      include: {
        _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
        userUpvotedComments: true,
        userDownvotedComments: true,
      },
    });
  }

  const userDownvotedComment = await prisma.userDownvotedComment.findFirst({
    where: { userId: userId, commentId: id },
  });

  if (userDownvotedComment) {
    await prisma.userDownvotedComment.delete({
      where: { userId_commentId: { commentId: id, userId: userId } },
    });

    return await prisma.comment.findFirst({
      where: { id: id },
      include: {
        _count: { select: { userUpvotedComments: true, userDownvotedComments: true } },
        userUpvotedComments: true,
        userDownvotedComments: true,
      },
    });
  }

  throw new HttpException(405, 'Already not voted');
};

export const commentService = {
  createComment,
  readComment,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  unvoteComment,
};

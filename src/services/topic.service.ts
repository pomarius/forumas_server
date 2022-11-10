import { prisma } from '../config/prisma';
import { HttpException } from '../exceptions/httpException';

const createTopic = async (userId: string, name: string, description: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpException(401, 'Unauthorized');
  }

  const topic = await prisma.topic.create({
    data: { moderators: { create: { userId: userId } }, name: name, description: description },
  });

  return topic;
};

const readTopic = async (id?: string) => {
  if (!id) {
    const topics = await prisma.topic.findMany({});

    if (!topics) {
      throw new HttpException(404, 'Topics not found');
    }

    return topics;
  }

  const topic = await prisma.topic.findFirst({
    where: { id: id },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  return topic;
};

const updateTopic = async (userId: string, id: string, name?: string, description?: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id: id },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: userId } } },
  });

  if (!moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  return await prisma.topic.update({
    where: { id },
    data: { name: name, description: description },
  });
};

const deleteTopic = async (userId: string, id: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id: id },
    include: { posts: true },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: userId } } },
  });

  if (!moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  for (let i = 0; i < topic.posts.length; i++) {
    await prisma.comment.deleteMany({ where: { postId: topic.posts[i].id } });
  }

  await prisma.post.deleteMany({ where: { topicId: id } });
  await prisma.topic.delete({ where: { id } });
};

const addTopicModerator = async (userId: string, id: string, username: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id: id },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: userId } } },
  });

  if (!moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    throw new HttpException(404, 'User not found');
  }

  const added = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: user.id } } },
  });

  if (added) {
    throw new HttpException(405, 'User is already a moderator');
  }

  await prisma.topic.update({
    where: { id },
    data: { moderators: { create: { userId: user.id } } },
  });
};

const blockUser = async (userId: string, id: string, username: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id: id },
  });

  if (!topic) {
    throw new HttpException(404, 'Topic not found');
  }

  const moderator = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: userId } } },
  });

  if (!moderator) {
    throw new HttpException(401, 'Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    throw new HttpException(404, 'User not found');
  }

  const userIsModerator = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: user.id } } },
  });

  if (userIsModerator) {
    throw new HttpException(405, "Can't block a moderator");
  }

  const added = await prisma.topic.findFirst({
    where: { id: id, moderators: { some: { userId: user.id } } },
  });

  if (added) {
    throw new HttpException(405, 'User is already blocked');
  }

  await prisma.topic.update({
    where: { id },
    data: { blocked: { create: { userId: user.id } } },
  });
};

export const topicService = {
  createTopic,
  readTopic,
  updateTopic,
  deleteTopic,
  addTopicModerator,
  blockUser,
};

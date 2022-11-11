import { prisma } from '../config/prisma';
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from '../constants';
import { HttpException } from '../exceptions/httpException';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface JwtPayload {
  _id: string;
}

const login = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { username: username, password: password },
  });

  if (!user) {
    throw new HttpException(404, 'Bad credentials');
  }

  const { accessToken, refreshToken } = await generateTokens(user.id);

  return { accessToken: accessToken, refreshToken: refreshToken };
};

const register = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { username: username },
  });

  if (user) {
    throw new HttpException(400, 'User already exists');
  }

  const newUser = await prisma.user.create({
    data: { username: username, password: password },
  });

  const { accessToken, refreshToken } = await generateTokens(newUser.id);

  return { accessToken: accessToken, refreshToken: refreshToken };
};

const refreshToken = async (token: string) => {
  const userToken = await prisma.userToken.findFirst({ where: { token: token } });

  if (!userToken) {
    throw new HttpException(400, 'Invalid refresh token');
  }

  try {
    const { _id } = jwt.verify(token, REFRESH_TOKEN_PRIVATE_KEY) as JwtPayload;

    console.log(_id);

    if (!_id) {
      throw new HttpException(404, 'User not found');
    }

    const user = await prisma.user.findFirst({
      where: { id: _id },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
    if (error instanceof HttpException) {
      throw new HttpException(error.status, error.message);
    } else if (error instanceof TokenExpiredError) {
      throw new HttpException(401, 'Token expired');
    }

    throw error;
  }
};

const generateTokens = async (userId: string) => {
  const payload = { _id: userId };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: '1m',
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: '10m',
  });

  const userToken = await prisma.userToken.findFirst({ where: { userId: userId } });
  if (userToken) {
    await prisma.userToken.delete({ where: { token: userToken.token } });
  }

  await prisma.userToken.create({
    data: { token: refreshToken, userId: userId },
  });

  return { accessToken, refreshToken };
};

const verifyToken = async (token: string) => {
  try {
    const { _id } = jwt.verify(token, ACCESS_TOKEN_PRIVATE_KEY) as JwtPayload;

    console.log(_id);

    if (!_id) {
      throw new HttpException(404, 'User not found');
    }

    const user = await prisma.user.findFirst({
      where: { id: _id },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return { userId: user.id };
  } catch (error) {
    if (error instanceof HttpException) {
      throw new HttpException(error.status, error.message);
    } else if (error instanceof TokenExpiredError) {
      throw new HttpException(401, 'Token expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new HttpException(401, 'Invalid token');
    }

    throw error;
  }
};

export const authService = { login, register, refreshToken, verifyToken };

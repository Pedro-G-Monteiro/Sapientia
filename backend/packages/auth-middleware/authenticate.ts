import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { AuthUser } from './types';

export const authenticateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ status: 'error', message: 'Token not provided' });
    }

    const decoded = await request.server.jwt.verify<AuthUser>(token, { complete: true });
    if (!decoded || decoded.aud !== 'frontend') {
      return reply.status(403).send({ status: 'error', message: 'Forbidden: invalid token' });
    }

    request.auth = { user: decoded };
  } catch (error) {
    return reply.status(401).send({
      status: 'error',
      message: 'Invalid token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default fp(async (fastify) => {
  fastify.decorate('authenticate', authenticateUser);
});

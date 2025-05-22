import { FastifyReply, FastifyRequest } from 'fastify';

export const authorize =
  (allowedRoles: string[]) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const roles = request.auth?.user.roles || [];

    const isAuthorized = roles.some((role: string) => allowedRoles.includes(role));
    if (!isAuthorized) {
      return reply.status(403).send({
        status: 'error',
        message: 'Forbidden: insufficient permissions',
      });
    }
  };

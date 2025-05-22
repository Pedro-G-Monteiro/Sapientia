import { AuthUser } from '@sapientia/auth-middleware';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: {
      user: AuthUser;
    };
  }
}

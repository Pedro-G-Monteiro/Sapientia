import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import prisma from '../utils/prisma';

// Interface for the authenticated user
export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  bio?: string | null;
  is_admin: boolean;
  organization_id?: number | null;
}

/**
 * Authentication Middleware that verifies the JWT token in the request headers
 * and retrieves the user information from the database.
 */
export const authenticateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Verifies if the request has an authorization header
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return reply.status(401).send({ 
        status: 'error',
        message: 'Not authorized: Token not provided' 
      });
    }

    // Verifies the JWT token and decodes it
    const decoded = await request.server.jwt.verify<{
      user_id: number;
      username: string;
      email: string;
    }>(token);
    
    if (!decoded) {
      return reply.status(401).send({ 
        status: 'error',
        message: 'Not authorized: Invalid token' 
      });
    }

    // Searches for the user in the database using the user_id from the decoded token
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
      select: {
        user_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        profile_picture_url: true,
        bio: true,
        is_admin: true,
        organization_id: true
      }
    });

    if (!user) {
      return reply.status(401).send({ 
        status: 'error',
        message: 'Not authorized: User not found' 
      });
    }

    // Adds the user information to the request object
    request.auth = { user };

  } catch (error) {
    return reply.status(401).send({ 
      status: 'error',
      message: 'Not authorized: Invalid token',
      error: error instanceof Error ? error.message : 'Unkown error'
    });
  }
};

// Registers the authentication middleware as a Fastify plugin
export default fp(async (fastify) => {
  fastify.decorate('authenticate', authenticateUser);
});

// Extends the FastifyInstance interface to include the 'authenticate' method
// and the FastifyRequest interface to include the 'auth' decorator
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticateUser;
  }
  
  interface FastifyRequest {
    auth?: {
      user: AuthUser;
    };
  }
}
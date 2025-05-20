import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { AuthUser } from '../types/auth';

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
				message: 'Not authorized: Token not provided',
			});
		}

		// Verifies the JWT token and decodes it
		const decoded = await request.server.jwt.verify<AuthUser>(token, {
			complete: true,
		});

		if (!decoded) {
			return reply.status(401).send({
				status: 'error',
				message: 'Not authorized: Invalid token',
			});
		}

		// Example enforcement:
		if (decoded.aud !== 'frontend') {
			return reply.status(403).send({ message: 'Forbidden: invalid audience' });
		}

		request.auth = { user: decoded };

	} catch (error) {
		return reply.status(401).send({
			status: 'error',
			message: 'Not authorized: Invalid token',
			error: error instanceof Error ? error.message : 'Unkown error',
		});
	}
};

// Registers the authentication middleware as a Fastify plugin
export default fp(async (fastify) => {
	fastify.decorate('authenticate', authenticateUser);
});
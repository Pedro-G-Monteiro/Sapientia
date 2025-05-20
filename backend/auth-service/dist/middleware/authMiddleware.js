"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
/**
 * Authentication Middleware that verifies the JWT token in the request headers
 * and retrieves the user information from the database.
 */
const authenticateUser = async (request, reply) => {
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
        const decoded = await request.server.jwt.verify(token, {
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
    }
    catch (error) {
        return reply.status(401).send({
            status: 'error',
            message: 'Not authorized: Invalid token',
            error: error instanceof Error ? error.message : 'Unkown error',
        });
    }
};
exports.authenticateUser = authenticateUser;
// Registers the authentication middleware as a Fastify plugin
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('authenticate', exports.authenticateUser);
});

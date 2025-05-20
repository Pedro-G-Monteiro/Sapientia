"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => async (request, reply) => {
    const roles = request.auth?.user.roles || [];
    const isAuthorized = roles.some((role) => allowedRoles.includes(role));
    if (!isAuthorized) {
        return reply.status(403).send({
            status: 'error',
            message: 'Forbidden: insufficient permissions',
        });
    }
};
exports.authorize = authorize;
// Usage example: (In routes file)
// import { authorize } from './path_to/roleMiddleware';
// fastify.get('/admin', { preHandler: [app.authenticate, authorize(['admin'])]}, CONTROLLER);
// -------------------------------------------------------------------------------------------
// 	Another example:
// 	import { authorize } from '../middleware/roleMiddleware';
// export default async function meRoutes(app: FastifyInstance) {
//   const options = {
//     onRequest: [app.authenticate], // for all authenticated users
//   };
//   const adminOptions = {
//     onRequest: [app.authenticate, authorize(['admin'])], // only admins
//   };
//   app.get('/me', options, getMeController);
//   app.get('/admin-area', adminOptions, async (req, reply) => {
//     return { status: 'success', message: 'Welcome, Admin!' };
//   });
// }

import { FastifyInstance } from 'fastify';
import { registerController, loginController } from '../controllers/authController';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', { schema: registerSchema }, registerController);
  app.post('/login', { schema: loginSchema }, loginController);
}

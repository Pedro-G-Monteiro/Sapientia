import { FastifyInstance } from 'fastify';
import { getMeController } from '../controllers/meController';

export default async function meRoutes(app: FastifyInstance) {
  const options = { 
    onRequest: [app.authenticate] // Using the authenticate middleware to protect the route
  };

  // Route to get the authenticated user's information
  app.get('/me', options, getMeController);
}
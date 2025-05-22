import { authenticate, authorize } from '@sapientia/auth-middleware';
import { FastifyInstance } from 'fastify';
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization
} from '../controllers/organizationController';

export default async function organizationRoutes(app: FastifyInstance) {
  app.get('/organizations', { onRequest: [authenticate] }, getAllOrganizations);
  app.get('/organizations/:id', { onRequest: [authenticate, authorize(['admin'])] }, getOrganizationById);
  app.post('/organizations', { onRequest: [authenticate, authorize(['admin'])] }, createOrganization);
  app.put('/organizations/:id', { onRequest: [authenticate, authorize(['admin'])] }, updateOrganization);
  app.delete('/organizations/:id', { onRequest: [authenticate, authorize(['admin'])] }, deleteOrganization);
}

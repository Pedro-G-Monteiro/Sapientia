import { FastifyRequest, FastifyReply } from 'fastify';
import { OrganizationService } from '../services/organizationService';

export const getAllOrganizations = async (req: FastifyRequest, reply: FastifyReply) => {
  const organizations = await OrganizationService.getAll();
  return reply.send({ status: 'success', data: organizations });
};

export const getOrganizationById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const id = Number(req.params.id);
  const organization = await OrganizationService.getById(id);

  if (!organization) {
    return reply.status(404).send({ status: 'error', message: 'Organization not found' });
  }

  return reply.send({ status: 'success', data: organization });
};

export const createOrganization = async (
  req: FastifyRequest<{ Body: any }>,
  reply: FastifyReply
) => {
  const newOrg = await OrganizationService.create(req.body);
  return reply.status(201).send({ status: 'success', data: newOrg });
};

export const updateOrganization = async (
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply
) => {
  const id = Number(req.params.id);
  const updatedOrg = await OrganizationService.update(id, req.body);
  return reply.send({ status: 'success', data: updatedOrg });
};

export const deleteOrganization = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const id = Number(req.params.id);
  await OrganizationService.delete(id);
  return reply.send({ status: 'success', message: 'Organization deleted' });
};

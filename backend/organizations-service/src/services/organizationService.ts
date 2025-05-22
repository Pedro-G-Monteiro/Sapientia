import prisma from '../utils/prisma';

export class OrganizationService {
  static async getAll() {
    return prisma.organization.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
  }

  static async getById(id: number) {
    return prisma.organization.findUnique({
      where: { organization_id: id },
    });
  }

  static async create(data: any) {
    return prisma.organization.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.organization.update({
      where: { organization_id: id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.organization.update({
      where: { organization_id: id },
      data: { is_active: false },
    });
  }
}

import { PrismaClient } from '@prisma/client';
import prisma from '../utils/prisma';

export class UserService {
  /**
   * Create a new user in the database
   */
  static async createUser(
    username: string,
    email: string,
    password_hash: string,
    first_name: string,
    last_name: string,
    organization_id?: number,
    profile_picture_url?: string,
    bio?: string
  ) {
    return prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        first_name,
        last_name,
        organization_id,
        profile_picture_url,
        bio,
      },
    });
  }

  /**
   * Search for a user by email
   */
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Search for a user by username
   */
  static async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Search for a user by ID
   */
  static async findUserById(user_id: number) {
    return prisma.user.findUnique({
      where: { user_id },
    });
  }

  /**
   * Update user last login date
   */
  static async updateLastLogin(user_id: number) {
    return prisma.user.update({
      where: { user_id },
      data: { last_login: new Date() },
    });
  }
}
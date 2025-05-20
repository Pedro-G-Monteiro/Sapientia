"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class UserService {
    /**
     * Create a new user in the database
     */
    static async createUser(username, email, password_hash, first_name, last_name, organization_id, profile_picture_url, bio, roles = ['user']) {
        return prisma_1.default.user.create({
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
            include: {
                roles: {
                    include: {
                        role: true, // inclui a relação com Role
                    },
                },
            },
        });
    }
    /**
     * Search for a user by email
     */
    static async findUserByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
            include: { roles: { include: { role: true } } },
        });
    }
    /**
     * Search for a user by username
     */
    static async findUserByUsername(username) {
        return prisma_1.default.user.findUnique({
            where: { username },
            include: { roles: { include: { role: true } } },
        });
    }
    /**
     * Search for a user by ID
     */
    static async findUserById(user_id) {
        return prisma_1.default.user.findUnique({
            where: { user_id },
            include: { roles: { include: { role: true } } },
        });
    }
    /**
     * Update user last login date
     */
    static async updateLastLogin(user_id) {
        return prisma_1.default.user.update({
            where: { user_id },
            data: { last_login: new Date() },
        });
    }
}
exports.UserService = UserService;

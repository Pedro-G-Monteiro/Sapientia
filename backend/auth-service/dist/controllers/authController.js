"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const userService_1 = require("../services/userService");
const hash_1 = require("../utils/hash");
/**
 * Controlador para registro de novos usuários
 */
const registerController = async (request, reply) => {
    try {
        const { username, email, password, first_name, last_name, organization_id, profile_picture_url, bio, } = request.body;
        // Verifica se já existe um usuário com o mesmo email ou username
        const existingUserByEmail = await userService_1.UserService.findUserByEmail(email);
        if (existingUserByEmail) {
            return reply.status(400).send({
                status: 'error',
                message: 'Email already in use',
            });
        }
        const existingUserByUsername = await userService_1.UserService.findUserByUsername(username);
        if (existingUserByUsername) {
            return reply.status(400).send({
                status: 'error',
                message: 'Username already in use',
            });
        }
        // Criptografa a senha
        const password_hash = await (0, hash_1.hashPassword)(password);
        // Cria o novo usuário
        const user = await userService_1.UserService.createUser(username, email, password_hash, first_name, last_name, organization_id, profile_picture_url, bio);
        const roles = user.roles.map((role) => role.role.name);
        // Atualiza a data do último login (opcional)
        await userService_1.UserService.updateLastLogin(user.user_id);
        // Gera o token JWT
        const token = await reply.jwtSign({
            sub: user.user_id.toString(), // Required to be a string
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture_url: user.profile_picture_url,
            bio: user.bio,
            roles: roles,
            organization_id: user.organization_id,
            aud: 'frontend', // or 'admin-dashboard', 'mobile-app', etc.
        }, {
            expiresIn: '1d',
        });
        return reply.status(201).send({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                token,
            },
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            status: 'error',
            message: 'Error registering user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.registerController = registerController;
/**
 * Controlador para login de usuários
 */
const loginController = async (request, reply) => {
    try {
        const { email, password } = request.body;
        // Busca o usuário pelo email
        const user = await userService_1.UserService.findUserByEmail(email);
        if (!user) {
            return reply.status(401).send({
                status: 'error',
                message: 'Invalid credentials',
            });
        }
        const roles = user.roles.map((role) => role.role.name);
        // Verifica se a senha está correta
        const isPasswordValid = await (0, hash_1.comparePassword)(password, user.password_hash);
        if (!isPasswordValid) {
            return reply.status(401).send({
                status: 'error',
                message: 'Invalid credentials',
            });
        }
        // Atualiza a data do último login
        await userService_1.UserService.updateLastLogin(user.user_id);
        // Gera o token JWT
        const token = await reply.jwtSign({
            sub: user.user_id.toString(), // Required to be a string
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture_url: user.profile_picture_url,
            bio: user.bio,
            roles: roles, // Add roles array
            organization_id: user.organization_id,
            aud: 'frontend', // or 'admin-dashboard', 'mobile-app', etc.
        }, {
            expiresIn: '1d',
        });
        return reply.status(200).send({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                token,
            },
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            status: 'error',
            message: 'Error logging in',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.loginController = loginController;

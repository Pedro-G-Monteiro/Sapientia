import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/userService';
import { comparePassword, hashPassword } from '../utils/hash';

interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	organization_id?: number;
	profile_picture_url?: string;
	bio?: string;
}

interface LoginRequest {
	email: string;
	password: string;
}

/**
 * Controlador para registro de novos usuários
 */
export const registerController = async (
	request: FastifyRequest<{ Body: RegisterRequest }>,
	reply: FastifyReply
) => {
	try {
		const {
			username,
			email,
			password,
			first_name,
			last_name,
			organization_id,
			profile_picture_url,
			bio,
		} = request.body;

		// Verifica se já existe um usuário com o mesmo email ou username
		const existingUserByEmail = await UserService.findUserByEmail(email);
		if (existingUserByEmail) {
			return reply.status(400).send({
				status: 'error',
				message: 'Email already in use',
			});
		}

		const existingUserByUsername = await UserService.findUserByUsername(
			username
		);
		if (existingUserByUsername) {
			return reply.status(400).send({
				status: 'error',
				message: 'Username already in use',
			});
		}

		// Criptografa a senha
		const password_hash = await hashPassword(password);

		// Cria o novo usuário
		const user = await UserService.createUser(
			username,
			email,
			password_hash,
			first_name,
			last_name,
			organization_id,
			profile_picture_url,
			bio
		);

		const roles = user.roles.map(
			(role: { role: { name: any } }) => role.role.name
		);

		// Atualiza a data do último login (opcional)
		await UserService.updateLastLogin(user.user_id);

		// Gera o token JWT
		const token = await reply.jwtSign(
			{
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
			},
			{
				expiresIn: '1d',
			}
		);

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
	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({
			status: 'error',
			message: 'Error registering user',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

/**
 * Controlador para login de usuários
 */
export const loginController = async (
	request: FastifyRequest<{ Body: LoginRequest }>,
	reply: FastifyReply
) => {
	try {
		const { email, password } = request.body;

		// Busca o usuário pelo email
		const user = await UserService.findUserByEmail(email);
		if (!user) {
			return reply.status(401).send({
				status: 'error',
				message: 'Invalid credentials',
			});
		}

		const roles = user.roles.map(
			(role: { role: { name: any } }) => role.role.name
		);

		// Verifica se a senha está correta
		const isPasswordValid = await comparePassword(password, user.password_hash);
		if (!isPasswordValid) {
			return reply.status(401).send({
				status: 'error',
				message: 'Invalid credentials',
			});
		}

		// Atualiza a data do último login
		await UserService.updateLastLogin(user.user_id);

		// Gera o token JWT
		const token = await reply.jwtSign(
			{
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
			},
			{
				expiresIn: '1d',
			}
		);

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
	} catch (error) {
		request.log.error(error);
		return reply.status(500).send({
			status: 'error',
			message: 'Error logging in',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

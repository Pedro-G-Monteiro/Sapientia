import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';
import { hashPassword, comparePassword } from '../utils/hash';

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
    const { username, email, password, first_name, last_name, organization_id, profile_picture_url, bio } = request.body;

    // Verifica se já existe um usuário com o mesmo email ou username
    const existingUserByEmail = await UserService.findUserByEmail(email);
    if (existingUserByEmail) {
      return reply.status(400).send({
        status: 'error',
        message: 'Email já está em uso'
      });
    }

    const existingUserByUsername = await UserService.findUserByUsername(username);
    if (existingUserByUsername) {
      return reply.status(400).send({
        status: 'error',
        message: 'Nome de usuário já está em uso'
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

    // Atualiza a data do último login (opcional)
    await UserService.updateLastLogin(user.user_id);

    // Gera o token JWT
    const token = await reply.jwtSign({
      user_id: user.user_id,
      username: user.username,
      email: user.email
    }, { expiresIn: '1d' });

    return reply.status(201).send({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      }
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      status: 'error',
      message: 'Erro ao registrar usuário',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
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
        message: 'Credenciais inválidas'
      });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return reply.status(401).send({
        status: 'error',
        message: 'Credenciais inválidas'
      });
    }

    // Atualiza a data do último login
    await UserService.updateLastLogin(user.user_id);

    // Gera o token JWT
    const token = await reply.jwtSign({
      user_id: user.user_id,
      username: user.username,
      email: user.email
    }, { expiresIn: '1d' });

    return reply.status(200).send({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      }
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      status: 'error',
      message: 'Erro ao realizar login',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
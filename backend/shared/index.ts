import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

/**
 * Interface para o usuário autenticado
 */
export interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  bio?: string | null;
  is_admin: boolean;
  organization_id?: number | null;
}

/**
 * Função para verificar o token JWT com o Auth Service
 * @param token Token JWT
 * @returns Informações do usuário autenticado
 */
export const verifyToken = async (token: string, authServiceUrl: string): Promise<AuthUser> => {
  try {
    const response = await axios.get(
      `${authServiceUrl}/api/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.status === 'success') {
      return response.data.data.user;
    }

    throw new Error('Token inválido');
  } catch (error) {
    throw new Error('Erro ao verificar token');
  }
};

/**
 * Middleware para autenticação em outros microsserviços
 */
export const createAuthenticateMiddleware = (authServiceUrl: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return reply.status(401).send({
          status: 'error',
          message: 'Não autorizado: Token não fornecido'
        });
      }

      // Verifica o token usando o Auth Service
      const user = await verifyToken(token, authServiceUrl);
      
      // Adiciona o usuário ao objeto da requisição
      // Nota: Necessário usar type assertion para contornar a limitação do TypeScript
      (request as any).auth = { user };
    } catch (error) {
      return reply.status(401).send({
        status: 'error',
        message: 'Não autorizado: Token inválido',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
};

/**
 * Middleware para verificar se o usuário tem permissões de administrador
 */
export const createRequireAdminMiddleware = () => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Nota: Necessário usar type assertion para contornar a limitação do TypeScript
    const auth = (request as any).auth;
    
    if (!auth?.user) {
      return reply.status(401).send({
        status: 'error',
        message: 'Não autorizado: Usuário não autenticado'
      });
    }

    if (!auth.user.is_admin) {
      return reply.status(403).send({
        status: 'error',
        message: 'Acesso proibido: Permissões insuficientes'
      });
    }
  };
};

// Funções auxiliares para registrar os middlewares no Fastify
export const registerAuthMiddleware = (fastify: any, authServiceUrl: string) => {
  const authenticateMiddleware = createAuthenticateMiddleware(authServiceUrl);
  const requireAdminMiddleware = createRequireAdminMiddleware();
  
  fastify.decorate('authenticate', authenticateMiddleware);
  fastify.decorate('requireAdmin', requireAdminMiddleware);
};
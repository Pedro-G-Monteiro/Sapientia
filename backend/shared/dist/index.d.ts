import { FastifyRequest, FastifyReply } from 'fastify';
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
export declare const verifyToken: (token: string, authServiceUrl: string) => Promise<AuthUser>;
/**
 * Middleware para autenticação em outros microsserviços
 */
export declare const createAuthenticateMiddleware: (authServiceUrl: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
/**
 * Middleware para verificar se o usuário tem permissões de administrador
 */
export declare const createRequireAdminMiddleware: () => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const registerAuthMiddleware: (fastify: any, authServiceUrl: string) => void;

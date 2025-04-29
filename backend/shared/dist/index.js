"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthMiddleware = exports.createRequireAdminMiddleware = exports.createAuthenticateMiddleware = exports.verifyToken = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Função para verificar o token JWT com o Auth Service
 * @param token Token JWT
 * @returns Informações do usuário autenticado
 */
const verifyToken = async (token, authServiceUrl) => {
    try {
        const response = await axios_1.default.get(`${authServiceUrl}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.status === 'success') {
            return response.data.data.user;
        }
        throw new Error('Token inválido');
    }
    catch (error) {
        throw new Error('Erro ao verificar token');
    }
};
exports.verifyToken = verifyToken;
/**
 * Middleware para autenticação em outros microsserviços
 */
const createAuthenticateMiddleware = (authServiceUrl) => {
    return async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({
                    status: 'error',
                    message: 'Não autorizado: Token não fornecido'
                });
            }
            // Verifica o token usando o Auth Service
            const user = await (0, exports.verifyToken)(token, authServiceUrl);
            // Adiciona o usuário ao objeto da requisição
            // Nota: Necessário usar type assertion para contornar a limitação do TypeScript
            request.auth = { user };
        }
        catch (error) {
            return reply.status(401).send({
                status: 'error',
                message: 'Não autorizado: Token inválido',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };
};
exports.createAuthenticateMiddleware = createAuthenticateMiddleware;
/**
 * Middleware para verificar se o usuário tem permissões de administrador
 */
const createRequireAdminMiddleware = () => {
    return async (request, reply) => {
        // Nota: Necessário usar type assertion para contornar a limitação do TypeScript
        const auth = request.auth;
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
exports.createRequireAdminMiddleware = createRequireAdminMiddleware;
// Funções auxiliares para registrar os middlewares no Fastify
const registerAuthMiddleware = (fastify, authServiceUrl) => {
    const authenticateMiddleware = (0, exports.createAuthenticateMiddleware)(authServiceUrl);
    const requireAdminMiddleware = (0, exports.createRequireAdminMiddleware)();
    fastify.decorate('authenticate', authenticateMiddleware);
    fastify.decorate('requireAdmin', requireAdminMiddleware);
};
exports.registerAuthMiddleware = registerAuthMiddleware;

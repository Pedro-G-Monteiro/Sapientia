import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Controller para obter informações do usuário autenticado
 */
export const getMeController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // O middleware de autenticação já adicionou o usuário ao decorador 'auth'
    if (!request.auth || !request.auth.user) {
      return reply.status(401).send({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const user = request.auth.user;

    // Retorna as informações do usuário
    return reply.status(200).send({
      status: 'success',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture_url: user.profile_picture_url,
          bio: user.bio,
          is_admin: user.is_admin,
          organization_id: user.organization_id
        }
      }
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      status: 'error',
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
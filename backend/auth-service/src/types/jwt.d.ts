import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    jwtSign(payload: object, options?: any): Promise<string>;
  }

  interface FastifyRequest {
    jwtVerify<T = any>(): Promise<T>;
  }
}

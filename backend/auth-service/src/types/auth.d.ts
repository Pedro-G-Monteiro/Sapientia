import 'fastify';

export interface AuthUser {
  sub: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  bio?: string | null;
  roles: string[];
  organization_id?: number | null;
  aud: string;
  iat: number;
  exp: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    auth?: {
      user: AuthUser;
    };
  }
}

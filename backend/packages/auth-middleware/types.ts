export interface AuthUser {
  userId: string;
  email: string;
  roles: string[];
  aud?: string;
}

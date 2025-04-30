// lib/auth-utils.ts
import { Cookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const cookies = new Cookies();

// Token expiration time in days
const TOKEN_EXPIRATION = 7;

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface JwtPayload {
  exp: number;
  iat: number;
  user_id: number;
  username: string;
  email: string;
}

/**
 * Store authentication token in cookie
 */
export const setAuthCookie = (token: string) => {
  // Calculate expiration date
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + TOKEN_EXPIRATION);
  
  // Set secure cookie
  cookies.set('authToken', token, {
    path: '/',
    expires: expirationDate,
    sameSite: 'strict',
    // In production, you should set secure: true for HTTPS
    secure: process.env.NODE_ENV === 'production',
    // HttpOnly would be better but it requires server-side rendering
    // for client-side authentication checks
  });
};

/**
 * Get authentication token from cookie
 */
export const getAuthToken = (): string | undefined => {
  return cookies.get('authToken');
};

/**
 * Remove authentication token cookie
 */
export const removeAuthCookie = () => {
  cookies.remove('authToken', { path: '/' });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Decode token to check expiration
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    // If token is invalid or expired
    removeAuthCookie();
    return false;
  }
};

/**
 * Get current user data from token
 */
export const getCurrentUser = (): UserData | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Extract user data from JWT payload
    // Based on the token format you shared
    return {
      user_id: decoded.user_id,
      username: decoded.username,
      email: decoded.email,
      first_name: "", // These fields are not typically in the JWT payload 
      last_name: ""   // They would be fetched from an API if needed
    };
  } catch (error) {
    return null;
  }
};

/**
 * Validate password strength
 * @returns Object with validation result and strength level
 */
export const validatePasswordStrength = (password: string) => {
  if (!password) {
    return { valid: false, strength: '', message: 'Password is required' };
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  // Build validation messages
  const requirements = [];
  if (!isLongEnough) requirements.push('be at least 8 characters long');
  if (!hasLowerCase) requirements.push('include lowercase letters');
  if (!hasUpperCase) requirements.push('include uppercase letters');
  if (!hasDigit) requirements.push('include numbers');
  if (!hasSpecialChar) requirements.push('include special characters');

  let strength = '';
  let valid = false;
  
  if (isLongEnough && hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar) {
    strength = 'strong';
    valid = true;
  } else if (isLongEnough && ((hasLowerCase && hasUpperCase) || (hasDigit && hasSpecialChar))) {
    strength = 'medium';
    valid = isLongEnough; // Valid if at least length requirement is met
  } else {
    strength = 'weak';
    valid = false;
  }

  // Build message
  let message = '';
  if (requirements.length > 0) {
    message = `Your password must ${requirements.join(', ')}`;
  } else {
    message = 'Your password meets all requirements';
  }
  
  return { valid, strength, message };
};

/**
 * Login user with credentials
 * @returns Promise with login result
 */
export const loginWithCredentials = async (email: string, password: string) => {
  // Import dynamically to avoid circular dependency
  const { apiFetch } = await import('./api');
  
  const response = await apiFetch<{
    status: string;
    message: string;
    data: {
      user: UserData;
      token: string;
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store the token in cookie
  //@ts-expect-error Data.token is not defined in the type
  setAuthCookie(response.data.token);
  
  return response;
};

/**
 * Register a new user
 * @returns Promise with registration result
 */
export const registerUser = async (userData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}) => {
  // Import dynamically to avoid circular dependency
  const { apiFetch } = await import('./api');
  
  return await apiFetch<{
    status: string;
    message: string;
    data: {
      user: UserData;
    };
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Register and login in one operation
 * @returns Promise with login result after registration
 */
export const registerAndLogin = async (userData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}) => {
  // First register the user
  await registerUser(userData);
  
  // Then login with the credentials
  return await loginWithCredentials(userData.email, userData.password);
};

/**
 * Logout user - removes auth cookie and optionally calls backend
 * @param callApi - Whether to call the logout API endpoint (default: true)
 * @returns Promise that resolves when logout is complete
 */
export const logout = async (callApi: boolean = true): Promise<void> => {
  try {
    // Call logout API endpoint if requested and if user is logged in
    if (callApi && isAuthenticated()) {
      const { apiFetch } = await import('./api');
      try {
        await apiFetch('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn('Error calling logout API:', error);
        // Continue with client-side logout even if API call fails
      }
    }
  } finally {
    // Always remove the auth cookie, even if API call fails
    removeAuthCookie();
  }
};

/**
 * Clear all auth data and reload the page
 * Complete reset of authentication state
 */
export const forceLogout = (): void => {
  removeAuthCookie();
  // Force reload the page to reset all application state
  window.location.href = '/login';
};
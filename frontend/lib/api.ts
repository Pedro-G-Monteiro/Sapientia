import { getAuthToken } from "./auth-utils";

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/v1${endpoint}`;
  
  // Set default headers
  const headers = new Headers(options.headers);
  
  // Set content type for JSON requests
  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add authorization token if available
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Merge headers with options
  const configOptions = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, configOptions);
    const data = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred while fetching data',
        response.status
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors, JSON parsing errors, etc.
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}
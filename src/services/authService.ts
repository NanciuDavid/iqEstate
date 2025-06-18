/**
 * Authentication Service for EstateIQ Frontend
 * 
 * This service handles all authentication-related API calls including
 * login, registration, password reset, and user session management.
 */

import { apiService, TokenManager, type ApiResponse } from './api';

/**
 * User interface for authentication responses
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  userType?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Backend profile interface for profile endpoint responses
 */
export interface BackendProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Backend user interface for login/register responses
 */
export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  user_type: string;
  profile_picture_url?: string;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request interface
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  user: BackendUser;
  token: string;
  message?: string;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation interface
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User favorite property interface
 */
export interface UserFavorite {
  id: string;
  title: string;
  price: number | null;
  predictedPrice: number | null;
  surface: number | null;
  bedrooms: number | null;
  address: string;
  city: string;
  type: string;
  image: string | null;
  dateSaved: string;
  notes: string | null;
}

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials, false);
    
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    
    return response;
  }
  
  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData, false);
    
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    
    return response;
  }
  
  /**
   * Logout user (clear token)
   */
  logout(): void {
    console.log('🔐 AuthService - Logging out user...');
    console.log('🔐 Token before logout:', TokenManager.getToken()?.substring(0, 50) + '...');
    
    TokenManager.removeToken();
    
    console.log('🔐 Token after logout:', TokenManager.getToken());
    console.log('🔐 Is authenticated after logout:', TokenManager.isAuthenticated());
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }
  
  /**
   * Get current user token
   */
  getToken(): string | null {
    return TokenManager.getToken();
  }
  
  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<ApiResponse<BackendProfile>> {
    return apiService.get<BackendProfile>('/auth/me');
  }
  
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/forgot-password', { email }, false);
  }
  
  /**
   * Reset password with token
   */
  async resetPassword(resetData: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/reset-password', resetData, false);
  }
  
  /**
   * Update user profile
   */
  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.put<{ message: string }>('/users/profile', profileData);
  }
  
  /**
   * Change password
   */
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/users/change-password', passwordData);
  }

  /**
   * Get user favorites
   */
  async getUserFavorites(): Promise<ApiResponse<UserFavorite[]>> {
    return apiService.get<UserFavorite[]>('/users/favorites');
  }

  /**
   * Add property to favorites
   */
  async addToFavorites(propertyId: string, notes?: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(`/users/favorites/${propertyId}`, { notes });
  }

  /**
   * Remove property from favorites
   */
  async removeFromFavorites(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/users/favorites/${propertyId}`);
  }
}

// Export singleton instance
export const authService = new AuthService(); 
/**
 * API Service Configuration for EstateIQ Frontend
 * 
 * This file provides the base API configuration and utilities for communicating
 * with the EstateIQ backend services. It handles authentication, error handling,
 * and provides a consistent interface for all API calls.
 */

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * HTTP Methods supported by the API
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API Response interface for consistent response handling
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Request configuration interface
 */
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * Cookie utility functions
 */
class CookieManager {
  static setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    const cookieOptions = [
      `${name}=${value}`,
      `expires=${expires.toUTCString()}`,
      'path=/',
      'SameSite=Strict'
    ];
    
    // Add Secure flag in production (HTTPS)
    if (window.location.protocol === 'https:') {
      cookieOptions.push('Secure');
    }
    
    document.cookie = cookieOptions.join('; ');
  }
  
  static getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }
  
  static deleteCookie(name: string): void {
    console.log('🍪 Deleting cookie:', name);
    
    // Delete cookie with multiple variations to ensure it's removed
    const deleteOptions = [
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
      `${name}=; Max-Age=0; path=/;`,
      `${name}=; Max-Age=0; path=/; domain=${window.location.hostname};`
    ];
    
    deleteOptions.forEach(option => {
      document.cookie = option;
      console.log('🍪 Applied cookie deletion:', option);
    });
    
    // Verify deletion
    const stillExists = CookieManager.getCookie(name);
    console.log('🍪 Cookie still exists after deletion:', !!stillExists);
  }
}

/**
 * Authentication token management using cookies
 */
class TokenManager {
  private static readonly TOKEN_KEY = 'estateiq_token';
  private static listeners: Array<() => void> = [];
  
  static getToken(): string | null {
    const token = CookieManager.getCookie(this.TOKEN_KEY);
    if (token) {
      console.log('🔐 Retrieved token from cookie:', {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 50) + '...',
        fullToken: token // Log full token for debugging
      });
      
      // Try to decode the token to see its contents
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔐 Token payload:', {
          userId: payload.id,
          email: payload.email,
          userType: payload.userType,
          exp: payload.exp,
          expiryDate: new Date(payload.exp * 1000),
          iat: payload.iat,
          issuedDate: new Date(payload.iat * 1000)
        });
      } catch (error) {
        console.error('🔐 Failed to decode token payload:', error);
      }
    }
    return token;
  }
  
  static setToken(token: string): void {
    // Set cookie with 7-day expiration (matching JWT expiration)
    CookieManager.setCookie(this.TOKEN_KEY, token, 7);
    
    // Notify listeners of token change
    this.notifyListeners();
  }
  
  static removeToken(): void {
    console.log('🔐 TokenManager - Removing token...');
    console.log('🔐 Token exists before removal:', !!this.getToken());
    
    CookieManager.deleteCookie(this.TOKEN_KEY);
    
    // Verify removal
    const tokenAfterRemoval = CookieManager.getCookie(this.TOKEN_KEY);
    console.log('🔐 Token exists after removal:', !!tokenAfterRemoval);
    
    // Notify listeners of token removal
    this.notifyListeners();
    
    console.log('🔐 TokenManager - Token removal complete, listeners notified');
  }
  
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('🔐 No token found in cookies');
      return false;
    }
    
    try {
      // Basic token validation - check if it's not expired
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('🔐 Token format invalid - not a valid JWT');
        this.removeToken();
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token has expiration
      if (!payload.exp) {
        console.error('🔐 Token missing expiration field');
        this.removeToken();
        return false;
      }

      const tokenExpiry = payload.exp * 1000;
      const currentTime = Date.now();
      const isExpired = tokenExpiry <= currentTime;
      
      console.log('🔐 Token validation in API service:', {
        tokenExpiry: new Date(tokenExpiry),
        currentTime: new Date(currentTime),
        isExpired: isExpired,
        timeLeft: Math.round((tokenExpiry - currentTime) / 1000 / 60) + ' minutes',
        rawTokenExpiry: tokenExpiry,
        rawCurrentTime: currentTime,
        comparison: `${tokenExpiry} <= ${currentTime} = ${isExpired}`
      });
      
      if (isExpired) {
        console.log('🔐 Token expired in API service, removing token');
        this.removeToken();
        return false;
      }
      
      // Additional validation: check if required fields exist
      if (!payload.id || !payload.email) {
        console.error('🔐 Token missing required fields:', {
          hasId: !!payload.id,
          hasEmail: !!payload.email,
          payload: payload
        });
        this.removeToken();
        return false;
      }
      
      console.log('🔐 Token validation passed - user is authenticated');
      return true;
    } catch (error) {
      console.error('🔐 Token validation error during parsing:', error);
      console.error('🔐 Error details:', {
        errorMessage: error instanceof Error ? error.message : String(error),
        tokenLength: token.length,
        tokenPreview: token.substring(0, 100) + '...'
      });
      
      // Don't remove token immediately - could be a temporary parsing issue
      // Instead, try one more time after a small delay
      console.warn('🔐 Token parsing failed - this might be a temporary issue during page load');
      
      // For now, return false but don't remove token immediately
      // The makeRequest method will handle auth failures properly
      return false;
    }
  }
  
  // Add listener for token changes
  static addListener(listener: () => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Notify all listeners of token changes
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in token change listener:', error);
      }
    });
  }
}

/**
 * Main API class for handling HTTP requests
 */
class ApiService {
  private baseURL: string;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  
  /**
   * Make HTTP request to the API
   */
  private async makeRequest<T>(
    endpoint: string, 
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    
    // Add authentication token if required
    if (config.requireAuth !== false) {
      const token = TokenManager.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Sending request with token from cookie:', {
          endpoint,
          tokenLength: token.length,
          tokenStart: token.substring(0, 20) + '...',
          authHeader: `Bearer ${token.substring(0, 20)}...`
        });
      } else {
        console.log('🔐 No token available in cookies for authenticated request to:', endpoint);
      }
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method: config.method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined
    };
    
    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      
      // Handle authentication errors
      if (response.status === 401) {
        console.warn('🔐 Authentication failed, clearing token from cookies');
        console.log('🔐 401 Response details:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          responseData: data
        });
        TokenManager.removeToken();
        // Don't automatically redirect - let components handle this
        return {
          success: false,
          error: 'Authentication required'
        };
      }
      
      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', requireAuth });
  }
  
  /**
   * POST request
   */
  async post<T>(
    endpoint: string, 
    data?: unknown, 
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { 
      method: 'POST', 
      body: data, 
      requireAuth 
    });
  }
  
  /**
   * PUT request
   */
  async put<T>(
    endpoint: string, 
    data?: unknown, 
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data, 
      requireAuth 
    });
  }
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export TokenManager for use in components
export { TokenManager };

// Export types for use in other files
export type { ApiResponse }; 
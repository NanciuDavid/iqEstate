import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authService, User, BackendProfile, LoginRequest, RegisterRequest } from '../services/authService';
import { TokenManager } from '../services/api';
import { authKeys } from '../lib/queryKeys';

// Transform backend user data to frontend User interface
const transformUser = (backendProfile: BackendProfile): User => {
  return {
    id: backendProfile.id,
    email: backendProfile.email,
    name: `${backendProfile.firstName} ${backendProfile.lastName}`,
    role: 'user',
    userType: backendProfile.userType,
    phoneNumber: backendProfile.phoneNumber,
    createdAt: backendProfile.createdAt,
    updatedAt: backendProfile.updatedAt,
  };
};

// Check if user is authenticated by token existence
const isAuthenticated = (): boolean => {
  return TokenManager.isAuthenticated();
};

// Hook to get current user - only call when explicitly needed
export const useUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      if (!isAuthenticated()) {
        console.log('🔐 useUser - Not authenticated, returning null');
        return null;
      }
      
      console.log('🔐 useUser - Fetching user profile...');
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          console.log('🔐 useUser - Profile fetched successfully');
          return transformUser(response.data);
        }
        console.warn('🔐 useUser - Profile fetch failed, but not clearing token');
        return null;
      } catch (error) {
        console.error('🔐 useUser - Failed to get user, but keeping token:', error);
        // Don't clear token automatically on API failure - let the API service handle it
        return null;
      }
    },
    enabled: enabled && isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry auth failures
  });
};

// Simple hook for basic authentication state using cookie-based listeners
export const useAuthState = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: isAuthenticated(),
    isLoading: false,
  });

  useEffect(() => {
    // Update auth state when token changes
    const checkAuth = () => {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: isAuthenticated(),
      }));
    };

    // Check auth state on mount
    checkAuth();
    
    // Listen for token changes using the new TokenManager listener system
    const unsubscribe = TokenManager.addListener(() => {
      console.log('🔄 Auth state: Token changed, updating authentication state');
      checkAuth();
    });
    
    return unsubscribe;
  }, []);

  return authState;
};

// Hook to check authentication status
export const useAuth = (loadUserProfile: boolean = false) => {
  const queryClient = useQueryClient();
  const userQuery = useUser(loadUserProfile);
  const authState = useAuthState();

  const login = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      console.log('🔐 useAuth - Starting login...');
      
      // Clear any existing auth data first
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      const response = await authService.login(credentials);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Login failed');
      }
      console.log('🔐 useAuth - Login successful');
      return response.data!;
    },
    onSuccess: (data) => {
      console.log('🔐 useAuth - Processing login success...');
      
      // Transform backend user data and set in cache
      const user = transformUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        userType: data.user.user_type,
        phoneNumber: '',
        isVerified: data.user.is_verified,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      });
      queryClient.setQueryData(authKeys.user(), user);
      
      console.log('🔐 useAuth - User data cached, login complete');
    },
    onError: (error) => {
      console.error('🔐 useAuth - Login failed:', error);
      // Clear any cached data on login failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });

  const register = useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Registration failed');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Transform backend user data and set in cache
      const user = transformUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        userType: data.user.user_type,
        phoneNumber: '',
        isVerified: data.user.is_verified,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      });
      queryClient.setQueryData(authKeys.user(), user);
      
      // Don't automatically invalidate queries - let components fetch when needed
      // queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      console.log('🔐 useAuth - Starting logout...');
      authService.logout();
      console.log('🔐 useAuth - AuthService logout complete');
    },
    onSuccess: () => {
      console.log('🔐 useAuth - Clearing all cached data...');
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // Force a page refresh to clear any stale state
      setTimeout(() => {
        console.log('🔐 useAuth - Refreshing page to clear state...');
        window.location.reload();
      }, 100);
    },
    onError: (error) => {
      console.error('🔐 useAuth - Logout failed:', error);
      // Even if logout fails, clear local data
      queryClient.removeQueries({ queryKey: authKeys.all });
      TokenManager.removeToken();
      
      // Force page refresh even on error
      setTimeout(() => {
        console.log('🔐 useAuth - Refreshing page after logout error...');
        window.location.reload();
      }, 100);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { name?: string; phoneNumber?: string }) => {
      // Transform name to firstName/lastName if provided
      const updateData: { firstName: string; lastName: string; phoneNumber?: string } = {
        firstName: '',
        lastName: '',
      };
      
      if (updates.name) {
        const nameParts = updates.name.split(' ');
        updateData.firstName = nameParts[0] || '';
        updateData.lastName = nameParts.slice(1).join(' ') || '';
      }
      
      if (updates.phoneNumber !== undefined) {
        updateData.phoneNumber = updates.phoneNumber;
      }
      
      const response = await authService.updateProfile(updateData);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Profile update failed');
      }
      return response;
    },
    onSuccess: () => {
      // Refetch user data to get updated profile
      userQuery.refetch();
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });

  const changePassword = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      if (!response.success) {
        throw new Error(response.error || response.message || 'Password change failed');
      }
    },
    onError: (error) => {
      console.error('Password change failed:', error);
    },
  });

  return {
    user: userQuery.data,
    // Use simple token-based auth state instead of API-dependent state
    isAuthenticated: authState.isAuthenticated,
    isLoading: loadUserProfile ? userQuery.isLoading : authState.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    
    // Mutations
    login: login.mutate,
    loginAsync: login.mutateAsync,
    isLoggingIn: login.isPending,
    loginError: login.error,
    
    register: register.mutate,
    registerAsync: register.mutateAsync,
    isRegistering: register.isPending,
    registerError: register.error,
    
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
    
    updateProfile: updateProfile.mutate,
    updateProfileAsync: updateProfile.mutateAsync,
    isUpdatingProfile: updateProfile.isPending,
    updateProfileError: updateProfile.error,
    
    changePassword: changePassword.mutate,
    changePasswordAsync: changePassword.mutateAsync,
    isChangingPassword: changePassword.isPending,
    changePasswordError: changePassword.error,
    
    // Utility functions
    refetchUser: userQuery.refetch,
  };
}; 
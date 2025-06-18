/**
 * Services Index
 * 
 * Central export file for all EstateIQ API services and types.
 * This provides a clean import interface for components.
 */

// Export services
export { apiService, TokenManager } from './api';
export { authService } from './authService';
export { propertyService } from './propertyService';
export { predictionService } from './predictionService';

// Export types from API service
export type { ApiResponse } from './api';

// Export types from Auth service
export type {
  User,
  BackendUser,
  BackendProfile,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  PasswordResetRequest,
  ResetPasswordRequest
} from './authService';

// Export types from Property service
export type {
  Property,
  PropertySearchFilters,
  CreatePropertyRequest,
  AreaSearchRequest,
  PaginatedResponse
} from './propertyService';

// Export types from Prediction service
export type {
  PricePredictionRequest,
  PricePredictionResponse,
  MarketTrendsRequest,
  MarketTrendsResponse,
  PredictionFactorsResponse,
  BatchPredictionRequest,
  BatchPredictionResponse
} from './predictionService'; 
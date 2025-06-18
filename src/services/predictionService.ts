/**
 * Prediction Service for EstateIQ Frontend
 * 
 * This service handles all AI prediction-related API calls including
 * price predictions, market analysis, and prediction factors.
 */

import { apiService, type ApiResponse } from './api';

/**
 * Price prediction request interface
 */
export interface PricePredictionRequest {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  yearBuilt?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
  features?: string[];
}

/**
 * Price prediction response interface
 */
export interface PricePredictionResponse {
  predictedPrice: number;
  confidence: number;
  priceRange: {
    min: number;
    max: number;
  };
  factors: {
    location: number;
    size: number;
    features: number;
    market: number;
  };
  comparableProperties: {
    id: string;
    address: string;
    price: number;
    similarity: number;
  }[];
  marketInsights: {
    averagePriceInArea: number;
    pricePerSqft: number;
    marketTrend: 'RISING' | 'STABLE' | 'DECLINING';
    demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

/**
 * Market trends request interface
 */
export interface MarketTrendsRequest {
  city?: string;
  state?: string;
  propertyType?: string;
  timeframe?: '3M' | '6M' | '1Y' | '2Y' | '5Y';
}

/**
 * Market trends response interface
 */
export interface MarketTrendsResponse {
  location: string;
  timeframe: string;
  trends: {
    date: string;
    averagePrice: number;
    volume: number;
    priceChange: number;
  }[];
  summary: {
    currentAveragePrice: number;
    priceChangePercent: number;
    totalVolume: number;
    forecast: {
      nextMonth: number;
      nextQuarter: number;
      nextYear: number;
    };
  };
  marketSegments: {
    propertyType: string;
    averagePrice: number;
    volume: number;
    priceChange: number;
  }[];
}

/**
 * Prediction factors response interface
 */
export interface PredictionFactorsResponse {
  factors: {
    name: string;
    weight: number;
    description: string;
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  }[];
  locationFactors: {
    schoolRating: number;
    crimeRate: number;
    proximityToTransport: number;
    walkScore: number;
    neighborhoodRating: number;
  };
  marketFactors: {
    inventory: number;
    daysOnMarket: number;
    priceReductions: number;
    salesVelocity: number;
  };
}

/**
 * Batch prediction request for multiple properties
 */
export interface BatchPredictionRequest {
  properties: PricePredictionRequest[];
}

/**
 * Batch prediction response
 */
export interface BatchPredictionResponse {
  predictions: (PricePredictionResponse & { propertyIndex: number })[];
  summary: {
    totalProperties: number;
    averagePredictedPrice: number;
    averageConfidence: number;
    processingTime: number;
  };
}

/**
 * Prediction Service Class
 */
class PredictionService {
  /**
   * Get price prediction for a property
   */
  async getPricePrediction(propertyData: PricePredictionRequest): Promise<ApiResponse<PricePredictionResponse>> {
    return apiService.post<PricePredictionResponse>('/predict/price', propertyData);
  }
  
  /**
   * Get batch price predictions for multiple properties
   */
  async getBatchPredictions(batchData: BatchPredictionRequest): Promise<ApiResponse<BatchPredictionResponse>> {
    return apiService.post<BatchPredictionResponse>('/predict/batch', batchData);
  }
  
  /**
   * Get market trends for a specific area
   */
  async getMarketTrends(trendsRequest?: MarketTrendsRequest): Promise<ApiResponse<MarketTrendsResponse>> {
    return apiService.post<MarketTrendsResponse>('/predict/market-trends', trendsRequest || {});
  }
  
  /**
   * Get prediction factors and their weights
   */
  async getPredictionFactors(): Promise<ApiResponse<PredictionFactorsResponse>> {
    return apiService.get<PredictionFactorsResponse>('/predict/factors');
  }
  
  /**
   * Get location-specific prediction factors
   */
  async getLocationFactors(location: {
    city: string;
    state: string;
    zipCode?: string;
  }): Promise<ApiResponse<PredictionFactorsResponse['locationFactors']>> {
    return apiService.post<PredictionFactorsResponse['locationFactors']>('/predict/location-factors', location);
  }
  
  /**
   * Get market analysis for investment decisions
   */
  async getInvestmentAnalysis(propertyData: PricePredictionRequest): Promise<ApiResponse<{
    roi: number;
    paybackPeriod: number;
    cashFlow: number;
    appreciation: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendation: 'BUY' | 'HOLD' | 'AVOID';
    reasoning: string[];
  }>> {
    return apiService.post('/predict/investment-analysis', propertyData);
  }
  
  /**
   * Compare property predictions
   */
  async compareProperties(properties: PricePredictionRequest[]): Promise<ApiResponse<{
    properties: (PricePredictionResponse & { propertyIndex: number })[];
    comparison: {
      bestValue: number;
      highestPrediction: number;
      mostConfident: number;
      averagePrice: number;
    };
    recommendations: {
      propertyIndex: number;
      reason: string;
      score: number;
    }[];
  }>> {
    return apiService.post('/predict/compare', { properties });
  }
  
  /**
   * Get historical prediction accuracy
   */
  async getPredictionAccuracy(): Promise<ApiResponse<{
    overallAccuracy: number;
    accuracyByPropertyType: Record<string, number>;
    accuracyByPriceRange: Record<string, number>;
    accuracyTrend: {
      month: string;
      accuracy: number;
    }[];
    modelVersion: string;
    lastUpdated: string;
  }>> {
    return apiService.get('/predict/accuracy');
  }
  
  /**
   * Save prediction to user's history
   */
  async savePrediction(
    predictionData: PricePredictionRequest,
    predictionResult: PricePredictionResponse
  ): Promise<ApiResponse<{ id: string; message: string }>> {
    return apiService.post('/predict/save', {
      request: predictionData,
      result: predictionResult
    });
  }
  
  /**
   * Get user's prediction history
   */
  async getPredictionHistory(): Promise<ApiResponse<{
    id: string;
    request: PricePredictionRequest;
    result: PricePredictionResponse;
    createdAt: string;
  }[]>> {
    return apiService.get('/predict/history');
  }
}

// Export singleton instance
export const predictionService = new PredictionService(); 
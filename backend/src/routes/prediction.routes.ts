import { Router } from 'express';
import {
  generatePricePrediction,
  getPredictionFactors,
  getMarketTrends
} from '../controllers/predictionController';

const router = Router();

/**
 * PREDICTION ROUTES
 * 
 * These routes handle AI price prediction functionality:
 * - Price prediction for properties
 * - Information about prediction factors
 * - Market trends and analysis
 * 
 * These are mostly public routes since the prediction tool
 * should be accessible to all visitors to encourage engagement.
 */

// POST /api/predict/price - Generate price prediction for a property
// This is the main prediction endpoint used by the prediction form
// Expects property details in request body and returns predicted price with analysis
router.post('/price', generatePricePrediction);

// GET /api/predict/factors - Get information about prediction factors
// Returns details about what factors influence price predictions
// Useful for educational content and "how it works" sections
router.get('/factors', getPredictionFactors);

// GET /api/predict/market-trends - Get market trends data
// Returns market analysis and trends for specified city/area
// Query parameters: city, timeframe
// Example: /api/predict/market-trends?city=București&timeframe=12months
router.get('/market-trends', getMarketTrends);

export default router; 
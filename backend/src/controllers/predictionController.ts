import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PRICE PREDICTION CONTROLLER
 * 
 * This controller handles AI price prediction functionality for EstateIQ:
 * - Processing price prediction requests from the frontend form
 * - Interfacing with ML models (Python service or cloud service)
 * - Storing prediction results
 * - Providing prediction explanations and confidence scores
 * 
 * Currently set up as a mock implementation that you can later connect
 * to your actual Python ML model service.
 */

// Interface for prediction request data
interface PredictionRequest {
  propertyType: string;
  location: {
    city: string;
    county?: string;
    latitude?: number;
    longitude?: number;
  };
  surface: number;
  rooms: number;
  bathrooms?: number;
  yearBuilt?: number;
  condition?: string;
  features?: string[];
  nearbyAmenities?: {
    hasSchool?: boolean;
    hasPark?: boolean;
    hasTransport?: boolean;
    hasSupermarket?: boolean;
  };
}

// Interface for prediction response
interface PredictionResponse {
  predictedPrice: number;
  confidence: number;
  priceRange: {
    min: number;
    max: number;
  };
  factors: {
    positive: Array<{ factor: string; impact: string; description: string }>;
    negative: Array<{ factor: string; impact: string; description: string }>;
  };
  methodology: string;
  comparableProperties?: number;
}

// POST /api/predict/price - Generate price prediction for a property
export const generatePricePrediction = async (req: Request, res: Response): Promise<any> => {
  try {
    const predictionData: PredictionRequest = req.body;

    // Validate required fields
    if (!predictionData.propertyType || !predictionData.location?.city || !predictionData.surface || !predictionData.rooms) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: propertyType, location.city, surface, and rooms are required'
      });
    }

    // TODO: Replace this mock implementation with actual ML model integration
    // You would call your Python ML service here like:
    // const mlResponse = await callPythonMLService(predictionData);
    
    const mockPrediction = await generateMockPrediction(predictionData);

    // Store the prediction in the database for future reference
    // (Optional - you might want to track predictions for analytics)
    try {
      // This would be for actual property predictions, not standalone tool predictions
      // You could create a separate table for standalone predictions if needed
      console.log('Prediction generated for:', predictionData.location.city);
    } catch (error) {
      console.error('Error storing prediction:', error);
      // Don't fail the whole request if storage fails
    }

    return res.status(200).json({
      success: true,
      data: mockPrediction
    });

  } catch (error) {
    console.error('Error generating price prediction:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while generating price prediction'
    });
  }
};

// GET /api/predict/factors - Get factors that influence price predictions
export const getPredictionFactors = async (req: Request, res: Response): Promise<any> => {
  try {
    // This endpoint provides information about what factors influence predictions
    const factors = {
      propertySpecific: [
        {
          name: 'Surface Area',
          description: 'Larger properties typically command higher prices',
          weight: 'High',
          category: 'Physical'
        },
        {
          name: 'Number of Rooms',
          description: 'More rooms generally increase property value',
          weight: 'High',
          category: 'Physical'
        },
        {
          name: 'Year Built',
          description: 'Newer properties often have higher values due to modern amenities',
          weight: 'Medium',
          category: 'Physical'
        },
        {
          name: 'Property Condition',
          description: 'Well-maintained properties command premium prices',
          weight: 'High',
          category: 'Physical'
        }
      ],
      locationBased: [
        {
          name: 'Neighborhood Desirability',
          description: 'Prime locations with good reputation increase value',
          weight: 'Very High',
          category: 'Location'
        },
        {
          name: 'Proximity to Schools',
          description: 'Access to quality education increases family appeal',
          weight: 'Medium',
          category: 'Amenities'
        },
        {
          name: 'Transport Links',
          description: 'Easy access to public transport and highways',
          weight: 'Medium',
          category: 'Accessibility'
        },
        {
          name: 'Local Amenities',
          description: 'Shops, restaurants, and services nearby',
          weight: 'Medium',
          category: 'Amenities'
        }
      ],
      marketFactors: [
        {
          name: 'Supply and Demand',
          description: 'Balance of available properties vs buyer interest',
          weight: 'Very High',
          category: 'Market'
        },
        {
          name: 'Interest Rates',
          description: 'Lower rates increase buying power and demand',
          weight: 'High',
          category: 'Economic'
        },
        {
          name: 'Local Economic Growth',
          description: 'Job market and economic health of the area',
          weight: 'Medium',
          category: 'Economic'
        }
      ]
    };

    return res.status(200).json({
      success: true,
      data: factors
    });

  } catch (error) {
    console.error('Error fetching prediction factors:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching prediction factors'
    });
  }
};

// Helper function to generate mock predictions
// TODO: Replace this with actual ML model integration
async function generateMockPrediction(data: PredictionRequest): Promise<PredictionResponse> {
  // This is a simple mock algorithm - replace with your actual ML model
  
  // Base price calculation based on surface area and location
  let basePrice = data.surface * 1000; // €1000 per sqm base rate
  
  // Location multipliers (mock data - you'd have real data from your model)
  const locationMultipliers: { [key: string]: number } = {
    'București': 1.8,
    'Cluj-Napoca': 1.5,
    'Timișoara': 1.3,
    'Constanța': 1.2,
    'Iași': 1.1,
    'Craiova': 1.0,
    'Brașov': 1.4,
    'Galați': 0.9,
    'Ploiești': 1.0,
    'Oradea': 1.1
  };

  const cityMultiplier = locationMultipliers[data.location.city] || 1.0;
  basePrice *= cityMultiplier;

  // Property type adjustments
  const typeMultipliers: { [key: string]: number } = {
    'apartment': 1.0,
    'house': 1.2,
    'villa': 1.5,
    'duplex': 1.3,
    'studio': 0.8,
    'penthouse': 1.8
  };

  const typeMultiplier = typeMultipliers[data.propertyType.toLowerCase()] || 1.0;
  basePrice *= typeMultiplier;

  // Room count adjustment
  const roomMultiplier = Math.max(0.8, Math.min(1.4, data.rooms * 0.15 + 0.7));
  basePrice *= roomMultiplier;

  // Age adjustment
  if (data.yearBuilt) {
    const age = new Date().getFullYear() - data.yearBuilt;
    const ageMultiplier = Math.max(0.7, 1 - (age * 0.005)); // 0.5% decrease per year
    basePrice *= ageMultiplier;
  }

  // Calculate final price and confidence
  const finalPrice = Math.round(basePrice);
  const confidence = 0.85; // Mock confidence score
  
  // Generate price range (±15% typically)
  const range = finalPrice * 0.15;
  const priceRange = {
    min: Math.round(finalPrice - range),
    max: Math.round(finalPrice + range)
  };

  // Generate factors that influenced the prediction
  const factors = {
    positive: [
      {
        factor: 'Prime Location',
        impact: `+${Math.round((cityMultiplier - 1) * 100)}%`,
        description: `${data.location.city} is a desirable location with good market demand`
      },
      {
        factor: 'Good Size',
        impact: '+12%',
        description: `${data.surface}m² provides comfortable living space`
      }
    ] as Array<{ factor: string; impact: string; description: string }>,
    negative: [] as Array<{ factor: string; impact: string; description: string }>
  };

  // Add negative factors if applicable
  if (data.yearBuilt && (new Date().getFullYear() - data.yearBuilt) > 30) {
    factors.negative.push({
      factor: 'Property Age',
      impact: '-8%',
      description: `Built in ${data.yearBuilt}, may require modernization`
    });
  }

  return {
    predictedPrice: finalPrice,
    confidence,
    priceRange,
    factors,
    methodology: 'Our AI model analyzes over 50 factors including property characteristics, location data, recent sales, and market trends to provide accurate price predictions.',
    comparableProperties: Math.floor(Math.random() * 20) + 10 // Mock number of comparable properties
  };
}

// GET /api/predict/market-trends - Get market trends for analysis
export const getMarketTrends = async (req: Request, res: Response): Promise<any> => {
  try {
    const { city, timeframe = '12months' } = req.query;

    // This would fetch real market data from your database
    // For now, providing mock data structure that matches your frontend expectations
    
    const mockTrends = {
      city: city || 'București',
      timeframe,
      priceIndex: {
        current: 156.7,
        change: '+5.2%',
        changeDirection: 'up'
      },
      averagePrices: {
        apartment: 125000,
        house: 180000,
        villa: 320000
      },
      marketMetrics: {
        daysOnMarket: 45,
        priceReduction: '12%',
        demandIndex: 78,
        supplyIndex: 65
      },
      predictions: {
        nextQuarter: '+3.1%',
        nextYear: '+8.5%',
        confidence: 0.73
      },
      factors: [
        {
          name: 'Interest Rates',
          impact: 'positive',
          description: 'Historically low interest rates driving demand'
        },
        {
          name: 'Supply Shortage',
          impact: 'positive',
          description: 'Limited new construction increasing property values'
        },
        {
          name: 'Economic Growth',
          impact: 'positive',
          description: 'Strong local economy supporting price growth'
        }
      ]
    };

    return res.status(200).json({
      success: true,
      data: mockTrends
    });

  } catch (error) {
    console.error('Error fetching market trends:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching market trends'
    });
  }
};

/**
 * INTEGRATION WITH PYTHON ML MODEL
 * 
 * When you're ready to integrate with your actual Python ML model,
 * you can replace the mock functions above with real API calls.
 * 
 * Here's an example of how you might call a Python Flask/FastAPI service:
 * 
 * async function callPythonMLService(data: PredictionRequest) {
 *   try {
 *     const response = await fetch(process.env.ML_MODEL_API_URL + '/predict', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json'
 *       },
 *       body: JSON.stringify(data)
 *     });
 *     
 *     if (!response.ok) {
 *       throw new Error('ML service error');
 *     }
 *     
 *     return await response.json();
 *   } catch (error) {
 *     console.error('Error calling ML service:', error);
 *     throw error;
 *   }
 * }
 */ 
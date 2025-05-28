import React, { useState } from 'react';
import {
  LineChart, BarChart, ArrowUp, ArrowDown, Info, TrendingUp, DollarSign, Users, Hammer, Landmark, Activity, 
  MapPin, Ruler, Calendar, Award, BedDouble, Percent, Briefcase, Home
} from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyPriceDashboardProps {
  property: Property;
}

const PropertyPriceDashboard: React.FC<PropertyPriceDashboardProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState('prediction');
  
  // Calculate price difference between actual and predicted
  const priceDifference = property.predictedPrice ? property.predictedPrice - property.price : 0;
  const priceDifferencePercent = property.price ? (priceDifference / property.price) * 100 : 0;
  const isPriceHigher = priceDifference > 0;

  // Mock data for charts - in a real app, this would come from the backend
  const mockFactors = [
    { 
      name: 'Location Premium', 
      impact: 5.2, 
      description: 'Property is in a high-demand neighborhood with good schools and amenities.',
      icon: <MapPin className="w-5 h-5 text-blue-600" />
    },
    { 
      name: 'Property Size (SqFt)',
      impact: 3.8, 
      description: 'Square footage is above average for the area, contributing positively.',
      icon: <Ruler className="w-5 h-5 text-indigo-600" />
    },
    { 
      name: 'Property Age', 
      impact: -1.5, 
      description: 'The building age slightly reduces the property value compared to newer constructions.',
      icon: <Calendar className="w-5 h-5 text-orange-600" />
    },
    {
      name: 'Condition & Renovations', 
      impact: property.tags.includes('Renovated') ? 4.5 : (property.yearBuilt < 2000 ? -1.0 : 0.5),
      description: property.tags.includes('Renovated') ? 'Recent renovations significantly add value.' : (property.yearBuilt < 2000 ? 'Older property, may require updates.' : 'Good condition, standard for its age.'),
      icon: <Award className="w-5 h-5 text-green-600" />
    },
    {
      name: 'Number of Bedrooms',
      impact: property.bedrooms > 2 ? (property.bedrooms - 2) * 1.5 : 0,
      description: `Having ${property.bedrooms} bedrooms is ${property.bedrooms > 2 ? 'a positive factor' : (property.bedrooms === 2 ? 'standard' : 'a slight negative factor')} for this property type.`,
      icon: <BedDouble className="w-5 h-5 text-purple-600" />
    }
  ];

  const mockEconomicFactors = [
    {
      name: 'Interest Rates',
      trend: 'Moderately High',
      impact: 'Negative',
      description: 'Current interest rates (e.g., 5-6%) make borrowing more expensive, potentially cooling demand.',
      icon: <Percent className="w-5 h-5 text-red-500" />
    },
    {
      name: 'Local Employment Growth',
      trend: 'Positive (2.5% YoY)',
      impact: 'Positive',
      description: 'Strong job growth in the area increases housing demand and supports property values.',
      icon: <Briefcase className="w-5 h-5 text-green-500" />
    },
    {
      name: 'Inflation Rate',
      trend: 'Elevated (3.5%)',
      impact: 'Mixed',
      description: 'While inflation can drive up asset prices, it also strains affordability for buyers.',
      icon: <TrendingUp className="w-5 h-5 text-yellow-500" />
    },
    {
      name: 'Housing Supply & Demand',
      trend: 'Low Supply, High Demand',
      impact: 'Positive',
      description: 'Limited housing inventory relative to demand continues to put upward pressure on prices.',
      icon: <Home className="w-5 h-5 text-green-500" />
    },
    {
      name: 'Construction Costs',
      trend: 'High',
      impact: 'Positive for Existing',
      description: 'Increased costs for new construction make existing properties relatively more attractive.',
      icon: <Hammer className="w-5 h-5 text-orange-500" />
    },
    {
      name: 'Population Growth (Local)',
      trend: 'Steady (1.2% YoY)',
      impact: 'Positive',
      description: 'Consistent population increase in the city fuels long-term housing demand.',
      icon: <Users className="w-5 h-5 text-green-500" />
    },
    {
      name: 'Government Policies',
      trend: 'Neutral',
      impact: 'Neutral',
      description: 'Current property taxes and incentives are stable, having a neutral effect on prices.',
      icon: <Landmark className="w-5 h-5 text-gray-500" />
    },
    {
      name: 'Market Sentiment',
      trend: 'Cautiously Optimistic',
      impact: 'Slightly Positive',
      description: 'Overall market sentiment is leaning positive, though some buyers remain cautious.',
      icon: <Activity className="w-5 h-5 text-blue-500" />
    }
  ];

  const investmentScore = 'B+'; // This could be dynamically calculated
  const investmentReasoning = "The property shows good investment potential due to its location and positive local employment growth, despite current high interest rates. The low housing supply also supports potential appreciation.";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'prediction'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LineChart className="w-4 h-4 mr-2 flex-shrink-0" />
            AI Price Prediction
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'factors'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart className="w-4 h-4 mr-2 flex-shrink-0" />
            What Affects Price
          </button>
          <button
            onClick={() => setActiveTab('economic')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'economic'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
            Macroeconomic Factors
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'prediction' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">AI Price Prediction</h2>
              <div className="flex items-center bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-sm">
                <Info className="w-4 h-4 mr-1" />
                <span>AI Confidence: High</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Listed Price</p>
                <p className="text-2xl font-bold text-gray-900">${property.price.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">AI Predicted Value</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${property.predictedPrice?.toLocaleString() || property.price.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Difference</p>
                <div className="flex items-center">
                  {isPriceHigher ? (
                    <ArrowUp className="w-5 h-5 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-600 mr-1" />
                  )}
                  <p className={`text-2xl font-bold ${isPriceHigher ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(priceDifferencePercent).toFixed(1)}%
                    <span className="text-sm ml-1">
                      (${Math.abs(priceDifference).toLocaleString()})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What This Means</h3>
              <p className="text-gray-700">
                {isPriceHigher 
                  ? `Our AI model suggests this property is undervalued by approximately ${Math.abs(priceDifferencePercent).toFixed(1)}% 
                    compared to similar properties in the area. This could represent a good investment opportunity.`
                  : `Our AI model suggests this property is priced ${Math.abs(priceDifferencePercent).toFixed(1)}% higher 
                    than similar properties in the area. You may have room to negotiate on the price.`
                }
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                Our AI prediction is based on analysis of over 10,000 similar properties, 
                taking into account location, property features, market trends, and economic indicators.
                This prediction is for informational purposes only and should not be the sole factor in making a purchase decision.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Factors Influencing This Property's Price</h2>
            <div className="space-y-4">
              {mockFactors.map((factor, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="mr-3 flex-shrink-0 text-blue-900">
                    {factor.icon || <BarChart className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-900">{factor.name}</h3>
                      <div className={`flex items-center text-sm font-semibold ${factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {factor.impact >= 0 ? (
                          <ArrowUp className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                        <span>{Math.abs(factor.impact).toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'economic' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Macroeconomic Climate</h2>
            <p className="text-gray-700 mb-6 text-sm">
              Understanding the broader economic landscape can provide context for property valuations. These are general indicators and their direct impact can vary.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {mockEconomicFactors.map((factor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-start bg-white hover:shadow-md transition-shadow">
                  <div className="mr-3 flex-shrink-0">
                    {factor.icon || <TrendingUp className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{factor.name}</h3>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${ 
                      factor.impact === 'Positive' ? 'bg-green-100 text-green-800' :
                      factor.impact === 'Negative' ? 'bg-red-100 text-red-800' :
                      factor.impact === 'Mixed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {factor.impact} Impact ({factor.trend})
                    </div>
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-blue-800">
              <div className="flex items-start">
                  <DollarSign className="w-8 h-8 mr-3 flex-shrink-0" />
                  <div>
                      <h3 className="font-semibold text-lg mb-1">Investment Potential Score: <span className="text-blue-900">{investmentScore}</span></h3>
                      <p className="text-sm">{investmentReasoning}</p>
                  </div>
              </div>
              <p className="text-xs mt-4 opacity-75">
                Disclaimer: This score and analysis are based on AI models and current data, not financial advice. Consult a professional for investment decisions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPriceDashboard; 
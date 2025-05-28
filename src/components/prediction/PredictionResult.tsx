import React, { useState } from 'react';
import { DollarSign, Layers, Map, BarChart3, Share2 } from 'lucide-react';
import PredictionBreakdown from './PredictionBreakdown';
import AmenityImpact from './AmenityImpact';
import FactorImpact from './FactorImpact';

interface PredictionResultProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('breakdown');
  
  const tabs = [
    { id: 'breakdown', label: 'Price Breakdown', icon: <Layers className="h-5 w-5" /> },
    { id: 'factors', label: 'Factor Impact', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'amenities', label: 'Amenity Impact', icon: <Map className="h-5 w-5" /> },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-900 text-white px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1">Property Valuation Result</h2>
            <p className="text-blue-100 text-sm">{result.formData.address}</p>
          </div>
          <button className="bg-blue-800 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-md text-sm font-medium flex items-center">
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </button>
        </div>
      </div>
      
      {/* Price Card */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <p className="text-gray-500 mb-1">Predicted Market Value</p>
            <div className="flex items-center">
              <div className="bg-blue-900 text-white p-1.5 rounded-md mr-3">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-4xl font-bold text-blue-900">
                {formatCurrency(result.predictedPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Range: {formatCurrency(result.confidenceInterval[0])} - {formatCurrency(result.confidenceInterval[1])}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Price per sqft</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(result.predictedPrice / parseInt(result.formData.surface))}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Confidence</p>
              <p className="text-lg font-semibold text-gray-900">96%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'breakdown' && (
          <PredictionBreakdown 
            breakdown={result.priceBreakdown} 
            similarProperties={result.similarProperties} 
          />
        )}
        
        {activeTab === 'factors' && (
          <FactorImpact factors={result.factorImpact} />
        )}
        
        {activeTab === 'amenities' && (
          <AmenityImpact amenities={result.amenityImpact} />
        )}
      </div>
    </div>
  );
};

export default PredictionResult;
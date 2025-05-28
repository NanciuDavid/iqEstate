import React from 'react';
import { Building, Banknote, Info, LayoutDashboard } from 'lucide-react'; // Changed to lucide-react icons

interface DetailedFormData {
  header: string;
  price: string;
  surface: string;
  rooms: string;
  address: string;
  latitude: string;
  longitude: string;
  floor: string;
  rent: string;
  sellerType: string;
  freeFrom: string;
  propertyType: string;
  propertyForm: string;
  status: string;
  heatingType: string;
  accessibilityScore: string;
  description: string;
  amenities: { [key: string]: boolean };
}

interface PredictionSummaryDashboardProps {
  prediction: number;
  confidence: 'high' | 'medium' | 'low';
  details: DetailedFormData;
}

const PredictionSummaryDashboard: React.FC<PredictionSummaryDashboardProps> = ({ prediction, confidence, details }) => {
  const { address, surface, rooms, propertyType, propertyForm, amenities } = details;
  const amenitiesCount = Object.values(amenities).filter(Boolean).length;
  const confidenceText = confidence.charAt(0).toUpperCase() + confidence.slice(1);

  let confidenceColor = 'text-yellow-600';
  if (confidence === 'high') confidenceColor = 'text-green-600';
  if (confidence === 'low') confidenceColor = 'text-red-600';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <LayoutDashboard className="w-6 h-6 mr-2 text-blue-900" /> {/* Changed to LayoutDashboard for a generic dashboard icon */}
        Prediction Snapshot
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Property Snapshot */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-gray-700 mb-2">
            <Building className="w-5 h-5 mr-2" /> {/* Changed to Building */}
            <h4 className="font-medium">Property Overview</h4>
          </div>
          <p className="text-sm text-gray-600"><strong className="text-gray-800">Address:</strong> {address || 'N/A'}</p>
          <p className="text-sm text-gray-600"><strong className="text-gray-800">Type:</strong> {propertyType} for {propertyForm}</p>
          <p className="text-sm text-gray-600"><strong className="text-gray-800">Size:</strong> {surface} sqm, {rooms} rooms</p>
          {amenitiesCount > 0 && <p className="text-sm text-gray-600"><strong className="text-gray-800">Amenities Considered:</strong> {amenitiesCount}</p>}
        </div>

        {/* Card 2: Prediction Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-gray-700 mb-2">
            <Banknote className="w-5 h-5 mr-2" /> {/* Changed to Banknote */}
            <h4 className="font-medium">Valuation Summary</h4>
          </div>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Estimated Value:</strong> 
            <span className="text-lg font-semibold text-blue-900 ml-1">${prediction.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Confidence:</strong> 
            <span className={`font-semibold ${confidenceColor} ml-1`}>{confidenceText}</span>
          </p>
          <div className="mt-2 flex items-start text-xs text-gray-500">
            <Info className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" /> {/* Changed to Info */}
            <span>Based on your provided details and current market data.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummaryDashboard; 
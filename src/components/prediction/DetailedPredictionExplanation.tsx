import React from 'react';
import { LineChart, CheckCircle, MapPin, Home, Thermometer, ShieldCheck } from 'lucide-react';

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

interface DetailedPredictionExplanationProps {
  prediction: number;
  confidence: 'high' | 'medium' | 'low';
  details: DetailedFormData;
}

const DetailedPredictionExplanation: React.FC<DetailedPredictionExplanationProps> = ({ prediction, confidence, details }) => {
  const { 
    address, surface, rooms, propertyType, propertyForm, 
    heatingType, accessibilityScore, amenities, floor 
  } = details;

  const amenitiesCount = Object.values(amenities).filter(Boolean).length;
  const confidenceText = confidence.charAt(0).toUpperCase() + confidence.slice(1);

  return (
    <div className="bg-blue-50 p-6 rounded-xl mt-8">
      <div className="flex items-center mb-6">
        <LineChart className="h-8 w-8 text-blue-900 mr-3" />
        <h3 className="text-2xl font-semibold text-gray-900">How Your Prediction Was Calculated</h3>
      </div>
      
      <p className="text-gray-700 mb-4">
        Our AI model analyzed the specific details you provided for the property located at <strong className="text-blue-800">{address || 'the specified location'}</strong>. 
        The key inputs considered include:
      </p>

      <ul className="space-y-3 text-sm text-gray-600 mb-6 pl-2">
        <li className="flex items-start">
          <Home className="w-5 h-5 mr-3 text-blue-700 flex-shrink-0" />
          <span><strong>Property Type & Structure:</strong> A <strong className="text-blue-800">{propertyType}</strong> intended for <strong className="text-blue-800">{propertyForm}</strong>, with a surface area of <strong className="text-blue-800">{surface} sqm</strong>, <strong className="text-blue-800">{rooms} rooms</strong>, and situated on floor <strong className="text-blue-800">{floor}</strong>.</span>
        </li>
        <li className="flex items-start">
          <MapPin className="w-5 h-5 mr-3 text-blue-700 flex-shrink-0" />
          <span><strong>Location & Accessibility:</strong> The property's geographical coordinates (Lat: {details.latitude}, Long: {details.longitude}) and an accessibility score of <strong className="text-blue-800">{accessibilityScore}/10</strong> were factored in.</span>
        </li>
        <li className="flex items-start">
          <Thermometer className="w-5 h-5 mr-3 text-blue-700 flex-shrink-0" />
          <span><strong>Internal Features:</strong> Details such as <strong className="text-blue-800">{heatingType} heating</strong> were considered.</span>
        </li>
        {amenitiesCount > 0 && (
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
            <span><strong>Nearby Amenities:</strong> The presence of <strong className="text-blue-800">{amenitiesCount} selected nearby facilities</strong> (e.g., schools, parks, transport) positively influenced the valuation.</span>
          </li>
        )}
      </ul>

      <p className="text-gray-700 mb-4">
        By processing these characteristics against our extensive market database and current trends, 
        the AI estimated a value of <strong className="text-blue-900 text-lg">${prediction.toLocaleString()}</strong>. 
        This prediction comes with a <strong className="text-blue-800">{confidenceText} Confidence</strong> level, based on the completeness of the data you provided.
      </p>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-blue-700" /> Our Model's Approach
        </h4>
        <p className="text-xs text-gray-600">
          The AI considers hundreds of variables, including historical sales data, micro-market fluctuations, specific property attributes (like age, condition - though not all explicitly asked in this form), and broader economic indicators. The more detailed the input, the more refined the prediction becomes.
        </p>
      </div>

      <p className="text-sm text-gray-600 mt-6">
        Remember, this AI valuation is a powerful guide. For definitive pricing, especially for sale or purchase, consulting with a certified real estate appraiser is always recommended.
      </p>
    </div>
  );
};

export default DetailedPredictionExplanation; 
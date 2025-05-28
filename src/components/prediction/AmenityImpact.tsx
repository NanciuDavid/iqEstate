import React from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AmenityImpactProps {
  amenities: Array<{
    name: string;
    distance: number;
    impact: 'positive' | 'negative' | 'neutral';
    value: number;
  }>;
}

const AmenityImpact: React.FC<AmenityImpactProps> = ({ amenities }) => {
  // Sort amenities by impact value (descending)
  const sortedAmenities = [...amenities].sort((a, b) => b.value - a.value);
  
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getImpactText = (impact: string, value: number) => {
    if (impact === 'positive') {
      if (value > 2) return 'Major positive impact';
      if (value > 1) return 'Moderate positive impact';
      return 'Minor positive impact';
    }
    if (impact === 'negative') {
      if (value > 2) return 'Major negative impact';
      if (value > 1) return 'Moderate negative impact';
      return 'Minor negative impact';
    }
    return 'Negligible impact';
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-700';
      case 'negative':
        return 'text-red-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Amenities Impact</h3>
      <p className="text-gray-600 mb-6">
        Proximity to various amenities can significantly impact property values. Here's how nearby 
        facilities affect the price of your property.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAmenities.map((amenity, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{amenity.name}</h4>
                <div className="flex items-center">
                  {getImpactIcon(amenity.impact)}
                  <span className={`text-xs font-medium ml-1 ${getImpactColor(amenity.impact)}`}>
                    {amenity.value.toFixed(1)} pts
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center text-gray-700 mb-3">
                <MapPin className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{amenity.distance} miles away</span>
              </div>
              
              <p className="text-sm text-gray-600">
                {getImpactText(amenity.impact, amenity.value)}. {getAmenityDescription(amenity.name)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getAmenityDescription(amenityName: string): string {
  switch (amenityName) {
    case 'Schools':
      return 'Quality schools nearby typically increase property values and attract families.';
    case 'Parks':
      return 'Proximity to parks and green spaces enhances quality of life and property appeal.';
    case 'Public Transport':
      return 'Easy access to public transportation improves convenience and can boost property values.';
    case 'Shops':
      return 'Nearby shops and services add convenience and desirability to a property.';
    case 'Hospitals':
      return 'Access to healthcare facilities can be a valuable amenity, though immediate proximity may have mixed effects.';
    case 'Gyms':
      return 'Fitness facilities nearby are increasingly valued amenities for many buyers.';
    default:
      return 'This amenity affects the property value based on its proximity and quality.';
  }
}

export default AmenityImpact;
import React from 'react';

interface FactorImpactProps {
  factors: Array<{
    name: string;
    impact: number;
  }>;
}

const FactorImpact: React.FC<FactorImpactProps> = ({ factors }) => {
  // Sort factors by impact (descending)
  const sortedFactors = [...factors].sort((a, b) => b.impact - a.impact);
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Influencing Factors</h3>
      <p className="text-gray-600 mb-6">
        These factors have the biggest influence on your property valuation. The percentages 
        indicate the relative contribution of each factor to the predicted price.
      </p>
      
      <div className="space-y-6">
        {sortedFactors.map((factor, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium">{factor.name}</span>
              <span className="text-gray-700">{factor.impact}% influence</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-900 h-2.5 rounded-full" 
                style={{ width: `${factor.impact}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {getFactorDescription(factor.name)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

function getFactorDescription(factorName: string): string {
  switch (factorName) {
    case 'Location':
      return 'The neighborhood, accessibility, and overall desirability of the area strongly influence property values.';
    case 'Property Size':
      return 'Square footage is a primary factor in determining the base value of a property.';
    case 'Rooms':
      return 'The number and size of bedrooms and bathrooms can significantly impact a property\'s value.';
    case 'Property Age':
      return 'Newer properties typically command higher prices, while older properties may require more maintenance.';
    case 'Nearby Amenities':
      return 'Access to schools, parks, shopping, and other amenities can increase property values substantially.';
    default:
      return 'This factor contributes to the overall value assessment of the property.';
  }
}

export default FactorImpact;
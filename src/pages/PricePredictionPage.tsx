import React, { useEffect, useState } from 'react';
import { ChevronRight, LineChart, Info, ArrowRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import PredictionForm from '../components/prediction/PredictionForm';
import DetailedPredictionExplanation from '../components/prediction/DetailedPredictionExplanation';
import PredictionSummaryDashboard from '../components/prediction/PredictionSummaryDashboard';

// Define a type for the form data received from PredictionForm
interface DetailedFormData {
  header: string;
  price: string; // Keep as string for form input, parse to number when used
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
  propertyForm: string; // 'sale' or 'rent'
  status: string;
  heatingType: string;
  accessibilityScore: string;
  description: string;
  amenities: { [key: string]: boolean }; // e.g., { schoolNearby: true, ... }
}

const PricePredictionPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [submittedFormData, setSubmittedFormData] = useState<DetailedFormData | null>(null);

  const handleFormSubmit = (formData: DetailedFormData) => {
    setIsLoading(true);
    setPredictionResult(null); // Reset previous result
    setSubmittedFormData(formData); // Store the submitted form data

    // Simulate API call
    setTimeout(() => {
      let basePrediction = 200000 + Math.random() * 800000; // Base price

      // Adjust based on new comprehensive formData from PredictionForm
      if (formData.propertyType === 'house') basePrediction *= 1.2;
      if (formData.propertyType === 'penthouse') basePrediction *= 1.5;
      if (formData.propertyType === 'duplex') basePrediction *= 1.3;

      const surfaceArea = parseInt(formData.surface) || 1000;
      basePrediction *= (surfaceArea / 1200); // Normalize around 1200 sqft

      const rooms = parseInt(formData.rooms) || 2;
      if (rooms > 2) basePrediction *= (1 + (rooms - 2) * 0.05);

      if (formData.floor === 'penthouse') basePrediction *= 1.15;
      if (formData.floor === 'ground') basePrediction *= 1.02;
      // Ensure formData.floor is a string before parseInt for numeric floors
      const numericFloor = parseInt(formData.floor);
      if (!isNaN(numericFloor) && numericFloor > 5) basePrediction *= 1.05;

      let amenityScore = 0;
      for (const key in formData.amenities) {
        if (formData.amenities[key] === true) {
          amenityScore++;
        }
      }
      basePrediction += amenityScore * 7000; // Add value per amenity

      if (formData.sellerType === 'developer') basePrediction *= 1.05; // Slightly higher for new developments

      // Accessibility score (simple linear influence)
      const accessibility = parseInt(formData.accessibilityScore) || 5;
      basePrediction *= (1 + (accessibility - 5) * 0.01);
      
      // Mocking impact of being for rent vs sale
      if(formData.propertyForm === 'rent') {
        // Simulate monthly rent: e.g. 1/250th of sale price, with some variation
        basePrediction = basePrediction / 250 + (Math.random() - 0.5) * 200; 
      }

      const finalPrediction = Math.round(basePrediction / (formData.propertyForm === 'rent' ? 10 : 1000)) * (formData.propertyForm === 'rent' ? 10 : 1000);

      // Determine confidence based on number of fields filled in PredictionForm's formData
      let filledFields = 0;
      if (formData.header) filledFields++;
      if (formData.surface) filledFields++;
      if (formData.address) filledFields++;
      if (formData.latitude && formData.longitude) filledFields++;
      if (formData.propertyType) filledFields++;
      if (formData.rooms) filledFields++;
      if (formData.floor) filledFields++;
      if (formData.heatingType) filledFields++;
      if (formData.accessibilityScore) filledFields++;
      if (formData.description) filledFields++;
      if (amenityScore > 0) filledFields++; // Consider amenities collectively as one field for this purpose
      
      if (filledFields >= 8) {
        setConfidence('high');
      } else if (filledFields >= 5) {
        setConfidence('medium');
      } else {
        setConfidence('low');
      }

      setPredictionResult(finalPrediction);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-amber-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-700 font-medium">Price Prediction</span>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">AI Property Price Prediction</h1>
        <p className="text-xl text-slate-600">
          Provide detailed information about a property to receive an AI-powered valuation or rent estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <PredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

        <div>
          {predictionResult !== null && !isLoading && submittedFormData && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-amber-600" />
                  Prediction Result
                </h3>
                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-slate-600 mb-1">Estimated Property Value/Rent:</p>
                  <p className="text-3xl font-bold text-amber-700">${predictionResult.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      confidence === 'high' ? 'bg-green-500' :
                      confidence === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-slate-600">
                      {confidence === 'high' ? 'High Confidence' :
                       confidence === 'medium' ? 'Medium Confidence' :
                       'Low Confidence'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start mb-6">
                  <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    This prediction is based on the information provided and current market trends.
                    For a more accurate assessment, consider consulting with a professional appraiser.
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="font-medium text-slate-800 mb-2">What's Next?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-slate-600 hover:text-amber-600 transition-colors">
                      <Link to="/properties" className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-amber-600 mr-2" />
                        <span>Browse similar properties</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <PredictionSummaryDashboard 
                prediction={predictionResult} 
                confidence={confidence} 
                details={submittedFormData} 
              />
              <DetailedPredictionExplanation 
                prediction={predictionResult} 
                confidence={confidence} 
                details={submittedFormData} 
              />
            </>
          )}
          {isLoading && (
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-slate-700">Generating Prediction...</span>
            </div>
          )}
          {!isLoading && predictionResult === null && (
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <LineChart className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800">How It Works</h3>
              </div>
              <p className="text-slate-700 mb-4">
                Our AI-powered prediction model analyzes various property details and 
                market trends to provide an accurate estimate of a property's value or potential rent.
              </p>
              <ol className="space-y-3 text-sm text-slate-600 mb-4">
                <li className="flex items-start">
                  <span className="bg-amber-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Fill in the property details form with as much information as possible.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Our AI analyzes the data, comparing it with similar properties and market conditions.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Receive an instant property valuation or rent estimate with a confidence score.</span>
                </li>
              </ol>
              <p className="text-sm text-slate-600">
                The more details you provide, the more accurate our prediction will be.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictionPage; 
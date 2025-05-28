import React, { useState } from 'react';
import { MapPin, DollarSign, Thermometer, Building } from 'lucide-react';
import SimilarPropertiesModal from './SimilarPropertiesModal';

interface PredictionFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    header: '',
    price: '',
    surface: '',
    rooms: '2',
    address: '',
    latitude: '',
    longitude: '',
    floor: '1',
    rent: '',
    sellerType: 'private',
    freeFrom: '',
    propertyType: 'apartment',
    propertyForm: 'sale',
    status: 'available',
    heatingType: 'central',
    accessibilityScore: '5',
    description: '',
    amenities: {
      schoolNearby: false,
      parkNearby: false,
      publicTransportNearby: false,
      supermarketNearby: false,
      hospitalNearby: false,
      restaurantNearby: false,
      gymNearby: false,
      shoppingMallNearby: false
    }
  });

  const [showSimilarProperties, setShowSimilarProperties] = useState(false);
  const similarProperties = [
    {
      address: "123 Nearby St",
      surface: 85,
      price: 250000,
      distance: 0.5
    },
    {
      address: "456 Close Ave",
      surface: 92,
      price: 275000,
      distance: 0.8
    },
    {
      address: "789 Next Rd",
      surface: 78,
      price: 235000,
      distance: 1.2
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCheckSimilarProperties = () => {
    // In a real implementation, this would fetch data from the backend
    setShowSimilarProperties(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="header" className="block text-sm font-medium text-slate-700 mb-1">
                Property Title
              </label>
              <input
                type="text"
                id="header"
                name="header"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.header}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                  Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="pl-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                {!formData.price && (
                  <button
                    type="button"
                    onClick={handleCheckSimilarProperties}
                    className="mt-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Check similar properties nearby
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="surface" className="block text-sm font-medium text-slate-700 mb-1">
                  Surface Area (m²)
                </label>
                <input
                  type="number"
                  id="surface"
                  name="surface"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.surface}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Location</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="pl-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-1">
                Property Type
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  id="propertyType"
                  name="propertyType"
                  className="pl-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="duplex">Duplex</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="propertyForm" className="block text-sm font-medium text-slate-700 mb-1">
                Property Form
              </label>
              <select
                id="propertyForm"
                name="propertyForm"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.propertyForm}
                onChange={handleChange}
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label htmlFor="rooms" className="block text-sm font-medium text-slate-700 mb-1">
                Number of Rooms
              </label>
              <select
                id="rooms"
                name="rooms"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.rooms}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, '7+'].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-slate-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                id="floor"
                name="floor"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.floor}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="heatingType" className="block text-sm font-medium text-slate-700 mb-1">
                Heating Type
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  id="heatingType"
                  name="heatingType"
                  className="pl-10 w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  value={formData.heatingType}
                  onChange={handleChange}
                  required
                >
                  <option value="central">Central Heating</option>
                  <option value="gas">Gas Heating</option>
                  <option value="electric">Electric Heating</option>
                  <option value="floor">Floor Heating</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="accessibilityScore" className="block text-sm font-medium text-slate-700 mb-1">
                Accessibility Score (1-10)
              </label>
              <input
                type="number"
                id="accessibilityScore"
                name="accessibilityScore"
                min="1"
                max="10"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.accessibilityScore}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sellerType" className="block text-sm font-medium text-slate-700 mb-1">
                Seller Type
              </label>
              <select
                id="sellerType"
                name="sellerType"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.sellerType}
                onChange={handleChange}
                required
              >
                <option value="private">Private Seller</option>
                <option value="agency">Real Estate Agency</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            <div>
              <label htmlFor="freeFrom" className="block text-sm font-medium text-slate-700 mb-1">
                Free From (Date)
              </label>
              <input
                type="date"
                id="freeFrom"
                name="freeFrom"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.freeFrom}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(formData.amenities).map((key) => (
              <div key={key} className="flex items-center">
                <input
                  id={`amenities.${key}`}
                  name={`amenities.${key}`}
                  type="checkbox"
                  checked={formData.amenities[key as keyof typeof formData.amenities]}
                  onChange={handleChange}
                  className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <label htmlFor={`amenities.${key}`} className="ml-2 block text-sm text-slate-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 border-b border-slate-300 pb-2">Description</h3>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Property Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-300">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Predict Price'
            )}
          </button>
        </div>
      </form>

      <SimilarPropertiesModal
        isOpen={showSimilarProperties}
        onClose={() => setShowSimilarProperties(false)}
        location={{
          address: formData.address,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0
        }}
        surface={parseFloat(formData.surface) || 0}
        similarProperties={similarProperties}
      />
    </>
  );
};

export default PredictionForm;
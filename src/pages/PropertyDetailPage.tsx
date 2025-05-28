import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  BedDouble, 
  Bath, 
  Ruler, 
  Calendar, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  ArrowRight,
  Building,
  Tag
} from 'lucide-react';
import { mockProperties } from '../data/mockdata';
import { Property } from '../types/property';
import PropertyPriceDashboard from '../components/property/PropertyPriceDashboard';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // In a real app, you would fetch the property from an API
    // For now, we'll use the mock data
    const foundProperty = mockProperties.find(p => p.id === id);
    setProperty(foundProperty || null);
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to the user's profile
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-md">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/properties" className="hover:text-blue-900 transition-colors">
          Properties
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">{property.title}</span>
      </div>

      {/* Property Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <button 
            onClick={toggleFavorite}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
            } hover:bg-opacity-80 transition-colors`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Property Images */}
      <div className="mb-12">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-4">
          <img 
            src={property.images[activeImage]} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          {property.newListing && (
            <span className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
              New Listing
            </span>
          )}
          <div className="absolute bottom-4 left-4 bg-white/90 text-blue-900 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-xs font-medium">
                AI Predicted Value:
              </span>
              <span className="ml-1.5">
                ${property.predictedPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {property.images.map((image, index) => (
            <button 
              key={index} 
              onClick={() => setActiveImage(index)}
              className={`h-20 rounded-lg overflow-hidden ${
                activeImage === index ? 'ring-2 ring-blue-900' : ''
              }`}
            >
              <img 
                src={image} 
                alt={`${property.title} - image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Property Details and Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Property Details */}
        <div className="lg:col-span-2">
          {/* Price and Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <span className="text-3xl font-bold text-gray-900">${property.price.toLocaleString()}</span>
                {property.pricePerSqft && (
                  <span className="text-gray-600 ml-2">${property.pricePerSqft}/sq ft</span>
                )}
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                <span className="text-gray-600 mr-2">Listed:</span>
                <span className="text-gray-900">{property.listedDate || 'Recently'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <BedDouble className="h-6 w-6 text-blue-900 mb-1" />
                <span className="text-lg font-semibold">{property.bedrooms}</span>
                <span className="text-xs text-gray-600">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Bath className="h-6 w-6 text-blue-900 mb-1" />
                <span className="text-lg font-semibold">{property.bathrooms}</span>
                <span className="text-xs text-gray-600">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Ruler className="h-6 w-6 text-blue-900 mb-1" />
                <span className="text-lg font-semibold">{property.surface}</span>
                <span className="text-xs text-gray-600">Sq Ft</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-900 mb-1" />
                <span className="text-lg font-semibold">{property.yearBuilt}</span>
                <span className="text-xs text-gray-600">Year Built</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {property.tags.map((tag, index) => (
                <span key={index} className="text-xs font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-800">{property.type}</span>
              </div>
              {property.status && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-gray-800">{property.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-4">
              {property.description || 
                `This beautiful ${property.type.toLowerCase()} features ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, 
                with a total of ${property.surface} square feet of living space. Built in ${property.yearBuilt}, 
                this property offers modern amenities and is located in a prime area.`
              }
            </p>
            <p className="text-gray-700">
              Located at {property.address}, this property offers easy access to local amenities, 
              transportation, and entertainment options.
            </p>
          </div>

          {/* AI Price Prediction Dashboard */}
          <PropertyPriceDashboard property={property} />

          {/* Features & Amenities - Placeholder for future implementation */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
            <p className="text-gray-600 italic">
              Detailed features and amenities will be available soon.
            </p>
          </div>

          {/* Location - Placeholder for future map integration */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Map will be integrated here</span>
            </div>
            <p className="text-gray-700">
              {property.address}
            </p>
          </div>
        </div>

        {/* Sidebar - Contact and Related Properties */}
        <div>
          {/* Contact Agent/Owner */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact {property.ownerName}</h3>
            
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mr-4">
                {property.ownerName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{property.ownerName}</p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <a href={`tel:${property.ownerPhone}`} className="flex items-center text-gray-700 hover:text-blue-900">
                <Phone className="h-5 w-5 mr-2" />
                <span>{property.ownerPhone}</span>
              </a>
              <a href={`mailto:${property.ownerEmail}`} className="flex items-center text-gray-700 hover:text-blue-900">
                <Mail className="h-5 w-5 mr-2" />
                <span>{property.ownerEmail}</span>
              </a>
            </div>
            
            {!showContactForm ? (
              <button 
                onClick={() => setShowContactForm(true)}
                className="w-full py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                Send Message
              </button>
            ) : (
              <form className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="I'm interested in this property..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                >
                  Send
                </button>
              </form>
            )}
          </div>
          
          {/* Similar Properties - Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Properties</h3>
            <p className="text-gray-600 italic mb-4">
              Similar properties will be displayed here.
            </p>
            <Link to="/properties" className="flex items-center text-blue-900 font-medium hover:text-blue-800">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 
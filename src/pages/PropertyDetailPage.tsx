import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Ruler, 
  Calendar, 
  Heart, 
  Share2, 
  ChevronRight,
  Mail,
  Phone,
  Building,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Property, PropertyType } from '../types/property';
import { propertyService } from '../services';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuthQuery';
import PropertyPriceDashboard from '../components/property/PropertyPriceDashboard';
import { PropertyCard } from '../components/properties/PropertyCard';
import PropertyLocationMap from '../components/map/PropertyLocationMap';

// Backend response interface that matches the actual API response
interface BackendPropertyResponse {
  id: string;
  title?: string;
  price?: number;
  predictedPrice?: number;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  yearBuilt?: number;
  images?: string[];
  newListing?: boolean;
  listedDate?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  description?: string;
  features?: string[];
  [key: string]: unknown;
}

// Extended interface for property detail page that includes both Property fields and additional template-specific fields
interface PropertyDetail extends Property {
  // Additional fields that the template expects but aren't in the standard Property interface
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // === COMPONENT STATE ===
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertyDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in this property and would like more information.`
  });

  // === HOOKS ===
  const { isAuthenticated } = useAuth();
  const { 
    addToFavorites, 
    removeFromFavorites, 
    favorites
  } = useFavorites();

  // === DATA FETCHING ===
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchPropertyDetails = async () => {
      if (!id) {
        setError('Property ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('🔄 Fetching property details for ID:', id);

        // Fetch the specific property by ID
        const response = await propertyService.getPropertyById(id);
        console.log('📡 Raw API Response:', response);
        
        if (response.success && response.data) {
          const foundPropertyData = response.data as unknown as BackendPropertyResponse;
          
          // Transform backend data to PropertyDetail object
          const transformedProperty: PropertyDetail = {
            id: foundPropertyData.id,
            title: foundPropertyData.title || 'Property Title Not Available',
            price: Number(foundPropertyData.price) || 0,
            predictedPrice: foundPropertyData.predictedPrice ? Number(foundPropertyData.predictedPrice) : undefined,
            pricePerSqft: foundPropertyData.surface && foundPropertyData.price ? Math.round(foundPropertyData.price / foundPropertyData.surface) : undefined,
            surface: Number(foundPropertyData.surface) || 0,
            bedrooms: foundPropertyData.bedrooms || 1,
            bathrooms: foundPropertyData.bathrooms || 1,
            address: foundPropertyData.address || 'Address Not Available',
            city: foundPropertyData.city || 'Unknown City',
            county: foundPropertyData.county || 'Unknown County',
            latitude: foundPropertyData.latitude,
            longitude: foundPropertyData.longitude,
            type: (foundPropertyData.type as PropertyType) || 'APARTMENT',
            status: 'AVAILABLE',
            listingType: 'SALE',
            yearBuilt: foundPropertyData.yearBuilt,
            description: foundPropertyData.description || `This beautiful ${foundPropertyData.type?.toLowerCase() || 'property'} features ${foundPropertyData.bedrooms || 1} bedrooms and ${foundPropertyData.bathrooms || 1} bathrooms, with a total of ${foundPropertyData.surface || 0}m² of living space. ${foundPropertyData.yearBuilt ? `Built in ${foundPropertyData.yearBuilt}, ` : ''}this property offers modern amenities and is located in a prime area.`,
            images: foundPropertyData.images && foundPropertyData.images.length > 0 ? foundPropertyData.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'],
            tags: foundPropertyData.features || [],
            newListing: foundPropertyData.newListing || false,
            listedDate: foundPropertyData.listedDate,
            ownerName: foundPropertyData.ownerName,
            ownerEmail: foundPropertyData.ownerEmail,
            ownerPhone: foundPropertyData.ownerPhone
          };
          
          console.log('✅ Successfully loaded property:', transformedProperty);
          setProperty(transformedProperty);
          
          // Load similar properties of the same type
          try {
            const similarResponse = await propertyService.getPropertiesOptimized(1, 10);
            if (similarResponse.success && similarResponse.data && Array.isArray(similarResponse.data)) {
              const allProperties = similarResponse.data as unknown as BackendPropertyResponse[];
              const similar = allProperties
                .filter(prop => 
                  prop.id !== id && 
                  prop.type === foundPropertyData.type
                )
                .slice(0, 3)
                .map((prop): PropertyDetail => ({
                  id: prop.id,
                  title: prop.title || 'Property Title Not Available',
                  price: Number(prop.price) || 0,
                  predictedPrice: prop.predictedPrice ? Number(prop.predictedPrice) : undefined,
                  pricePerSqft: prop.surface && prop.price ? Math.round(prop.price / prop.surface) : undefined,
                  surface: Number(prop.surface) || 0,
                  bedrooms: prop.bedrooms || 1,
                  bathrooms: prop.bathrooms || 1,
                  address: prop.address || 'Address Not Available',
                  city: prop.city || 'Unknown City',
                  county: prop.county || 'Unknown County',
                  latitude: prop.latitude,
                  longitude: prop.longitude,
                  type: (prop.type as PropertyType) || 'APARTMENT',
                  status: 'AVAILABLE',
                  listingType: 'SALE',
                  yearBuilt: prop.yearBuilt,
                  description: `Property with ${prop.surface || 0}m², ${prop.bedrooms || 1} bedrooms in ${prop.city || 'Unknown location'}.`,
                  images: prop.images && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'],
                  tags: prop.features || [],
                  newListing: prop.newListing || false,
                  listedDate: prop.listedDate,
                  ownerName: prop.ownerName,
                  ownerEmail: prop.ownerEmail,
                  ownerPhone: prop.ownerPhone
                }));
              
              setSimilarProperties(similar);
              console.log(`📋 Found ${similar.length} similar properties`);
            }
          } catch (similarError) {
            console.warn('Could not load similar properties:', similarError);
            setSimilarProperties([]);
          }
        } else {
          console.error('❌ API response not successful:', response);
          setError(response.error || 'Property not found');
        }
        
      } catch (error) {
        console.error('❌ Error fetching property details:', error);
        setError(error instanceof Error ? error.message : 'Failed to load property details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // === EVENT HANDLERS ===

  // Check if property is in favorites from API
  useEffect(() => {
    if (property && isAuthenticated) {
      const isPropertyFavorited = favorites.some(fav => fav.id === property.id);
      setIsFavorite(isPropertyFavorited);
    }
  }, [property, favorites, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!property) return;
    
    if (!isAuthenticated) {
      console.warn('User not authenticated - cannot save favorites');
      // Optionally show a toast or redirect to login
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(property.id);
        console.log('💔 Removed from favorites:', property.id);
      } else {
        await addToFavorites(property.id);
        console.log('❤️ Added to favorites:', property.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('❌ Error updating favorite status:', error);
      // Optionally show error toast to user
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title || 'Property on EstateIQ',
      text: `Check out this ${property?.type?.toLowerCase() || 'property'}: ${property?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('✅ Property shared successfully');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Property link copied to clipboard!');
        console.log('📋 Property link copied to clipboard');
      }
    } catch (error) {
      console.error('❌ Error sharing property:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Property link copied to clipboard!');
      } catch (clipboardError) {
        console.error('❌ Error copying to clipboard:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactFormData.name.trim() || !contactFormData.email.trim() || !contactFormData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactFormData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    console.log('📧 Contact form submitted:', {
      property: property?.id,
      propertyTitle: property?.title,
      contactData: contactFormData
    });

    // TODO: Implement actual API call to send message
    alert('Message sent! The property owner will contact you soon.');
    setShowContactForm(false);
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in this property and would like more information.`
    });
  };

  // === RENDER ===

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          <ChevronRight className="w-4 h-4 mx-2" />
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
          <ChevronRight className="w-4 h-4 mx-2" />
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-8 w-80 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-5 w-60 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Image skeleton */}
        <div className="h-[500px] bg-gray-200 animate-pulse rounded-xl mb-8"></div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {error === 'Property not found' ? 'Property Not Found' : 'Error Loading Property'}
        </h2>
        <p className="text-gray-600 mb-8">
          {error === 'Property not found' 
            ? "The property you're looking for doesn't exist or has been removed."
            : `Failed to load property details: ${error}`
          }
        </p>
        <Link to="/properties" className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
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
            disabled={!isAuthenticated}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              !isAuthenticated 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                : isFavorite 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={!isAuthenticated ? 'Please log in to save favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
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
          {property.predictedPrice && (
            <div className="absolute bottom-4 left-4 bg-white/90 text-blue-900 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-xs font-medium">
                  AI Predicted Value:
                </span>
                <span className="ml-1.5">
                  €{property.predictedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
        {property.images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {property.images.slice(0, 5).map((image, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(index)}
                className={`h-20 rounded-lg overflow-hidden transition-all ${
                  activeImage === index ? 'ring-2 ring-blue-900' : 'opacity-70 hover:opacity-100'
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
        )}
      </div>

      {/* Property Details and Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Property Details */}
        <div className="lg:col-span-2">
          {/* Price and Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <span className="text-3xl font-bold text-gray-900">€{property.price.toLocaleString()}</span>
                {property.pricePerSqft && (
                  <span className="text-gray-600 ml-2">€{property.pricePerSqft}/m²</span>
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
                <span className="text-xs text-gray-600">m²</span>
              </div>
              {property.yearBuilt && (
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-900 mb-1" />
                  <span className="text-lg font-semibold">{property.yearBuilt}</span>
                  <span className="text-xs text-gray-600">Year Built</span>
                </div>
              )}
            </div>

            {property.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {property.tags.map((tag, index) => (
                  <span key={index} className="text-xs font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-800 capitalize">{property.type.toLowerCase().replace('_', ' ')}</span>
              </div>
              {property.status && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-gray-800 capitalize">{property.status.toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-4">
              {property.description}
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

          {/* Location with Interactive Map */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
            <div className="h-96 mb-4">
              {property.latitude && property.longitude ? (
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  currency={property.currency}
                  className="h-full"
                />
              ) : (
                <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <span>Location coordinates not available</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Property Address</p>
                  <p className="text-gray-700">
                    {property.address}
                    {property.city && `, ${property.city}`}
                    {property.county && `, ${property.county}`}
                  </p>
                  {property.latitude && property.longitude && (
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Contact and Related Properties */}
        <div>
          {/* Contact Agent/Owner */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact {property.ownerName || 'Property Owner'}</h3>
            
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mr-4">
                {(property.ownerName || 'P').charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{property.ownerName || 'Property Owner'}</p>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <a href={`tel:${property.ownerPhone}`} className="flex items-center text-gray-700 hover:text-blue-900 transition-colors">
                <Phone className="h-5 w-5 mr-2" />
                <span>{property.ownerPhone}</span>
              </a>
              <a href={`mailto:${property.ownerEmail}`} className="flex items-center text-gray-700 hover:text-blue-900 transition-colors">
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
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactFormChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactFormChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactFormData.phone}
                    onChange={handleContactFormChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+40 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={4}
                    value={contactFormData.message}
                    onChange={handleContactFormChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="flex space-x-2">
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Send
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Similar Properties */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Properties</h3>
            {similarProperties.length > 0 ? (
              <div className="space-y-4 mb-4">
                {similarProperties.map((similarProperty) => (
                  <div key={similarProperty.id} className="border border-gray-100 rounded-lg overflow-hidden">
                    <PropertyCard 
                      property={similarProperty}
                      className="border-none shadow-none"
                      onFavoriteChange={(propertyId, isFavorite) => {
                        console.log(`Similar property ${propertyId} favorite status: ${isFavorite}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic mb-4">
                No similar properties found.
              </p>
            )}
            <Link to="/properties" className="flex items-center text-blue-900 font-medium hover:text-blue-800 transition-colors">
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
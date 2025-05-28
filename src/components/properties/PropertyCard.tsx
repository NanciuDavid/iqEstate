import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bath, BedDouble, Ruler, Heart } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-500/50">
        <div className="relative">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <button 
              onClick={toggleFavorite} 
              className={`p-2.5 rounded-full transition-colors duration-200 shadow-md ${
                isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500 hover:bg-white'
              }`}
            >
              <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          {property.newListing && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
              New
            </span>
          )}
          {property.predictedPrice && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-end">
                <span className="text-xs font-medium text-slate-200">AI Predicted:</span>
                <span className="ml-1.5 text-lg font-bold text-white">${property.predictedPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2.5">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors leading-tight">
              {property.title}
            </h3>
            <span className="text-xl font-bold text-amber-600 whitespace-nowrap">
              ${property.price.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center text-slate-500 mb-4">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="text-sm truncate" title={property.address}>{property.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700 mb-3">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1.5 text-amber-600" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1.5 text-amber-600" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Ruler className="h-4 w-4 mr-1.5 text-amber-600" />
              <span>{property.surface} sqft</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200">
            {property.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium"
              >
                {tag}
              </span>
            ))}
            {property.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                +{property.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
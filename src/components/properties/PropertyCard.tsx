/**
 * PropertyCard Component for EstateIQ
 * 
 * A professional, reusable card component that displays property information in a clean, modern design.
 * This component is purely presentational and handles only the display logic.
 * 
 * Features:
 * - Clean, responsive property card layout
 * - Interactive favorite functionality
 * - AI price prediction display
 * - Property specifications (beds, baths, surface)
 * - Feature tags with safe null checking
 * - Hover animations and transitions
 * - Optimized for accessibility
 * 
 * @param property - Property object containing all display data
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bath, BedDouble, Ruler, Heart } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyCardProps {
  property: Property;
  className?: string;
  onFavoriteChange?: (propertyId: string, isFavorite: boolean) => void;
  initialIsFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  className = '',
  onFavoriteChange,
  initialIsFavorite = false
}) => {
  // Local state for favorite toggle - initialize with prop value
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Debug: Log image data to understand what's being passed
  console.log(`PropertyCard for ${property.id} - Images:`, property.images);
  
  /**
   * Get the first available image URL or a default placeholder
   */
  const getImageUrl = (): string => {
    // Check if images array exists and has at least one valid URL
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const firstImage = property.images.find(img => img && img.length > 0);
      if (firstImage) {
        return firstImage;
      }
    }
    
    // Fallback to default image if no valid images found
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
  };

  /**
   * Handle favorite button click with proper event handling
   * Prevents navigation when clicking the favorite button
   */
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Notify parent component if callback is provided
    onFavoriteChange?.(property.id, newFavoriteState);
  };

  /**
   * Format currency display based on property currency
   */
  const formatPrice = (price: number): string => {
    const currency = property.currency || 'EUR';
    const symbol = currency === 'EUR' ? '€' : currency === 'RON' ? 'RON' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  return (
    <div className={`group ${className}`}>
      <Link 
        to={`/property/${property.id}`} 
        className="block h-full"
        aria-label={`View details for ${property.title}`}
      >
        <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-500/50 transform hover:scale-[1.02] h-full flex flex-col">
          
          {/* Property Image Section */}
          <div className="relative overflow-hidden h-48">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            <img
              src={getImageUrl()}
              alt={property.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onLoad={() => {
                setImageLoading(false);
                setImageError(false);
              }}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {imageError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
            
            {/* Image Overlay Elements */}
            <div className="absolute inset-0">
              
              {/* Favorite Button */}
              <button 
                onClick={handleFavoriteToggle}
                className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 shadow-md backdrop-blur-sm ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                    : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white hover:scale-110'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className="h-5 w-5 transition-transform" 
                  fill={isFavorite ? "currentColor" : "none"} 
                />
              </button>
              
              {/* New Listing Badge */}
              {property.newListing && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-md">
                    New
                  </span>
                </div>
              )}
              
              {/* AI Price Prediction Overlay */}
              {property.predictedPrice && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs font-medium text-slate-200">AI Predicted:</span>
                    <span className="text-lg font-bold text-white">
                      {formatPrice(property.predictedPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Property Information Section */}
          <div className="p-5 flex-1 flex flex-col">
            
            {/* Title and Price Header */}
            <header className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors leading-tight flex-1 mr-3">
                {property.title}
              </h3>
              <div className="text-right">
                <span className="text-xl font-bold text-amber-600 whitespace-nowrap">
                  {formatPrice(property.price)}
                </span>
                {property.pricePerSqft && (
                  <div className="text-xs text-slate-500 mt-1">
                    {formatPrice(property.pricePerSqft)}/m²
                  </div>
                )}
              </div>
            </header>
            
            {/* Location Information */}
            <div className="flex items-center text-slate-500 mb-4">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm truncate" title={property.address}>
                {property.address}
              </span>
            </div>
            
            {/* Property Specifications */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700 mb-4">
              <div className="flex items-center" title={`${property.bedrooms} bedrooms`}>
                <BedDouble className="h-4 w-4 mr-1.5 text-amber-600" />
                <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center" title={`${property.bathrooms} bathrooms`}>
                <Bath className="h-4 w-4 mr-1.5 text-amber-600" />
                <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center" title={`${property.surface} square meters`}>
                <Ruler className="h-4 w-4 mr-1.5 text-amber-600" />
                <span>{property.surface}m²</span>
              </div>
            </div>
            
            {/* Property Tags/Features - with safe null checking */}
            {property.tags && property.tags.length > 0 && (
              <div className="mt-auto pt-3 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {property.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={`${property.id}-tag-${index}`}
                      className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {property.tags.length > 3 && (
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      +{property.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
};
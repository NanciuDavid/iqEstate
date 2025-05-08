import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { MapPin, Bath, BedDouble, Ruler, Heart } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // prevent the default behavior of the link
        setIsFavorite(!isFavorite);
    }

    return (
        <Link to={`property/${property.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full ${isFavorite
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-gray-600 hover:text-red-500"
                                } transition-colors shadow-sm`}
                        >
                            <Heart
                                className="h-5 w-5"
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                        </button>
                    </div>
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
                                    ${property.predictedPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5">
                <div className='flex justify-between items-start mb-2'>
                    <h3 className = "text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{property.title}</h3>
                    <span className='text-lg font-bold tex-blue-900'>${property.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className=""></MapPin>
                    <span>{property.address}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
                    <div className="flex items-center">
                        <BedDouble className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Ruler className="w-4 h-4" />
                        <span>{property.surface} m²</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-2 mt-4'>
                    {property.tags.slice(0, 3).map((tag, index)=> (
                        <span key={index} className='text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md'>{tag}</span>
                    ))}
                    {property.tags.length > 3 && (
                        <span className='text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md'>+{property.tags.length - 3}</span>
                    ) }
                </div>
            </div>
        </Link>
    );
    ;
}

export default PropertyCard;
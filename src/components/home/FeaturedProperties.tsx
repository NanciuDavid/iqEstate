import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Bath, BedDouble, Ruler, Heart } from 'lucide-react';
import PropertyCard from '../properties/PropertyCard';
import { mockProperties } from '../../data/mockdata';
import { Property } from '../../types/property';
const FeaturedProperties: React.FC = () => {
  // Only display 3 featured properties
  const featuredProperties = mockProperties.filter(property => property.featured).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default FeaturedProperties;
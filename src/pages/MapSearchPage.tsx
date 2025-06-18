import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DirectMapComponent from '../components/map/DirectMapComponent';
import PropertyList from '../components/map/PropertyList';
import { Property } from '../types/property';
import { propertyService, type PolygonSearchRequest } from '../services/propertyService';
import { PropertyTransformService } from '../services/propertyTransformService';

const MapSearchPage = () => {
  console.log('MapSearchPage rendering');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to handle polygon drawing completion
  const handlePolygonDrawn = async (polygon: number[][]) => {
    console.log(`Polygon with ${polygon.length} points drawn:`, polygon);
    setLoading(true);
    setError(null);
    setShowList(true);
    
    // Animate map container to shift left
    if (mapContainerRef.current) {
      mapContainerRef.current.classList.add('map-shift-left');
    }
    
    try {
      // Prepare the polygon search request
      const searchRequest: PolygonSearchRequest = {
        polygon: polygon,
        filters: {
          listingType: 'SALE', // You can add more filters here if needed
          // propertyType: 'APARTMENT', // Uncomment to filter only apartments
        }
      };
      
      console.log('Sending polygon search request:', searchRequest);
      
      // Call the backend API to search properties within the polygon
      const response = await propertyService.searchPropertiesByPolygon(searchRequest);
      
      if (response.success && response.data) {
        console.log(`Found ${response.data.length} properties within the drawn area`);
        
        // Transform backend properties to frontend Property format
        const transformedProperties = PropertyTransformService.transformDatabaseProperties(response.data);
        setProperties(transformedProperties);
        
        console.log(`Transformed ${transformedProperties.length} properties for display`);
      } else {
        console.error('Failed to fetch properties:', response.error);
        setError(response.error || 'Failed to fetch properties within the selected area');
        setProperties([]);
      }
    } catch (err) {
      console.error('Error searching properties by polygon:', err);
      setError('An error occurred while searching for properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear search results and reset the map view
  const clearResults = () => {
    setProperties([]);
    setError(null);
    setShowList(false);
    
    // Animate map container back to full width
    if (mapContainerRef.current) {
      mapContainerRef.current.classList.remove('map-shift-left');
    }
  };
  
  // Simple function to show properties list for testing
  // const showPropertiesList = () => {
  //   setLoading(true);
  //   setShowList(true);
    
  //   setTimeout(() => {
  //     const filteredProperties = mockProperties.slice(0, 4);
  //     setProperties(filteredProperties);
  //     setLoading(false);
  //   }, 1500);
  // };
  
  useEffect(() => {
    console.log('MapSearchPage mounted');
    window.scrollTo(0, 0);
    
    // Add error boundary
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };
    window.addEventListener('error', errorHandler);
    
    return () => {
      console.log('MapSearchPage unmounted');
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  try {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 font-medium">Map Search</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Draw to Search Properties</h1>
          <p className="text-gray-600 mt-2">
            Draw a polygon on the map to find properties in your desired area. Use the drawing 
            tools in the top-right corner of the map.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h3 className="text-sm font-semibold text-blue-900">How to use:</h3>
              <ol className="text-sm text-blue-800 mt-1 list-decimal pl-5">
                <li>Click the polygon or rectangle tool in the top-right corner</li>
                <li>Click on the map to draw your area of interest</li>
                <li>Complete the shape by connecting back to the first point</li>
                <li>Properties within that area will appear</li>
              </ol>
            </div>
          </div>
          
          {/* Results Summary and Clear Button */}
          {showList && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="text-sm text-gray-700">
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900 mr-2"></div>
                    Searching properties...
                  </span>
                ) : error ? (
                  <span className="text-red-600">Search failed</span>
                ) : (
                  <span>
                    Found <strong>{properties.length}</strong> propert{properties.length === 1 ? 'y' : 'ies'} in selected area
                  </span>
                )}
              </div>
              <button
                onClick={clearResults}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
              >
                Clear Results
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row transition-all duration-500 ease-in-out relative">
          <div 
            ref={mapContainerRef} 
            className={`w-full ${showList ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-500 ease-in-out`}
          >
            <DirectMapComponent onPolygonDrawn={handlePolygonDrawn} />
          </div>

          {showList && (
            <div className="w-full lg:w-1/3 lg:pl-6 mt-6 lg:mt-0 transition-opacity duration-500 ease-in-out">
              <PropertyList properties={properties} loading={loading} error={error} />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in MapSearchPage render:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-red-600">Error loading map</h1>
        <p className="mt-2">There was an error loading the map component.</p>
        <p className="text-gray-500">Please check the console for details.</p>
      </div>
    );
  }
};

export default MapSearchPage; 
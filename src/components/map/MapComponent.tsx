import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { mockProperties } from '../../data/mockdata';

// Fix for the missing Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Ensure Leaflet Draw is available
if (typeof window !== 'undefined') console.log('Leaflet Draw available:', !!L.Control.Draw);

// Set up default icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal drawing tools component
const DrawingTools = ({ onPolygonDrawn }: { onPolygonDrawn: (polygon: number[][]) => void }) => {
  console.log('DrawingTools rendering');
  const map = useMap();
  const featureGroupRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    console.log('DrawingTools mounting');
    try {
      // Add feature group to the map
      const featureGroup = featureGroupRef.current;
      featureGroup.addTo(map);
      
      // Explicitly check if Leaflet Draw plugin is available
      if (typeof L.Control.Draw === 'undefined') {
        console.error('Leaflet Draw plugin not available! Make sure it is properly imported.');
        console.log('Leaflet object:', L);
        alert('Drawing tools not available. See console for details.');
        return;
      } else {
        console.log('Leaflet Draw is available, attempting to initialize controls...');
      }
      
      try {
        // Initialize draw control
        const drawControl = new L.Control.Draw({
          position: 'topright',
          draw: {
            rectangle: {}, // Enable rectangle for easier testing
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              drawError: {
                color: '#e1e100',
                message: '<strong>Polygon draw does not allow intersections!</strong>'
              },
              shapeOptions: {
                color: '#3949AB',
                fillOpacity: 0.2
              }
            }
          },
          edit: {
            featureGroup: featureGroup,
            edit: false,
            remove: true
          }
        });
        
        console.log('Draw control created successfully:', drawControl);
        
        // Add control to map
        map.addControl(drawControl);
        console.log('Draw control added to map');
        
        // Set up event handler for when drawing is completed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleDrawCreated = (e: any) => {
          console.log('Draw created event:', e.layerType);
          const layer = e.layer;
          featureGroup.addLayer(layer);
          
          if (e.layerType === 'polygon' || e.layerType === 'rectangle') {
            try {
              // Extract polygon coordinates - cast to Polygon type
              const polygonLayer = layer as L.Polygon;
              const latLngs = polygonLayer.getLatLngs();
              const firstRing = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
              const polygonCoordinates = (firstRing as L.LatLng[]).map(latLng => {
                return [latLng.lat, latLng.lng];
              });
              
              // Pass the polygon coordinates to the parent component
              onPolygonDrawn(polygonCoordinates);
            } catch (err) {
              console.error('Error processing polygon coordinates:', err);
            }
          }
        };
        
        // Add a simple button to test drawing initialization
        const customButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
        customButton.style.backgroundColor = 'white';
        customButton.style.width = '30px';
        customButton.style.height = '30px';
        customButton.innerHTML = '✏️';
        customButton.title = 'Test draw mode';
        customButton.onclick = function() {
          alert('Drawing tools should be in the top right corner');
          console.log('Draw control status:', drawControl);
        };
        
        const customControl = L.Control.extend({
          options: {
            position: 'topleft'
          },
          onAdd: function() {
            return customButton;
          }
        });
        
        map.addControl(new customControl());
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on('draw:created', handleDrawCreated as any);
        console.log('Draw:created event handler registered');
        
        // Clean up on unmount
        return () => {
          console.log('DrawingTools unmounting');
          try {
            map.removeControl(drawControl);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.off('draw:created', handleDrawCreated as any);
            featureGroup.remove();
          } catch (err) {
            console.error('Error cleaning up DrawingTools:', err);
          }
        };
      } catch (initError) {
        console.error('Error initializing drawing control:', initError);
        return () => {};
      }
    } catch (err) {
      console.error('Error setting up drawing tools:', err);
      return () => {/* No cleanup needed */};
    }
  }, [map, onPolygonDrawn]);
  
  return null;
};

// Separate component for property markers
const PropertyMarkers = () => {
  return (
    <>
      {mockProperties.slice(0, 10).map((property) => (
        property.latitude && property.longitude ? (
          <Marker 
            key={property.id} 
            position={[property.latitude, property.longitude]}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm">${property.price.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{property.address}</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </>
  );
};

interface MapComponentProps {
  onPolygonDrawn: (polygon: number[][]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPolygonDrawn }) => {
  console.log('MapComponent rendering');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // Default to NYC
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  
  useEffect(() => {
    console.log('MapComponent mounting');
    // Try to get user's location for better UX
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // If user denies location, keep default
          console.log("Location access denied");
        }
      );
    }

    // Wait a moment before enabling drawing tools
    const timer = setTimeout(() => {
      setDrawingEnabled(true);
      console.log('Drawing enabled');
    }, 2000);
    
    return () => {
      console.log('MapComponent unmounting');
      clearTimeout(timer);
    };
  }, []);

  try {
    return (
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Display markers for mock properties */}
          <PropertyMarkers />
          
          {/* Drawing tools */}
          {drawingEnabled && <DrawingTools onPolygonDrawn={onPolygonDrawn} />}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Error rendering MapComponent:', error);
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
        <div className="text-center p-4">
          <h3 className="text-xl text-red-600 mb-2">Error loading map</h3>
          <p>There was a problem initializing the map component.</p>
        </div>
      </div>
    );
  }
};

export default MapComponent; 
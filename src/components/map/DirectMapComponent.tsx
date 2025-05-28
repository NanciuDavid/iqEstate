import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Import Leaflet Draw directly
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { mockProperties } from '../../data/mockdata';

// Fix for the missing Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up default icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define the shape of the draw events for TypeScript
interface DrawEvent extends L.LeafletEvent {
  layer: L.Layer;
  layerType: string;
}

interface DirectMapComponentProps {
  onPolygonDrawn: (polygon: number[][]) => void;
}

const DirectMapComponent: React.FC<DirectMapComponentProps> = ({ onPolygonDrawn }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  
  useEffect(() => {
    console.log('DirectMapComponent mounting');
    
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    try {
      // Initialize the map with specific options to help with drawing
      const map = L.map(mapContainerRef.current, {
        center: [40.7128, -74.006],
        zoom: 13,
        doubleClickZoom: false, // Important for polygon drawing
        dragging: true,         // Ensure map dragging is enabled
        scrollWheelZoom: true,  // Ensure scroll wheel zoom is enabled
        preferCanvas: true      // Might improve rendering performance
      });
      
      mapInstanceRef.current = map;
      
      // Add base tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add property markers
      mockProperties.slice(0, 10).forEach(property => {
        if (property.latitude && property.longitude) {
          L.marker([property.latitude, property.longitude])
            .addTo(map)
            .bindPopup(`
              <div>
                <h3 style="font-weight: 600">${property.title}</h3>
                <p>$${property.price.toLocaleString()}</p>
                <p style="color: #666; font-size: 0.875rem">${property.address}</p>
              </div>
            `);
        }
      });
      
      // Create a feature group to store drawn items
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;
      
      // Configure specific draw handler options
      const commonShapeOptions = {
        color: '#3949AB',
        weight: 2,
        opacity: 0.8,
        fillColor: '#3949AB',
        fillOpacity: 0.1
      };
      
      const polyOptions: L.DrawOptions.PolygonOptions = {
        showArea: false,
        metric: false,
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: '<strong>Polygon draw does not allow intersections!</strong>'
        },
        shapeOptions: commonShapeOptions,
        icon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: 'leaflet-div-icon leaflet-editing-icon'
        }),
        touchIcon: new L.DivIcon({
            iconSize: new L.Point(20, 20),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
        }),
        repeatMode: false
      };
      
      const rectangleOptions: L.DrawOptions.RectangleOptions = {
        shapeOptions: commonShapeOptions,
        showArea: false,
        metric: false,
        repeatMode: false
      };
      
      // Initialize draw control with more explicit options
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: polyOptions,
          rectangle: rectangleOptions,
          // Disable other drawing tools
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false
        },
        edit: {
          featureGroup: drawnItems,
          edit: false,  // Disable editing for now
          remove: false // Disable removal to ensure shapes stay drawn
        }
      });
      
      // Store the draw control for cleanup
      drawControlRef.current = drawControl;
      
      // Add the draw control to the map
      map.addControl(drawControl);
      
      // Add debug button with clear instructions
      const instructionButton = L.Control.extend({
        options: {
          position: 'topleft'
        },
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
          div.innerHTML = '<a href="#" title="Drawing Instructions" style="background-color: #ffffff; width: 30px; height: 30px; line-height: 30px; text-align: center; display: block;">?</a>';
          
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
          L.DomEvent.on(div, 'click', L.DomEvent.preventDefault);
          L.DomEvent.on(div, 'click', function() {
            alert(
              'Drawing Instructions:\n\n' +
              '1. For Rectangle:\n' +
              '   - Click the rectangle icon in the top-right toolbar.\n' +
              '   - Click once on the map to start the rectangle.\n' +
              '   - Move the mouse to size the rectangle.\n' +
              '   - Click again to finish.\n\n' +
              '2. For Polygon:\n' +
              '   - Click the polygon icon in the top-right toolbar.\n' +
              '   - Click on the map to place points.\n' +
              '   - Click the first point again or double-click to finish the polygon.\n\n' +
              'Shapes will remain on the map. Use the trash icon to clear all shapes.'
            );
          });
          
          return div;
        }
      });
      
      map.addControl(new instructionButton());
      
      // Create a reset button to clear all drawings
      const resetButton = L.Control.extend({
        options: {
          position: 'topright' // Place it next to draw controls
        },
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
          div.innerHTML = '<a href="#" title="Clear drawings" style="background-color: #ffffff; width: 30px; height: 30px; line-height: 30px; text-align: center; display: block;">🗑️</a>';
          
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
          L.DomEvent.on(div, 'click', L.DomEvent.preventDefault);
          L.DomEvent.on(div, 'click', function() {
            drawnItems.clearLayers();
          });
          
          return div;
        }
      });
      
      map.addControl(new resetButton());
      
      // Handle the created event
      const handleDrawCreated = (e: DrawEvent) => {
        console.log('Draw created:', e.layerType, e.layer);
        const layer = e.layer;
        
        // Set opacity for better visibility
        if (layer instanceof L.Path) {
          layer.setStyle({
            fillOpacity: 0.1,
            opacity: 0.8
          });
        }
        
        // Important: Add the new drawn item to our feature group
        drawnItems.addLayer(layer);
        
        // Process coordinates based on shape type
        if (e.layerType === 'polygon' || e.layerType === 'rectangle') {
          try {
            let coordinates: number[][] = [];
            
            if (e.layerType === 'rectangle') {
              // For rectangle, get the bounds and create corners
              const bounds = (layer as L.Rectangle).getBounds();
              console.log("Rectangle bounds:", bounds);
              const nw = bounds.getNorthWest();
              const ne = bounds.getNorthEast();
              const se = bounds.getSouthEast();
              const sw = bounds.getSouthWest();
              
              coordinates = [
                [nw.lat, nw.lng],
                [ne.lat, ne.lng],
                [se.lat, se.lng],
                [sw.lat, sw.lng],
                [nw.lat, nw.lng] // Close the shape
              ];
            } else if (e.layerType === 'polygon') {
              // For polygon, get the latlngs directly
              const latlngs = (layer as L.Polygon).getLatLngs();
              console.log("Polygon latlngs (raw):", latlngs);
              
              // Handle nested arrays that can come from polygons
              if (Array.isArray(latlngs) && latlngs.length > 0) {
                if (Array.isArray(latlngs[0]) && latlngs[0].length > 0 && latlngs[0][0] instanceof L.LatLng) {
                  // Nested polygon (e.g., polygon with a hole, though we disallow intersection)
                  coordinates = (latlngs[0] as L.LatLng[]).map(ll => [ll.lat, ll.lng]);
                } else if (latlngs[0] instanceof L.LatLng) {
                  // Simple polygon
                  coordinates = (latlngs as L.LatLng[]).map(ll => [ll.lat, ll.lng]);
                } else {
                    console.warn("Unexpected polygon latlngs structure:", latlngs);
                }
              } else {
                  console.warn("Empty or invalid polygon latlngs structure:", latlngs);
              }
            }
            
            if (coordinates.length > 0) {
              console.log('Shape coordinates processed:', coordinates);
              onPolygonDrawn(coordinates);
            } else {
              console.warn('No coordinates extracted for layer:', layer);
            }
          } catch (error) {
            console.error('Error extracting coordinates:', error);
          }
        }
      };
      
      // Make sure to register the event listener
      map.on('draw:created', handleDrawCreated as L.LeafletEventHandlerFn);
      
      // Add debug events to monitor drawing process
      map.on('draw:drawstart', (e: L.LeafletEvent) => console.log('Draw started', e.type, (e as DrawEvent).layerType));
      map.on('draw:drawstop', (e: L.LeafletEvent) => console.log('Draw stopped', e.type, (e as DrawEvent).layerType));
      map.on('draw:editstart', () => console.log('Edit started'));
      map.on('draw:editstop', () => console.log('Edit stopped'));
      map.on('draw:deleted', () => console.log('Shape deleted'));
      
      // Add mouse event tracking for debugging
      map.on('mousedown', (e: L.LeafletMouseEvent) => console.log('Map mousedown', e.originalEvent.target , e.latlng));
      map.on('mouseup', (e: L.LeafletMouseEvent) => console.log('Map mouseup', e.latlng));
      map.on('click', (e: L.LeafletMouseEvent) => console.log('Map click', e.latlng));
      map.on('mousemove', (e:L.LeafletMouseEvent) => console.log('Map mousemove', e.latlng));
      
      // Clean up on unmount
      return () => {
        console.log('DirectMapComponent unmounting, cleaning up...');
        
        // Remove event listeners
        map.off('draw:created', handleDrawCreated as L.LeafletEventHandlerFn);
        map.off('draw:drawstart');
        map.off('draw:drawstop');
        map.off('draw:editstart');
        map.off('draw:editstop');
        map.off('draw:deleted');
        map.off('mousedown');
        map.off('mouseup');
        map.off('click');
        map.off('mousemove');
        
        // Remove control
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null; // Clear the ref
        }
        
        // Remove map 
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        drawnItemsRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      return () => {}; // Return an empty cleanup function on error
    }
  }, [onPolygonDrawn]); // Dependency array ensures this effect runs once on mount
  
  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ zIndex: 0 }} // Ensure map is not overlaid by other elements if any
      ></div>
    </div>
  );
};

export default DirectMapComponent; 
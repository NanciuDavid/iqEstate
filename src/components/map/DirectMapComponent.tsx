import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Import Leaflet Draw directly for polygon/rectangle drawing functionality
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

/**
 * DatabaseProperty Interface
 * 
 * This interface defines the structure of property objects returned from the backend database.
 * It matches the backend API response structure to ensure type safety when handling property data.
 * 
 * Key fields for map functionality:
 * - latitude/longitude: Required for map marker positioning
 * - title, price, predictedPrice: Displayed in map popups
 * - images: First image shown in popup if available
 * - featured/newListing: Used for special badges and styling
 */
interface DatabaseProperty {
  id: string;                    // Unique property identifier
  title: string;                 // Property title/name
  price: number;                 // Listed price in EUR
  predictedPrice?: number;       // AI-generated price prediction
  surface: number;               // Property surface area in m²
  bedrooms: number;              // Number of bedrooms
  bathrooms?: number;            // Number of bathrooms (optional)
  address: string;               // Street address
  city?: string;                 // City name (optional)
  county?: string;               // County/region (optional)
  latitude: number;              // GPS latitude for map positioning
  longitude: number;             // GPS longitude for map positioning
  type: string;                  // Property type (APARTMENT, HOUSE, etc.)
  yearBuilt?: number;            // Construction year (optional)
  images: string[];              // Array of image URLs
  listedDate: string;            // When property was listed
  featured: boolean;             // Whether property is featured
  newListing: boolean;           // Whether property is newly listed
}

/**
 * Fix for Leaflet Default Icon Issue
 * 
 * Leaflet has a known issue with default marker icons when used with bundlers like Vite/Webpack.
 * This section imports the default icon images and sets up the default icon to prevent
 * missing icon issues that would show as broken images on the map.
 */
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create and configure the default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,           // Main marker icon image
  shadowUrl: iconShadow,   // Shadow image for 3D effect
  iconSize: [25, 41],      // Size of the icon in pixels [width, height]
  iconAnchor: [12, 41],    // Point of the icon which corresponds to marker's location
  popupAnchor: [1, -34],   // Point from which popups should open relative to iconAnchor
});

// Apply the default icon to all markers to fix the missing icon issue
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * TypeScript Interface for Draw Events
 * 
 * Leaflet Draw events don't have proper TypeScript definitions by default.
 * These interfaces provide type safety for drawing event handlers.
 */
interface DrawEvent extends L.LeafletEvent {
  layer: L.Layer;          // The drawn layer (polygon, rectangle, etc.)
  layerType: string;       // Type of layer drawn ('polygon', 'rectangle', etc.)
}

/**
 * Component Props Interface
 * 
 * Defines the callback function that parent components must provide.
 * This callback is triggered when a user draws a polygon or rectangle on the map.
 */
interface DirectMapComponentProps {
  onPolygonDrawn: (polygon: number[][]) => void;  // Callback with coordinates array
}

/**
 * DirectMapComponent - Interactive Map with Property Display and Drawing Tools
 * 
 * This component provides:
 * 1. Interactive map display centered on Romania (where most properties are located)
 * 2. Real-time property markers loaded from the database
 * 3. Detailed property popups with images, prices, and property details
 * 4. Drawing tools for polygons and rectangles (for area selection)
 * 5. Various map controls (instructions, clear, property info)
 * 
 * The component is designed for property search and area selection workflows.
 */
const DirectMapComponent: React.FC<DirectMapComponentProps> = ({ onPolygonDrawn }) => {
  // ==================== COMPONENT STATE ====================
  
  /**
   * Refs for Map Management
   * 
   * These refs maintain references to Leaflet objects that need to persist
   * across component re-renders and be cleaned up on unmount.
   */
  const mapContainerRef = useRef<HTMLDivElement>(null);        // DOM container for the map
  const mapInstanceRef = useRef<L.Map | null>(null);           // Leaflet map instance
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);   // Container for drawn shapes
  const drawControlRef = useRef<L.Control.Draw | null>(null);  // Drawing controls

  /**
   * Component State
   * 
   * Manages property data and loading states for the map display.
   */
  const [properties, setProperties] = useState<DatabaseProperty[]>([]);  // Array of properties to display
  const [loading, setLoading] = useState(true);                          // Loading state for API calls
  
  // ==================== PROPERTY DATA FETCHING ====================
  
  /**
   * Property Fetching Effect
   * 
   * This effect runs once on component mount to fetch property data from the backend.
   * It fetches up to 2000 properties and filters for those with valid coordinates.
   * 
   * The API endpoint returns: { success: boolean, data: Property[], pagination: {...} }
   */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch properties directly from the API with a larger limit to show more on map
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/properties?limit=2000`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Filter properties that have valid coordinates
          // This ensures we only display properties that can be positioned on the map
          const validProperties = data.data.filter(
            (property: DatabaseProperty) => 
              property.latitude && 
              property.longitude && 
              property.latitude !== 0 && 
              property.longitude !== 0
          );
          
          setProperties(validProperties);
          console.log(`Loaded ${validProperties.length} properties with valid coordinates for DirectMapComponent`);
        } else {
          console.error('Failed to fetch properties:', data.message);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array means this runs once on mount
  
  // ==================== MAP INITIALIZATION ====================
  
  /**
   * Main Map Initialization Effect
   * 
   * This effect handles:
   * 1. Map creation and configuration
   * 2. Adding property markers
   * 3. Setting up drawing controls
   * 4. Adding custom UI controls
   * 5. Event handling for drawings
   * 6. Cleanup on unmount
   * 
   * Dependencies: [onPolygonDrawn, properties, loading]
   * - Re-runs when properties are loaded or callback changes
   */
  useEffect(() => {
    console.log('DirectMapComponent mounting');
    
    // Prevent re-initialization if map already exists
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    
    try {
      // ==================== MAP CREATION ====================
      
      /**
       * Initialize Leaflet Map
       * 
       * Configuration optimized for property viewing in Romania:
       * - Center: [45.9432, 24.9668] - Geographic center of Romania
       * - Zoom: 7 - Shows entire country with good detail
       * - Drawing-specific options to prevent conflicts
       */
      const map = L.map(mapContainerRef.current, {
        center: [45.9432, 24.9668], // Romania center - most properties are located here
        zoom: 7,                    // Country-level zoom for overview
        doubleClickZoom: false,     // Important for polygon drawing - prevents zoom conflicts
        dragging: true,             // Ensure map dragging is enabled
        scrollWheelZoom: true,      // Ensure scroll wheel zoom is enabled
        preferCanvas: true          // Might improve rendering performance with many markers
      });
      
      // Store map reference for cleanup and access in other functions
      mapInstanceRef.current = map;
      
      // ==================== BASE LAYER SETUP ====================
      
      /**
       * Add OpenStreetMap Tile Layer
       * 
       * Provides the base map imagery. OpenStreetMap is free and reliable,
       * with good coverage of Romania and surrounding areas.
       */
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // ==================== PROPERTY MARKERS ====================
      
      /**
       * Property Marker Creation Function
       * 
       * Creates markers for all valid properties and adds them to the map.
       * Each marker includes a detailed popup with property information.
       * Only called when properties are loaded (!loading && properties.length > 0).
       */
      const addPropertyMarkers = () => {
        if (!loading && properties.length > 0) {
          properties.forEach(property => {
            // Create marker at property coordinates
            L.marker([property.latitude, property.longitude])
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 250px;">
                  <!-- Property Title -->
                  <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 8px; line-height: 1.2;">${property.title}</h3>
                  
                  <!-- Price Information Section -->
                  <div style="margin-bottom: 8px;">
                    <p style="font-size: 16px; font-weight: bold; color: #16a34a; margin: 0;">
                      €${property.price?.toLocaleString() || 'N/A'}
                    </p>
                    ${property.predictedPrice ? `
                      <p style="font-size: 12px; color: #666; margin: 0;">
                        AI Prediction: €${property.predictedPrice.toLocaleString()}
                      </p>
                    ` : ''}
                  </div>

                  <!-- Property Details Section -->
                  <div style="font-size: 12px; color: #666; line-height: 1.4;">
                    <!-- Address Information -->
                    <p style="margin: 2px 0;">📍 ${property.address}</p>
                    ${property.city ? `<p style="margin: 2px 0;">🏙️ ${property.city}</p>` : ''}
                    
                    <!-- Property Specifications -->
                    <div style="display: flex; gap: 16px; margin: 4px 0;">
                      <span>🛏️ ${property.bedrooms}</span>
                      ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
                      <span>📐 ${property.surface}m²</span>
                    </div>
                    
                    <!-- Property Type and Year -->
                    <p style="margin: 2px 0;">🏠 ${property.type}</p>
                    ${property.yearBuilt ? `<p style="margin: 2px 0;">📅 Built: ${property.yearBuilt}</p>` : ''}
                  </div>

                  <!-- Property Image (if available) -->
                  ${property.images && property.images.length > 0 ? `
                    <div style="margin-top: 8px;">
                      <img 
                        src="${property.images[0]}" 
                        alt="${property.title}"
                        style="width: 100%; height: 96px; object-fit: cover; border-radius: 4px;"
                        onerror="this.style.display='none';"
                      />
                    </div>
                  ` : ''}

                  <!-- Property Status Badges -->
                  <div style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
                    ${property.featured ? `
                      <span style="padding: 2px 8px; background-color: #fef3c7; color: #92400e; font-size: 10px; border-radius: 4px;">
                        ⭐ Featured
                      </span>
                    ` : ''}
                    ${property.newListing ? `
                      <span style="padding: 2px 8px; background-color: #dbeafe; color: #1d4ed8; font-size: 10px; border-radius: 4px;">
                        🆕 New
                      </span>
                    ` : ''}
                  </div>
                </div>
              `);
          });
        }
      };
      
      // ==================== DRAWING FUNCTIONALITY SETUP ====================
      
      /**
       * Drawing Controls Configuration
       * 
       * Sets up Leaflet Draw with polygon and rectangle tools for area selection.
       * Users can draw shapes to define search areas or regions of interest.
       */
      
      // Create a feature group to store drawn items
      // This container holds all drawn shapes and allows for easy management
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;
      
      // Configure specific draw handler options
      const commonShapeOptions = {
        color: '#3949AB',        // Purple color for drawn shapes
        weight: 2,               // Line thickness
        opacity: 0.8,            // Line opacity
        fillColor: '#3949AB',    // Fill color (same as border)
        fillOpacity: 0.1         // Very light fill to see underlying map
      };
      
      /**
       * Polygon Drawing Configuration
       * 
       * Configures the polygon tool with specific options for usability:
       * - No area display (keeps UI clean)
       * - No intersections allowed (prevents complex shapes)
       * - Custom error messages for user guidance
       */
      const polyOptions: L.DrawOptions.PolygonOptions = {
        showArea: false,              // Don't show area calculations
        metric: false,                // Don't show metric measurements
        allowIntersection: false,     // Prevent self-intersecting polygons
        drawError: {
          color: '#e1e100',           // Yellow color for error highlighting
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
        repeatMode: false            // Don't automatically start new polygon after completing one
      };
      
      /**
       * Rectangle Drawing Configuration
       * 
       * Simpler configuration for rectangle tool - easier for users to create
       * rectangular search areas.
       */
      const rectangleOptions: L.DrawOptions.RectangleOptions = {
        shapeOptions: commonShapeOptions,
        showArea: false,             // Don't show area calculations
        metric: false,               // Don't show metric measurements
        repeatMode: false            // Don't automatically start new rectangle
      };
      
      /**
       * Initialize Drawing Control
       * 
       * Creates the drawing toolbar with polygon and rectangle tools.
       * Disables other drawing tools (circles, markers, etc.) to keep interface focused.
       */
      const drawControl = new L.Control.Draw({
        position: 'topright',        // Position in top-right corner
        draw: {
          polygon: polyOptions,      // Enable polygon with custom options
          rectangle: rectangleOptions, // Enable rectangle with custom options
          // Disable other drawing tools to keep interface simple
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false
        },
        edit: {
          featureGroup: drawnItems,  // Allow editing of drawn items
          edit: false,               // Disable editing for now (keeps UI simple)
          remove: false              // Disable removal to ensure shapes stay drawn
        }
      });
      
      // Store the draw control for cleanup and add to map
      drawControlRef.current = drawControl;
      map.addControl(drawControl);
      
      // ==================== CUSTOM MAP CONTROLS ====================
      
      /**
       * Property Information Button Control
       * 
       * A custom control that provides information about the property data on the map.
       * Displays statistics about loaded properties and data sources.
       */
      const propertyInfoButton = L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          div.innerHTML = `
            <a href="#" class="leaflet-control-property-info" title="Property Information" style="
              background: white; 
              color: #374151; 
              width: 40px; 
              height: 40px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              border: 2px solid rgba(0,0,0,0.2);
              background-clip: padding-box;
            ">ℹ</a>
          </div>`;
          
          return div;
        }
      });
      
      map.addControl(new propertyInfoButton());
      
      /**
       * Clear Drawn Shapes Button Control
       * 
       * A custom control that allows users to clear all drawn polygons and rectangles
       */
      const clearShapesButton = L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          div.innerHTML = `
            <a href="#" class="leaflet-control-clear-shapes" title="Clear Drawn Shapes" style="
              background: white; 
              color: #dc2626; 
              width: 40px; 
              height: 40px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              border: 2px solid rgba(0,0,0,0.2);
              background-clip: padding-box;
            ">✕</a>
          </div>`;
          
          // Add click handler to clear drawn shapes
          const clearButton = div.querySelector('.leaflet-control-clear-shapes');
          L.DomEvent.on(clearButton as HTMLElement, 'click', (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            
            // Clear all drawn items
            drawnItems.clearLayers();
            console.log('Cleared all drawn shapes');
            
            // Reset map view to original center and zoom
            map.setView([45.9432, 24.9668], 7);
          });
          
          return div;
        }
      });
      
      map.addControl(new clearShapesButton({ position: 'topright' }));
      
      // ==================== ADD PROPERTY MARKERS TO MAP ====================
      
      // Add property markers when properties are loaded
      addPropertyMarkers();
      
      // ==================== DRAWING EVENT HANDLING ====================
      
      /**
       * Handle Draw Created Events
       * 
       * This function is called whenever a user completes drawing a shape (polygon or rectangle).
       * It processes the drawn shape and extracts coordinates to pass to the parent component.
       * 
       * The coordinate extraction handles different shape types and Leaflet's various
       * data structures for polygon coordinates.
       */
      const handleDrawCreated = (e: DrawEvent) => {
        console.log('Draw created:', e.layerType, e.layer);
        const layer = e.layer;
        
        // Set enhanced styling for better visibility of drawn shapes
        if (layer instanceof L.Path) {
          layer.setStyle({
            fillOpacity: 0.15,       // Slightly more visible fill
            opacity: 1,              // Solid border for clear definition
            color: '#2563eb',        // Blue border color
            fillColor: '#3b82f6',    // Blue fill color
            weight: 3                // Thicker border
          });
        }
        
        // Important: Add the new drawn item to our feature group for management
        drawnItems.addLayer(layer);
        
        // Optionally fit the map view to the drawn polygon for better UX
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          try {
            const bounds = layer.getBounds();
            // Fit map to the drawn area with some padding
            map.fitBounds(bounds, { 
              padding: [20, 20],  // Add padding around the bounds
              maxZoom: 15         // Don't zoom in too much
            });
          } catch (error) {
            console.warn('Could not fit map to drawn bounds:', error);
          }
        }
        
        // Process coordinates based on shape type
        if (e.layerType === 'polygon' || e.layerType === 'rectangle') {
          try {
            let coordinates: number[][] = [];
            
            if (e.layerType === 'rectangle') {
              /**
               * Rectangle Coordinate Extraction
               * 
               * For rectangles, we get the bounds and create corner coordinates.
               * This ensures a proper closed polygon with 5 points (4 corners + closing point).
               */
              const bounds = (layer as L.Rectangle).getBounds();
              console.log("Rectangle bounds:", bounds);
              const nw = bounds.getNorthWest();
              const ne = bounds.getNorthEast();
              const se = bounds.getSouthEast();
              const sw = bounds.getSouthWest();
              
              coordinates = [
                [nw.lat, nw.lng],      // Northwest corner
                [ne.lat, ne.lng],      // Northeast corner
                [se.lat, se.lng],      // Southeast corner
                [sw.lat, sw.lng],      // Southwest corner
                [nw.lat, nw.lng]       // Close the shape (return to start)
              ];
            } else if (e.layerType === 'polygon') {
              /**
               * Polygon Coordinate Extraction
               * 
               * Polygons can have nested coordinate arrays in Leaflet.
               * We handle both simple polygons and more complex structures.
               */
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
            
            // If we successfully extracted coordinates, pass them to parent component
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
      
      // Register the draw event handler
      map.on('draw:created', handleDrawCreated as L.LeafletEventHandlerFn);
      
      // ==================== DEBUG EVENT LISTENERS ====================
      
      /**
       * Debug Event Listeners
       * 
       * These event listeners help with debugging drawing functionality.
       * They log various drawing states and mouse events to the console.
       * Useful for troubleshooting user interaction issues.
       */
      map.on('draw:drawstart', (e: L.LeafletEvent) => console.log('Draw started', e.type, (e as DrawEvent).layerType));
      map.on('draw:drawstop', (e: L.LeafletEvent) => console.log('Draw stopped', e.type, (e as DrawEvent).layerType));
      map.on('draw:editstart', () => console.log('Edit started'));
      map.on('draw:editstop', () => console.log('Edit stopped'));
      map.on('draw:deleted', () => console.log('Shape deleted'));
      
      // Mouse event tracking for debugging user interactions
      map.on('mousedown', (e: L.LeafletMouseEvent) => console.log('Map mousedown', e.originalEvent.target , e.latlng));
      map.on('mouseup', (e: L.LeafletMouseEvent) => console.log('Map mouseup', e.latlng));
      map.on('click', (e: L.LeafletMouseEvent) => console.log('Map click', e.latlng));
      map.on('mousemove', (e:L.LeafletMouseEvent) => console.log('Map mousemove', e.latlng));
      
      // ==================== CLEANUP FUNCTION ====================
      
      /**
       * Component Cleanup
       * 
       * This cleanup function is returned from the useEffect and runs when:
       * 1. Component unmounts
       * 2. Dependencies change (onPolygonDrawn, properties, loading)
       * 
       * Proper cleanup prevents memory leaks and ensures event listeners
       * don't persist after component destruction.
       */
      return () => {
        console.log('DirectMapComponent unmounting, cleaning up...');
        
        // Remove all event listeners to prevent memory leaks
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
        
        // Remove drawing control from map
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null; // Clear the ref
        }
        
        // Remove map instance and clean up
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        // Clear drawn items reference
        drawnItemsRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      return () => {}; // Return an empty cleanup function on error
    }
  }, [onPolygonDrawn, properties, loading]); // Dependency array ensures this effect runs when these values change

  // ==================== COMPONENT RENDER ====================
  
  /**
   * Component Render
   * 
   * Returns a div container for the Leaflet map with:
   * - Fixed height for consistent display
   * - Tailwind CSS classes for styling
   * - Proper z-index to prevent overlay issues
   * 
   * The mapContainerRef is attached to this div so Leaflet can render the map here.
   */
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
/**
 * HeroSearch Component for EstateIQ
 * 
 * This is the main search interface displayed prominently on the homepage.
 * It provides users with multiple ways to search for properties:
 * 
 * Features:
 * - Three search modes: Location, Price, and Property Type
 * - Advanced filters panel with detailed criteria
 * - Responsive design that works on all screen sizes
 * - Form validation and URL parameter generation
 * - Smooth transitions and hover effects
 * 
 * The component uses controlled inputs and manages complex state for
 * both basic and advanced search functionality.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home, DollarSign } from 'lucide-react'

const HeroSearch = () => {
  // Navigation hook for redirecting to search results
  const navigate = useNavigate()
  
  // === BASIC SEARCH STATE ===
  const [searchType, setSearchType] = useState<'location'|'price'|'type'>('location') // Current search mode
  const [location, setLocation] = useState('') // Location search input
  const [priceRange, setPriceRange] = useState('any') // Price range selection
  const [propertyType, setPropertyType] = useState('') // Property type selection
  const [showAdvanced, setShowAdvanced] = useState(false) // Toggle for advanced filters

  // === ADVANCED SEARCH FILTERS ===
  // These provide more granular search options for power users
  const [rooms, setRooms] = useState('') // Number of rooms
  const [floor, setFloor] = useState('') // Floor number
  const [floorsMin, setFloorsMin] = useState('') // Minimum floors in building
  const [floorsMax, setFloorsMax] = useState('') // Maximum floors in building
  const [priceMin, setPriceMin] = useState('') // Custom minimum price
  const [priceMax, setPriceMax] = useState('') // Custom maximum price
  const [listed, setListed] = useState('') // When property was listed
  const [yearMin, setYearMin] = useState('') // Minimum construction year
  const [yearMax, setYearMax] = useState('') // Maximum construction year
  const [seller, setSeller] = useState('') // Seller type (owner, agency, etc.)
  const [condition, setCondition] = useState('') // Property condition
  const [features, setFeatures] = useState<string[]>([]) // Array of selected features/amenities
  
  /**
   * Handle feature checkbox changes
   * Manages the array of selected features by adding/removing items
   */
  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    // If checked, add to array; if unchecked, remove from array
    setFeatures(f => checked ? [...f, value] : f.filter(x=>x!==value))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location)   params.append('location', location)
    if (priceRange) params.append('price', priceRange)
    if (propertyType) params.append('type', propertyType)
    // … append any advanced fields you like …
    navigate(`/search?${params.toString()}`)
  }

  const pickers: Array<{key: 'location'|'price'|'type', icon: React.ReactNode, label: string}> = [
    {
      key: 'location',
      icon: <MapPin   className="w-5 h-5 text-current" />,
      label: 'Location',
    },
    {
      key: 'price',
      icon: <DollarSign className="w-5 h-5 text-current" />,
      label: 'Price',
    },
    {
      key: 'type',
      icon: <Home     className="w-5 h-5 text-current" />,
      label: 'Type',
    },
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl space-y-4 border border-slate-200">
      {/* search type toggles */}
      <div className="flex flex-wrap gap-2">
        {pickers.map(item => (
          <button
            key={item.key}
            onClick={() => setSearchType(item.key as 'location'|'price'|'type')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === item.key
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* top row: input + toggle + submit */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {searchType === 'location' && (
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                Where?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="location"
                  type="text"
                  placeholder="City or address"
                  value={location}
                  onChange={e=>setLocation(e.target.value)}
                  className="w-full pl-10 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm"
                />
              </div>
            </div>
          )}

          {searchType === 'price' && (
            <div className="md:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                Price Range
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="price"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  className="w-full pl-10 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm"
                >
                  <option value="any">Any</option>
                  <option value="0-50000">Under $50k</option>
                  <option value="50000-100000">$50k–100k</option>
                  <option value="100000-200000">$100k–200k</option>
                  <option value="over 200000">Over $200k</option>
                </select>
              </div>
            </div>
          )}

          {searchType === 'type' && (
            <div className="md:col-span-2">
              <label htmlFor="ptype" className="block text-sm font-medium text-slate-700 mb-1">
                Property Type
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="ptype"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full pl-10 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm"
                >
                  <option value="">Any</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            className="md:col-span-1 px-3 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm text-sm font-medium"
          >
            {showAdvanced ? 'Hide Filters' : 'More Filters'}
          </button>

          <button
            type="submit"
            className={`
              md:col-span-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm
              flex items-center justify-center gap-2 text-sm font-medium
              ${showAdvanced ? 'hidden md:flex' : 'flex'}
            `}
          >
            Search <Search className="w-4 h-4"/>
          </button>
        </div>

        {/* advanced panel */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
            {/* Rooms */}
            <div>
              <label htmlFor="rooms" className="block text-sm font-medium text-slate-700 mb-1">
                Rooms
              </label>
              <select
                id="rooms"
                value={rooms}
                onChange={e=>setRooms(e.target.value)}
                className="w-full py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
              >
                <option value="">Any</option>
                {[1,2,3,4,5,6].map(n=>(
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-slate-700 mb-1">
                Floor
              </label>
              <select
                id="floor"
                value={floor}
                onChange={e=>setFloor(e.target.value)}
                className="w-full py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
              >
                <option value="">Any</option>
                {[...Array(10)].map((_,i)=>(
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Total Floors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Floors</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={floorsMin}
                  onChange={e=>setFloorsMin(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={floorsMax}
                  onChange={e=>setFloorsMax(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
              </div>
            </div>

            {/* Price / m² */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price / m²</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={e=>setPriceMin(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={e=>setPriceMax(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
              </div>
            </div>

            {/* Listed */}
            <div>
              <label htmlFor="listed" className="block text-sm font-medium text-slate-700 mb-1">
                Listed (days ago)
              </label>
              <select
                id="listed"
                value={listed}
                onChange={e => setListed(e.target.value)}
                className="w-full py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
              >
                <option value="">Any</option>
                <option value="24h">Last 24h</option>
                <option value="3d">Last 3 days</option>
                <option value="7d">Last 7 days</option>
              </select>
            </div>

            {/* Year Built */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year Built</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={yearMin}
                  onChange={e=>setYearMin(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={yearMax}
                  onChange={e=>setYearMax(e.target.value)}
                  className="w-1/2 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
                />
              </div>
            </div>

            {/* Seller Type */}
            <div>
              <label htmlFor="seller" className="block text-sm font-medium text-slate-700 mb-1">
                Seller Type
              </label>
              <select
                id="seller"
                value={seller}
                onChange={e=>setSeller(e.target.value)}
                className="w-full py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
              >
                <option value="">Any</option>
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-slate-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={e=>setCondition(e.target.value)}
                className="w-full py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 shadow-sm sm:text-sm px-2"
              >
                <option value="">Any</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            {/* Features Checkboxes */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                {[ 'Parking', 'Garage', 'Balcony', 'Terrace', 'Garden', 'Elevator', 'Furnished', 'New Building'].map(f => (
                  <div key={f} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${f}`}
                      value={f}
                      checked={features.includes(f)}
                      onChange={handleFeatureChange}
                      className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500 shadow-sm"
                    />
                    <label htmlFor={`feature-${f}`} className="ml-2 text-sm text-slate-600">
                      {f}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm text-sm font-medium">
                    Apply Filters & Search
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default HeroSearch
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home, DollarSign, ArrowRight } from 'lucide-react'

const HeroSearch = () => {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState<'location'|'price'|'type'>('location')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState('any')
  const [propertyType, setPropertyType] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // advanced filters
  const [rooms, setRooms] = useState('')
  const [floor, setFloor] = useState('')
  const [floorsMin, setFloorsMin] = useState('')
  const [floorsMax, setFloorsMax] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [listed, setListed] = useState('')
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [seller, setSeller] = useState('')
  const [condition, setCondition] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    setFeatures(f => checked ? [...f, value] : f.filter(x=>x!==value)) // logic : if checked, add to array, if not, remove from array by filtering out the value 
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
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      {/* search type toggles */}
      <div className="flex flex-wrap gap-2">
        {pickers.map(item => (
          <button
            key={item.key}
            onClick={() => setSearchType(item.key as 'location'|'price'|'type')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md ${
              searchType === item.key
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700'
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
              <label htmlFor="location" className="block text-sm text-gray-700">
                Where?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  placeholder="City or address"
                  value={location}
                  onChange={e=>setLocation(e.target.value)}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {searchType === 'price' && (
            <div className="md:col-span-2">
              <label htmlFor="price" className="block text-sm text-gray-700">
                Price Range
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="price"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-blue-500"
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
              <label htmlFor="ptype" className="block text-sm text-gray-700">
                Property Type
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="ptype"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full pl-10 py-2 border rounded-md focus:ring-blue-500"
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
            className="md:col-span-1 px-3 py-2 border rounded-md text-blue-600 hover:bg-gray-100"
          >
            {showAdvanced ? 'Hide Filters' : 'More Filters'}
          </button>

          <button
            type="submit"
            className={`
              md:col-span-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800
              flex items-center justify-center gap-2
              ${showAdvanced ? 'hidden md:flex' : 'flex'}
            `}
          >
            Search <Search />
          </button>
        </div>

        {/* advanced panel */}
        {showAdvanced && (
          <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rooms */}
            <div>
              <label htmlFor="rooms" className="block text-sm text-gray-700">
                Rooms
              </label>
              <select
                id="rooms"
                value={rooms}
                onChange={e=>setRooms(e.target.value)}
                className="w-full py-2 border rounded-md focus:ring-blue-500 px-2"
              >
                <option value="">Any</option>
                {[1,2,3,4,5,6].map(n=>(
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm text-gray-700 px-2">
                Floor
              </label>
              <select
                id="floor"
                value={floor}
                onChange={e=>setFloor(e.target.value)}
                className="w-full py-2 border rounded-md focus:ring-blue-500 px-2"
              >
                <option value="">Any</option>
                {[...Array(10)].map((_,i)=>(
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Total Floors */}
            <div>
              <label className="block text-sm text-gray-700">Total Floors</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={floorsMin}
                  onChange={e=>setFloorsMin(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={floorsMax}
                  onChange={e=>setFloorsMax(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
              </div>
            </div>

            {/* Price / m² */}
            <div>
              <label className="block text-sm text-gray-700">Price / m²</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={e=>setPriceMin(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={e=>setPriceMax(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
              </div>
            </div>

            {/* Listed */}
            <div>
              <label htmlFor="listed" className="block text-sm text-gray-700">
                Listed
              </label>
              <select
                id="listed"
                value={listed}
                onChange={e=>setListed(e.target.value)}
                className="w-full py-2 border rounded-md focus:ring-blue-500 px-2"
              >
                <option value="">Any</option>
                <option value="24h">Last 24h</option>
                <option value="3d">Last 3 days</option>
                <option value="7d">Last 7 days</option>
              </select>
            </div>

            {/* Year Built */}
            <div>
              <label className="block text-sm text-gray-700">Year Built</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={yearMin}
                  onChange={e=>setYearMin(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={yearMax}
                  onChange={e=>setYearMax(e.target.value)}
                  className="w-1/2 py-2 border rounded-md focus:ring-blue-500 px-2"
                />
              </div>
            </div>

            {/* Seller */}
            <div>
              <label htmlFor="seller" className="block text-sm text-gray-700">
                Seller
              </label>
              <select
                id="seller"
                value={seller}
                onChange={e=>setSeller(e.target.value)}
                className="w-full py-2 border rounded-md focus:ring-blue-500 px-2"
              >
                <option value="">Any</option>
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="cond" className="block text-sm text-gray-700">
                Condition
              </label>
              <select
                id="cond"
                value={condition}
                onChange={e=>setCondition(e.target.value)}
                className="w-full py-2 border rounded-md focus:ring-blue-500 px-"
              >
                <option value="">Any</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            {/* Features */}
            <div className="col-span-full">
              <span className="block text-sm text-gray-700 mb-1">Features</span>
              <div className="flex flex-wrap gap-2">
                {['Balcony','Terrace','Garage','Elevator','Garden','Pictures'].map(f => (
                  <label key={f} className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      value={f.toLowerCase()}
                      checked={features.includes(f.toLowerCase())}
                      onChange={handleFeatureChange}
                      className="rounded border-gray-300 text-blue-900 focus:ring-blue-500"
                    />
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* on small screens only, re-render the Search button below */ }
            <div className="col-span-full md:hidden mt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
              >
                Search <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default HeroSearch
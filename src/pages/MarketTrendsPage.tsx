import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, BarChart3, Activity, Map, Users, AlertTriangle } from 'lucide-react';

// Mock data for demonstration
const mockTrendData = {
  cityOverall: {
    priceTrend: 'up', // 'up', 'down', 'stable'
    priceChangePercent: 2.5,
    medianPrice: 450000,
    demandSupplyRatio: 1.8, // >1 means demand > supply
    prediction: 'Prices expected to continue a moderate rise of 1-2% in the next quarter.',
  },
  neighborhoods: [
    {
      name: 'Downtown Core',
      priceTrend: 'up',
      priceChangePercent: 3.1,
      medianPrice: 650000,
      averageDaysOnMarket: 35,
    },
    {
      name: 'Greenwood Heights',
      priceTrend: 'stable',
      priceChangePercent: 0.5,
      medianPrice: 380000,
      averageDaysOnMarket: 55,
    },
    {
      name: 'Northlake Suburbs',
      priceTrend: 'up',
      priceChangePercent: 2.0,
      medianPrice: 320000,
      averageDaysOnMarket: 42,
    },
  ],
  propertyTypes: [
    {
      type: 'Apartment',
      priceTrend: 'up',
      priceChangePercent: 2.8,
      medianPrice: 420000,
    },
    {
      type: 'House',
      priceTrend: 'stable',
      priceChangePercent: 1.5,
      medianPrice: 550000,
    },
    {
      type: 'Condo',
      priceTrend: 'up',
      priceChangePercent: 3.5,
      medianPrice: 390000,
    },
  ],
  marketActivity: {
    listingsLast30Days: 1250,
    salesLast30Days: 850,
    averageDOM: 45, // Days On Market
  }
};

const MarketTrendsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Market Trends</span>
      </div>

      <div className="mb-12 text-center">
        <TrendingUp className="h-16 w-16 text-blue-900 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Real Estate Market Trends</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay informed with AI-powered insights into the latest market movements, price fluctuations, and predictions for your area.
        </p>
      </div>

      {/* Overall Market Summary */}
      <section className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-blue-900" /> City-Wide Market Overview (Mock Data)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Overall Price Trend</p>
            <div className={`text-2xl font-bold flex items-center justify-between ${mockTrendData.cityOverall.priceTrend === 'up' ? 'text-green-600' : mockTrendData.cityOverall.priceTrend === 'down' ? 'text-red-600' : 'text-gray-700'}`}>
              {mockTrendData.cityOverall.priceTrend === 'up' && <TrendingUp className="w-5 h-5 mr-1" />}
              {mockTrendData.cityOverall.priceTrend === 'down' && <TrendingUp className="w-5 h-5 mr-1 transform rotate-180" />}
              {mockTrendData.cityOverall.priceTrend.charAt(0).toUpperCase() + mockTrendData.cityOverall.priceTrend.slice(1)} ({mockTrendData.cityOverall.priceChangePercent}%)
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Median Property Price</p>
            <p className="text-2xl font-bold text-gray-900">${mockTrendData.cityOverall.medianPrice.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Demand vs. Supply</p>
            <p className={`text-2xl font-bold ${mockTrendData.cityOverall.demandSupplyRatio > 1 ? 'text-orange-600' : 'text-green-600'}`}>
              {mockTrendData.cityOverall.demandSupplyRatio > 1 ? 'High Demand' : 'Balanced'} ({mockTrendData.cityOverall.demandSupplyRatio}:1)
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-4">
            <p className="text-sm font-medium text-blue-800 mb-1">AI Market Prediction</p>
            <p className="text-md text-blue-700">{mockTrendData.cityOverall.prediction}</p>
          </div>
        </div>
      </section>
      
      {/* Placeholder for Price Trends Over Time Chart */}
      <section className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-7 h-7 mr-3 text-blue-900" /> Price Trends Over Time (City Average)
        </h2>
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Chart showing price trends over the last 12-24 months will be here.</p>
        </div>
      </section>

      {/* Neighborhood Spotlights */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Map className="w-7 h-7 mr-3 text-blue-900" /> Neighborhood Spotlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrendData.neighborhoods.map(hood => (
            <div key={hood.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{hood.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Trend:</span>
                  <span className={`font-medium ${hood.priceTrend === 'up' ? 'text-green-600' : hood.priceTrend === 'down' ? 'text-red-600' : 'text-gray-700'}`}>
                    {hood.priceTrend.charAt(0).toUpperCase() + hood.priceTrend.slice(1)} ({hood.priceChangePercent}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Median Price:</span>
                  <span className="font-medium text-gray-900">${hood.medianPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Days on Market:</span>
                  <span className="font-medium text-gray-900">{hood.averageDaysOnMarket} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trends by Property Type */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="w-7 h-7 mr-3 text-blue-900" /> Trends by Property Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrendData.propertyTypes.map(pt => (
            <div key={pt.type} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{pt.type}s</h3>
               <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Trend:</span>
                  <span className={`font-medium ${pt.priceTrend === 'up' ? 'text-green-600' : pt.priceTrend === 'down' ? 'text-red-600' : 'text-gray-700'}`}>
                    {pt.priceTrend.charAt(0).toUpperCase() + pt.priceTrend.slice(1)} ({pt.priceChangePercent}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Median Price:</span>
                  <span className="font-medium text-gray-900">${pt.medianPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Activity Snapshot */}
      <section className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-blue-900" /> Market Activity Snapshot (Last 30 Days)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-3xl font-bold text-blue-900">{mockTrendData.marketActivity.listingsLast30Days}</p>
                <p className="text-sm text-gray-600">New Listings</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{mockTrendData.marketActivity.salesLast30Days}</p>
                <p className="text-sm text-gray-600">Properties Sold</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{mockTrendData.marketActivity.averageDOM}</p>
                <p className="text-sm text-gray-600">Avg. Days on Market</p>
            </div>
        </div>
      </section>

      <div className="mt-12 bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg flex items-start">
        <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
        <div>
            <h3 className="font-semibold mb-1">Disclaimer</h3>
            <p className="text-sm">
            The market trends and predictions presented on this page are generated by AI analysis of available data and are for informational purposes only. 
            They should not be considered as financial or investment advice. Real estate markets are dynamic; always consult with qualified professionals before making decisions.
            </p>
        </div>
      </div>

    </div>
  );
};

export default MarketTrendsPage; 
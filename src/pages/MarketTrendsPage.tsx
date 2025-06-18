import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Map, 
  AlertTriangle,
  Home,
  Building,
  Target,
  Globe,
  ChartBar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Euro
} from 'lucide-react';

// Real Romanian macroeconomic data based on European Commission and NBR research
const romanianMacroeconomicData = {
  nationalBankOfRomania: {
    currentRate: 6.50,
    projectedCuts: 2.0,
    nextReview: "July 2025",
    lastUpdate: "May 2025"
  },
  mortgageRates: {
    currentVariable: 7.2,
    currentFixed: 8.1,
    projected2025: 7.5,
    trend: "slightly_declining"
  },
  housingMarket: {
    nationalPriceGrowth2024: 13.0,
    projectedGrowth2025: 4.5,
    averagePricePerSqm: 1700,
    bucharestPricePerSqm: 1862,
    inventoryChange: -30.0,
    transactionVolume: 169000
  },
  economicIndicators: {
    inflation2024: 5.8,
    inflation2025: 5.1,
    inflation2026: 3.9,
    unemployment2025: 5.3,
    gdpGrowth2024: 0.8,
    gdpGrowth2025: 1.4,
    gdpGrowth2026: 2.2,
    budgetDeficit: -9.3,
    publicDebt: 54.8,
    currentAccount: -8.5
  },
  regionalData: [
    {
      region: "București (Bucharest)",
      priceGrowth: 15.0,
      averagePrice: 1862,
      marketCondition: "seller_favored",
      inventoryTrend: "decreasing",
      description: "Capital city with highest prices but strong demand"
    },
    {
      region: "Cluj-Napoca",
      priceGrowth: 18.0,
      averagePrice: 2800,
      marketCondition: "seller_favored", 
      inventoryTrend: "stable",
      description: "Tech hub with highest prices in Romania"
    },
    {
      region: "Timișoara",
      priceGrowth: 12.8,
      averagePrice: 1700,
      marketCondition: "balanced",
      inventoryTrend: "increasing",
      description: "Western Romania's economic center"
    },
    {
      region: "Brașov",
      priceGrowth: 20.0,
      averagePrice: 2100,
      marketCondition: "seller_favored",
      inventoryTrend: "stable",
      description: "Mountain tourism and industry hub"
    },
    {
      region: "Constanța",
      priceGrowth: 13.6,
      averagePrice: 1766,
      marketCondition: "balanced",
      inventoryTrend: "seasonal",
      description: "Black Sea coast with tourism potential"
    },
    {
      region: "Iași",
      priceGrowth: 10.5,
      averagePrice: 1450,
      marketCondition: "balanced",
      inventoryTrend: "stable",
      description: "University city with steady growth"
    }
  ],
  keyInsights: [
    "Romania's real estate prices grew 13% nationally in 2024, outpacing wage growth",
    "Bucharest offers highest rental yields (6.5%+) among major Romanian cities",
    "Construction permits fell 20.7% in 2023, creating supply constraints",
    "Schengen membership expected to boost commercial real estate demand",
    "First-time buyer programs support market accessibility for young families",
    "EU infrastructure investments driving development in secondary cities"
  ]
};

// Romanian market forecast data
const romanianForecastData = {
  shortTerm: {
    period: "Next 12 Months (2025)",
    predictions: [
      "Property prices expected to grow 3-7% nationally as supply constraints persist",
      "Mortgage rates likely to decrease to 7.5% as NBR implements modest cuts",
      "Bucharest apartment supply to remain limited with only 272 new permits in 2024",
      "Residential construction to rebound with EU infrastructure funding"
    ]
  },
  longTerm: {
    period: "2025-2026 Outlook", 
    predictions: [
      "Romania's economy to strengthen with 2.2% GDP growth by 2026",
      "Inflation to decrease to below 4% by 2026, supporting affordability",
      "Schengen membership to drive demand for commercial properties",
      "Secondary cities like Timișoara and Iași to offer better value propositions"
    ]
  }
};

const MarketTrendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'economics' | 'regional' | 'forecast'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'increasing':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down':
      case 'declining':
      case 'decreasing':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable':
      case 'seasonal':
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'seller_favored':
        return 'text-orange-600 bg-orange-50';
      case 'buyer_favored':
        return 'text-green-600 bg-green-50';
      case 'balanced':
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

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

      {/* Header */}
      <div className="mb-12 text-center">
        <BarChart3 className="h-16 w-16 text-blue-900 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Romanian Real Estate Market Intelligence</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive analysis of Romania's real estate market trends, National Bank of Romania monetary policy, 
          and macroeconomic factors affecting property investments. Data sourced from European Commission, 
          NBR, Romanian National Institute of Statistics, and leading real estate research firms.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { key: 'overview', label: 'Market Overview', icon: Activity },
            { key: 'economics', label: 'Economic Indicators', icon: Globe },
            { key: 'regional', label: 'Regional Analysis', icon: Map },
            { key: 'forecast', label: 'Market Forecast', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'overview' | 'economics' | 'regional' | 'forecast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === key
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Market Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Dashboard */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Euro className="h-8 w-8 text-blue-900" />
                <span className="text-xs text-gray-500">NBR Rate</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Policy Rate</h3>
              <p className="text-3xl font-bold text-blue-900">{romanianMacroeconomicData.nationalBankOfRomania.currentRate}%</p>
              <p className="text-sm text-gray-600 mt-2">Expected cuts: {romanianMacroeconomicData.nationalBankOfRomania.projectedCuts}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Home className="h-8 w-8 text-green-600" />
                <span className="text-xs text-gray-500">Mortgage Rates</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Variable Rate</h3>
              <p className="text-3xl font-bold text-green-600">{romanianMacroeconomicData.mortgageRates.currentVariable}%</p>
              <p className="text-sm text-gray-600 mt-2">Projected 2025: {romanianMacroeconomicData.mortgageRates.projected2025}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <span className="text-xs text-gray-500">Price Growth</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">2024 Growth</h3>
              <p className="text-3xl font-bold text-orange-600">+{romanianMacroeconomicData.housingMarket.nationalPriceGrowth2024}%</p>
              <p className="text-sm text-gray-600 mt-2">2025 Est: +{romanianMacroeconomicData.housingMarket.projectedGrowth2025}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Building className="h-8 w-8 text-purple-600" />
                <span className="text-xs text-gray-500">Average Price</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">National Avg</h3>
              <p className="text-3xl font-bold text-purple-600">€{romanianMacroeconomicData.housingMarket.averagePricePerSqm}</p>
              <p className="text-sm text-gray-600 mt-2">per sqm</p>
            </div>
          </section>

          {/* Housing Market Health */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-7 h-7 mr-3 text-blue-900" />
              Romanian Housing Market Health Indicators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900 mb-1">{romanianMacroeconomicData.housingMarket.transactionVolume.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Annual Transactions</p>
                <p className="text-xs text-gray-500 mt-1">2024 total</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600 mb-1">{romanianMacroeconomicData.housingMarket.inventoryChange}%</p>
                <p className="text-sm text-gray-600">Inventory Change</p>
                <p className="text-xs text-gray-500 mt-1">Supply constraints</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600 mb-1">€{romanianMacroeconomicData.housingMarket.bucharestPricePerSqm}</p>
                <p className="text-sm text-gray-600">Bucharest Avg Price</p>
                <p className="text-xs text-gray-500 mt-1">per sqm</p>
              </div>
            </div>
          </section>

          {/* Key Market Insights */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <ChartBar className="w-7 h-7 mr-3 text-blue-900" />
              Key Romanian Market Insights
            </h2>
            <div className="space-y-3">
              {romanianMacroeconomicData.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-900 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Economic Indicators Tab */}
      {activeTab === 'economics' && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="w-7 h-7 mr-3 text-blue-900" />
              National Bank of Romania & Monetary Policy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Policy Stance</h3>
                  <p className="text-gray-600 mb-2">
                    The National Bank of Romania has maintained the policy rate at {romanianMacroeconomicData.nationalBankOfRomania.currentRate}% 
                    for six consecutive meetings amid political uncertainty and inflation concerns.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Next Review:</strong> {romanianMacroeconomicData.nationalBankOfRomania.nextReview}
                      <br />
                      <strong>Expected Cuts:</strong> Up to {romanianMacroeconomicData.nationalBankOfRomania.projectedCuts}% by end-2025
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mortgage Rate Impact</h3>
                  <p className="text-gray-600 mb-2">
                    Romanian mortgage rates remain elevated with variable rates at {romanianMacroeconomicData.mortgageRates.currentVariable}% 
                    and fixed rates at {romanianMacroeconomicData.mortgageRates.currentFixed}%, affecting affordability.
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Variable Rate:</strong> {romanianMacroeconomicData.mortgageRates.currentVariable}%
                      <br />
                      <strong>Fixed Rate:</strong> {romanianMacroeconomicData.mortgageRates.currentFixed}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Romanian Economic Fundamentals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{romanianMacroeconomicData.economicIndicators.gdpGrowth2025}%</p>
                <p className="text-sm text-gray-600">GDP Growth (2025F)</p>
                <p className="text-xs text-gray-500">2026F: {romanianMacroeconomicData.economicIndicators.gdpGrowth2026}%</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{romanianMacroeconomicData.economicIndicators.unemployment2025}%</p>
                <p className="text-sm text-gray-600">Unemployment Rate</p>
                <p className="text-xs text-gray-500">2025 projection</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{romanianMacroeconomicData.economicIndicators.inflation2025}%</p>
                <p className="text-sm text-gray-600">Inflation (2025F)</p>
                <p className="text-xs text-gray-500">2026F: {romanianMacroeconomicData.economicIndicators.inflation2026}%</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Euro className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{romanianMacroeconomicData.economicIndicators.budgetDeficit}%</p>
                <p className="text-sm text-gray-600">Budget Deficit</p>
                <p className="text-xs text-gray-500">% of GDP (2024)</p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">EU Integration & Policy Impact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Schengen Membership:</strong> Full accession expected to boost commercial real estate demand and logistics investments
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>EU Funding:</strong> Infrastructure investments supporting residential construction and regional development
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>First-Time Buyer Programs:</strong> Government initiatives improving housing accessibility for young families
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Regional Analysis Tab */}
      {activeTab === 'regional' && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Map className="w-7 h-7 mr-3 text-blue-900" />
              Regional Market Performance Across Romania
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {romanianMacroeconomicData.regionalData.map((region) => (
                <div key={region.region} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{region.region}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(region.marketCondition)}`}>
                      {region.marketCondition.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{region.description}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price Growth</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon('up')}
                        <span className="font-semibold text-green-600">+{region.priceGrowth}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-semibold text-gray-900">€{region.averagePrice}/sqm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Inventory Trend</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(region.inventoryTrend)}
                        <span className="font-medium text-gray-700 capitalize">{region.inventoryTrend}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Market Dynamics by Property Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
                <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Apartments</h3>
                <p className="text-3xl font-bold text-green-600 mb-2">+13%</p>
                <p className="text-sm text-gray-600 mb-2">2024 price growth</p>
                <p className="text-xs text-gray-500">Strongest in Bucharest and Cluj</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Houses</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">+8%</p>
                <p className="text-sm text-gray-600 mb-2">2024 price growth</p>
                <p className="text-xs text-gray-500">Suburban demand rising</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
                <Activity className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Commercial</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">€750M</p>
                <p className="text-sm text-gray-600 mb-2">2024 investments</p>
                <p className="text-xs text-gray-500">+58% year-over-year</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Market Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="w-7 h-7 mr-3 text-blue-900" />
              Romanian Market Forecasts & Projections
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-orange-500 pl-4">
                  {romanianForecastData.shortTerm.period}
                </h3>
                <div className="space-y-3">
                  {romanianForecastData.shortTerm.predictions.map((prediction, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{prediction}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-500 pl-4">
                  {romanianForecastData.longTerm.period}
                </h3>
                <div className="space-y-3">
                  {romanianForecastData.longTerm.predictions.map((prediction, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{prediction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Expert Consensus: Romanian Market 2025</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
                <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Prices</h3>
                <p className="text-3xl font-bold text-green-600 mb-2">+3% to +7%</p>
                <p className="text-sm text-gray-600">European Commission Forecast</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                <Euro className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mortgage Rates</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">7.5%</p>
                <p className="text-sm text-gray-600">2025 Average Projection</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
                <Activity className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Condition</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">Seller-Favored</p>
                <p className="text-sm text-gray-600">Limited supply persists</p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Factors to Monitor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Upside Risks:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Political instability affecting investor confidence</li>
                  <li>• High budget deficit (9.3% of GDP)</li>
                  <li>• Persistent inflation above EU average</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Growth Opportunities:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Schengen membership driving demand</li>
                  <li>• EU infrastructure funding</li>
                  <li>• First-time buyer support programs</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Data Sources */}
      <section className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources & Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">European Commission</h4>
            <p>Economic forecasts, GDP growth, inflation projections</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">National Bank of Romania</h4>
            <p>Monetary policy, interest rates, financial stability</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Romanian National Institute</h4>
            <p>Housing statistics, construction data, price indices</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Industry Reports</h4>
            <p>Colliers, CBRE, Knight Frank, local research</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg flex items-start">
        <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold mb-1">Important Disclaimer</h3>
          <p className="text-sm">
            This analysis is based on current Romanian market data and research from European institutions and 
            leading financial organizations. Economic conditions are subject to rapid change, particularly given 
            Romania's political and fiscal uncertainties. All data is provided for informational purposes only 
            and should not be considered as financial or investment advice. Consult with qualified professionals 
            before making real estate or investment decisions in Romania.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsPage; 
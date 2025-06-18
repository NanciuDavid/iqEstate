/**
 * HomePage Component for EstateIQ
 * 
 * This is the main landing page that showcases the key features of EstateIQ:
 * - Hero section with main value proposition
 * - Interactive search functionality
 * - Feature highlights (AI prediction, map search, amenity analysis)
 * - Featured properties showcase
 * - How it works explanation
 * - Customer testimonials
 * - Call-to-action sections
 * 
 * The page is designed to convert visitors into users by highlighting
 * the unique AI-powered property valuation capabilities.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, LineChart, ArrowRight } from 'lucide-react';

// Import custom components for different sections
import HeroSearch from '../components/home/HeroSearch';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';
import TestimonialSection from '../components/home/TestimonialSections';

const HomePage = () => {
  // Scroll to top when component mounts (useful for navigation)
  useEffect(() => window.scrollTo(0, 0), []);
  
  return (
    <div className="">
      {/* === HERO SECTION === */}
      {/* Main landing section with value proposition and primary CTAs */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100">
        {/* Background pattern overlay for visual appeal */}
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side: Main headline and CTAs */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Find Your Perfect Home with AI-Powered Price Predictions
              </h1>
              <p className="text-xl mb-8 text-slate-300">
                Discover properties with confidence using our advanced machine learning technology that predicts fair market values and analyzes location benefits.
              </p>
              
              {/* Primary action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/price-prediction" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
                >
                  <LineChart className="mr-2 h-5 w-5" />
                  Predict Prices
                </Link>
                <Link 
                  to="/properties" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Properties
                </Link>
              </div>
            </div>
            
            {/* Right side: Hero image with prediction overlay (desktop only) */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative background circles */}
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-amber-500 rounded-full opacity-10"></div>
                <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-slate-600 rounded-full opacity-10"></div>
                
                {/* Main hero image */}
                <img 
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Modern apartment building" 
                  className="w-full h-auto rounded-lg shadow-2xl relative z-10"
                />
                
                {/* Overlay showing AI prediction example */}
                <div className="absolute top-4 left-4 p-4 bg-white rounded-lg shadow-lg">
                  <div className="flex items-center text-slate-800">
                    <LineChart className="h-5 w-5 mr-2 text-amber-600" />
                    <span className="font-semibold">Predicted: $425,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SEARCH SECTION === */}
      {/* Interactive search component positioned to overlap hero section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
          {/* HeroSearch component provides property search functionality */}
          <HeroSearch />
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      {/* Showcase the three main features that differentiate EstateIQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Discover Our Unique Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Using advanced machine learning to revolutionize how you search for and evaluate properties.
            </p>
          </div>
          
          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature data array with icons, titles, and descriptions */}
            {[
              {
                icon: <LineChart className="h-10 w-10 text-amber-600" />,
                title: "AI Price Prediction",
                description: "Get accurate property valuations based on our advanced machine learning algorithms trained on extensive market data."
              },
              {
                icon: <MapPin className="h-10 w-10 text-amber-600" />,
                title: "Interactive Map Search",
                description: "Draw on a map to define your ideal area and instantly see available properties and their key details."
              },
              {
                icon: <Search className="h-10 w-10 text-amber-600" />,
                title: "Amenity Analysis",
                description: "Understand how nearby facilities like gyms, schools, and shopping malls affect property values in real-time."
              }
            ].map((feature, index) => (
              /* Individual feature card */
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Feature icon with background */}
                <div className="bg-amber-100 p-3 rounded-full w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Featured Properties</h2>
              <p className="text-xl text-slate-600">
                Discover our handpicked selection of premium properties
              </p>
            </div>
            <Link 
              to="/properties" 
              className="hidden md:flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              View all properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <FeaturedProperties />
          
          <div className="mt-10 text-center md:hidden">
            <Link 
              to="/properties" 
              className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              View all properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How Our Price Prediction Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our machine learning model considers multiple factors to provide the most accurate property valuations.
            </p>
          </div>
          
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <TestimonialSection />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-slate-300">
            Start your journey today with our AI-powered price prediction and property search tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/price-prediction" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
            >
              <LineChart className="mr-2 h-5 w-5" />
              Get Price Prediction
            </Link>
            <Link 
              to="/properties" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-slate-600 text-slate-100 font-medium hover:bg-slate-500 transition-colors"
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
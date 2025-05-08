import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Search,
    LineChart,
    Map,
    User,
    Menu,
    X,
    HousePlus,
} from "lucide-react";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation(); // Use the useLocation hook to get the current location

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10); // Set isScrolled to true if the user has scrolled more than 10 pixels
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]); // Close the mobile menu when the route changes

    const navLinks = [
        { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
        {
            name: "New Listings",
            path: "/new-listings",
            icon: <Search className="w-5 h-5" />,
        },
        {
            name: "Price Prediction",
            path: "/price-prediciton",
            icon: <LineChart className="w-5 h-5" />,
        },
        {
            name: "Map Search",
            path: "/map-search",
            icon: <Map className="w-5 h-5" />,
        },
    ];

    const isActive = (path : string) => {
        return location.pathname === path;
    }

    return (
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-900" />
              <span className="text-2xl font-bold text-blue-900">EstateIQ</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-blue-900 font-semibold"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-blue-900 font-medium hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center" // if md screen size or smaller screens, show the menu button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-blue-900" />
              ) : (
                <Menu className="h-6 w-6 text-blue-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="flex flex-col pt-3">
              <Link
                to="/login"
                className="w-full px-3 py-3 text-center rounded-md text-blue-900 font-medium hover:bg-blue-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full mt-2 px-3 py-3 text-center rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
      </header>
    );
};

export default Header;

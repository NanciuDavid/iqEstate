import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Search,
    LineChart,
    Map,
    Menu,
    X,
    Lightbulb,
    User as UserIcon,
    LogOut,
    TrendingUp
} from "lucide-react";

// Assume an auth state, true for logged in, false for logged out
// In a real app, this would come from context or a store
const MOCK_IS_AUTHENTICATED = true;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate(); // For logout redirection

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        // TODO: Implement actual logout logic with auth service
        console.log("User logged out via header");
        // MOCK_IS_AUTHENTICATED = false; // This won't work for re-render, needs state management
        navigate('/'); // Redirect to home after logout
    };

    const navLinks = [
        { name: "About Us", path: "/about-us", icon: <Lightbulb className="w-5 h-5" /> },
        { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
        {
            name: "Properties",
            path: "/properties",
            icon: <Search className="w-5 h-5" />,
        },
        {
            name: "Price Prediction",
            path: "/price-prediction",
            icon: <LineChart className="w-5 h-5" />,
        },
        {
            name: "Market Trends",
            path: "/market-trends",
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            name: "Map Search",
            path: "/map-search",
            icon: <Map className="w-5 h-5" />,
        },
        {
            name: "Create Listing",
            path: "/create-listing",
            icon: <Search className="w-5 h-5" />,
            className: "nav-link-create-listing-button"
        },
    ];

    const isActive = (path : string) => location.pathname === path;

    return (
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-slate-900"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <Home className={`h-7 w-7 sm:h-8 sm:w-8 ${isScrolled ? 'text-slate-800' : 'text-amber-400'}`} />
              <span className={`text-xl sm:text-2xl font-bold ${isScrolled ? 'text-slate-800' : 'text-slate-100'}`}>EstateIQ</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-grow ml-6 ">
              <div className="flex items-center space-x-2 lg:space-x-6 justify-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm transition-colors ${
                      isActive(link.path)
                        ? `${isScrolled ? 'text-amber-600' : 'text-amber-400'} font-semibold`
                        : `${isScrolled ? 'text-slate-600' : 'text-slate-300'} hover:${isScrolled ? 'text-amber-500' : 'text-amber-300'}`
                    } ${link.className || ''}`}
                  >
                    {link.icon && React.cloneElement(link.icon, {
                      className: `w-5 h-5 ${isActive(link.path) ? (isScrolled ? 'text-amber-600' : 'text-amber-400') : (isScrolled ? 'text-slate-500' : 'text-slate-400')}`
                    })}
                    <span className="hidden lg:inline">{link.name}</span>
                    <span className="lg:hidden">{link.name.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </nav>

            <div className="flex items-center space-x-2 lg:space-x-4 ml-4">
                {MOCK_IS_AUTHENTICATED ? (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${
                        isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <UserIcon className={`w-5 h-5 mr-1 lg:mr-2 ${isScrolled ? 'text-slate-600' : 'text-slate-300'}`} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${
                        isScrolled ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-red-700 text-red-100 hover:bg-red-600'
                      }`}
                    >
                      <LogOut className="w-5 h-5 mr-1 lg:mr-2" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${
                        isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${
                        isScrolled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-slate-700' : 'text-slate-100'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-slate-700' : 'text-slate-100'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-amber-400'
                } ${link.className || ''}`}
              >
                {link.icon && React.cloneElement(link.icon, { className: "w-5 h-5" })}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="border-t border-slate-700 pt-3 mt-3">
              {MOCK_IS_AUTHENTICATED ? (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md font-medium transition-colors ${
                        isActive("/profile")
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-amber-400'
                      }`}
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-3 mt-1 rounded-md font-medium text-red-300 hover:bg-red-700 hover:text-red-100 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                  </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full block px-3 py-3 text-center rounded-md font-medium text-slate-200 hover:bg-slate-700 hover:text-amber-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full block mt-2 px-3 py-3 text-center rounded-md font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </header>
    );
};

export default Header;

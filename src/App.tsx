import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutUsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PricePredictionPage from './pages/PricePredictionPage';
import UserProfilePage from './pages/UserProfilePage';
import FAQPage from './pages/FAQPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import MarketTrendsPage from './pages/MarketTrendsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MapSearchPage from './pages/MapSearchPage';
import CreateListingPage from './pages/CreateListingPage';
import { QueryProvider } from './providers/QueryProvider';
import { useAuth } from './hooks/useAuthQuery';
import DebugAuthPage from './pages/DebugAuthPage';
import './styles/map.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading EstateIQ...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes - accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/price-prediction" element={<PricePredictionPage />} />
          <Route path="/market-trends" element={<MarketTrendsPage />} />
          <Route path="/map-search" element={<MapSearchPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          
          {/* Debug Route - for development only */}
          <Route path="/debug-auth" element={<DebugAuthPage />} />
          
          {/* Authentication Routes - redirect if already logged in */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Private Routes - require authentication */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}

export default App;



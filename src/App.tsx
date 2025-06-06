import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyCard } from './components/properties/PropertyCard';
import Layout from './components/layout/Layout';
import { mockProperties } from './data/mockdata';
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
import './styles/map.css';

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Moved for debugging */}
          <Route path="/create-listing" element={<CreateListingPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute isAuthenticated={true}/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/price-prediction" element={<PricePredictionPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/market-trends" element={<MarketTrendsPage />} />
            <Route path="/new-listings" element={<PropertyCard property={mockProperties[0]} />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            {/* <Route path="/create-listing" element={<CreateListingPage />} /> */}{/* Commented out original position */}
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyCard from './components/properties/PropertyCard';
import Layout from './components/layout/Layout';
import { mockProperties } from './data/mockdata';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutUsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes */}
          <Route element={<PrivateRoute isAuthenticated={true}/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/new-listings" element={<PropertyCard property={mockProperties[0]} />} />
            <Route path='/price-prediciton' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header' 
import PropertyCard from './components/properties/PropertyCard';
import Layout from './components/layout/Layout';
import {mockProperties} from './data/mockdata';
import HomePage from './pages/HomePage';
import HeroSearch from './components/home/HeroSearch';

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App;

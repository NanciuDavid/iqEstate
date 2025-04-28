import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Mail,
  GithubIcon,
  Instagram,
  X,
  Facebook,
  Linkedin,
  Github,
  InstagramIcon,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Home className="h-7 w-7"></Home>
              <span className="text-2xl font-bold">EstateIQ</span>
            </div>
          </div>
          <p className="text-blue-100 mb-6">
            Revolutioning real estate with{" "}
            <strong>Machine-Learning-powered price predictions</strong> and
            interactive property discovery.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/david-nanciu-alexandru-08884b203/"
              className="text-blue-100 hover:text-blue-250 transition-colors"
              target="_blank"
            >
              <Linkedin className="h-6 w-6"></Linkedin>
            </a>
            <a
              href="mailto:nanciudavid@outlook.com"
              className="text-blue-100 hover:text-blue-250 transition-colors"
              target="_blank"
            >
              <Mail className="h-6 w-6"></Mail>
            </a>
            <a
              href="https://github.com/NanciuDavid"
              className="text-blue-100 hover:text-blue-250 transition-colors"
              target="_blank"
            >
              <Github className="h-6 w-6"></Github>
            </a>
            <a
              href="https://www.instagram.com/davidnanciu/"
              className="text-blue-100 hover:text-blue-250 transition-colors"
              target="_blank"
            >
              <InstagramIcon></InstagramIcon>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Home",
                "New listings",
                "Price Prediction",
                "Map Search",
                "About us",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className="text-blue-100 hover:text-blue-750 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                "Property Valuation",
                "Market Analysis",
                "Investment Advisory",
                "Neighborhood Insights",
                "Property Alerts",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 text-blue-100" />
                <span className="text-blue-100">contact@estateiq.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 text-blue-100" />
                <span className="text-blue-100">+1 (555) 123-4567</span>
              </li>
              <li className="text-blue-100 mt-6">
                0550918 Bucharest
                <br />
                Calea Rahovei 338
                <br />
                Romania
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">
              &copy; {currentYear} EstateIQ. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-blue-100 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-blue-100 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-blue-100 text-sm hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

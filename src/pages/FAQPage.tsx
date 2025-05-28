import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, MessageSquare, Shield } from 'lucide-react';

const faqData = [
  {
    question: "How accurate is the AI price prediction?",
    answer: "Our AI model is trained on a vast dataset of property listings and market trends. While it provides a strong estimate, we always recommend consulting with a real estate professional for a definitive valuation, especially for financial decisions.",
  },
  {
    question: "What factors influence the property price prediction?",
    answer: "The prediction considers a multitude of factors including property characteristics (size, bedrooms, age, condition), location (neighborhood, proximity to amenities, school ratings), recent sales of comparable properties, and current macroeconomic indicators.",
  },
  {
    question: "Can I list my property on EstateIQ?",
    answer: "Currently, EstateIQ focuses on providing property valuation and insights based on aggregated data. We do not offer direct listing services for individual sellers at this moment. This may be a feature we explore in the future.",
  },
  {
    question: "How is my personal data handled?",
    answer: "We take your privacy seriously. Please refer to our Privacy Policy page for detailed information on how we collect, use, and protect your personal data.",
  },
  {
    question: "How often is the market data updated?",
    answer: "Our market data and AI models are updated regularly to ensure the most current and accurate insights. The exact frequency can vary but we aim for daily to weekly updates for active market data.",
  },
  {
    question: "What if I find an error in a property's details?",
    answer: "While we strive for accuracy, data can sometimes have discrepancies. If you find an error, please feel free to contact us through our Contact Us page with the details, and we will investigate.",
  },
];

const FAQPage: React.FC = () => {
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
        <span className="text-gray-800 font-medium">FAQ</span>
      </div>

      <div className="mb-12 text-center">
        <HelpCircle className="h-16 w-16 text-blue-900 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about EstateIQ, our AI technology, and services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            If you can't find the answer you're looking for, please don't hesitate to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
                to="/contact-us" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
            >
                <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
            </Link>
            <Link 
                to="/privacy-policy" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white text-blue-900 font-medium hover:bg-blue-50 border border-blue-200 transition-colors"
            >
                <Shield className="mr-2 h-5 w-5" /> Read Our Privacy Policy
            </Link>
          </div>
        </div>
    </div>
  );
};

export default FAQPage; 
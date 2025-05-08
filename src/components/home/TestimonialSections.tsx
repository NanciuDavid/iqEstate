import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-time Home Buyer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "The price prediction feature helped me negotiate confidently and saved me thousands of dollars. I knew exactly what the property was worth before making an offer.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Real Estate Investor",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "As an investor, understanding how amenities affect property values is crucial. This platform gives me insights I can't find elsewhere.",
    rating: 4
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Property Seller",
    image: "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "I was able to price my home perfectly thanks to the AI predictions. Sold within a week for more than I expected!",
    rating: 5
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real success stories from people who found their perfect properties using our platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            
            <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
            
            <div className="flex items-center">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
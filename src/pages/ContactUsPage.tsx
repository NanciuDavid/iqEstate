import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual email sending or form submission to backend
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after a delay or on successful submission
    setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        // setIsSubmitted(false); // Optionally hide message after a while
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Contact Us</span>
      </div>

      <div className="mb-12 text-center">
        <Mail className="h-16 w-16 text-blue-900 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our services, AI technology, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
          {isSubmitted ? (
            <div className="p-4 text-center bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">Thank you for your message!</p>
              <p className="text-sm">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={5} required className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center px-6 py-3 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
                >
                  <Send className="mr-2 h-5 w-5" /> Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-blue-900 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600">Our support team will get back to you within 24 hours.</p>
                  <a href="mailto:contact@estateiq.com" className="text-blue-800 hover:underline">contact@estateiq.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-blue-900 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                  <p className="text-gray-600">Mon-Fri from 9am to 5pm.</p>
                  <a href="tel:+15551234567" className="text-blue-800 hover:underline">+1 (555) 123-4567</a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-blue-900 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Our Office</h3>
                  <p className="text-gray-600">
                    EstateIQ Headquarters<br/>
                    123 AI Avenue, Suite 404<br/>
                    Tech City, TC 54321, USA
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* You can add a map here if needed */}
          {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Find Us On Map</h2>
            <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Map integration placeholder</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage; 
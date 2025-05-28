import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Send } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitted(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // TODO: Implement actual API call to backend to send reset link
    console.log('Password reset requested for:', email);
    setIsSubmitted(true); 
    // In a real app, you might want to clear the email field or disable the form after successful submission.
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/login" className="hover:text-blue-900 transition-colors">
          Login
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Forgot Password</span>
      </div>

      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-12">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-blue-900 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Your Password?</h1>
          <p className="text-gray-600">
            No worries! Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 text-center bg-green-50 text-green-700 rounded-md">
            <p className="font-medium">Password Reset Link Sent!</p>
            <p className="text-sm">If an account exists for {email}, you will receive an email with instructions on how to reset your password shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-10 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center px-6 py-3 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
              >
                <Send className="mr-2 h-5 w-5" /> Send Reset Link
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-900 hover:text-blue-800">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 
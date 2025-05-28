import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Key, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Hypothetical token from URL
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // TODO: In a real app, validate the token with the backend here.
    // If token is invalid or expired, show an error or redirect.
    if (!token || token === 'invalid-token') { // Simple mock validation
        setMessage({ type: 'error', text: 'Invalid or expired password reset link.' });
        setIsValidToken(false);
    }
  }, [token]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [isValidToken, setIsValidToken] = useState(true); // Assume valid initially, check in useEffect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in both password fields.'});
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.'});
      return;
    }
    if (password.length < 8) {
        setMessage({ type: 'error', text: 'Password must be at least 8 characters long.'});
        return;
    }

    // TODO: Implement actual API call to backend to reset password with the token
    console.log('Password reset for token:', token, 'New password:', password);
    setMessage({ type: 'success', text: 'Your password has been successfully reset! You can now log in with your new password.'});
    // Disable form or redirect after success
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Reset Password</span>
      </div>

      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-12">
        <div className="text-center mb-8">
          <Key className="h-12 w-12 text-blue-900 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          {!isValidToken && message && message.type === 'error' && (
            <p className="text-red-600 mt-4 bg-red-50 p-3 rounded-md">{message.text}</p>
          )}
          {isValidToken && <p className="text-gray-600">Enter your new password below.</p>}
        </div>

        {isValidToken && (
            <> 
            {message && message.type === 'success' && (
                <div className="p-4 mb-6 text-center bg-green-50 text-green-700 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <p className="font-medium">{message.text}</p>
                </div>
            )}
            {message && message.type === 'error' && (
                <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <p>{message.text}</p>
                </div>
            )}

            {!message || message.type !== 'success' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative mt-1">
                        <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full pr-10 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            <Eye className="h-5 w-5" />
                        </div>
                    </div>
                    </div>
                <div>
                    <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative mt-1">
                        <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className="w-full pr-10 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm new password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            <Eye className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div>
                    <button 
                    type="submit" 
                    className="w-full flex items-center justify-center px-6 py-3 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
                    >
                    <Key className="mr-2 h-5 w-5" /> Reset Password
                    </button>
                </div>
                </form>
            ) : null}
            </>
        )}
        
        {message && message.type === 'success' && (
             <div className="mt-6 text-center">
                <Link to="/login" className="text-sm font-medium text-blue-900 hover:text-blue-800">
                    Proceed to Login &rarr;
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 
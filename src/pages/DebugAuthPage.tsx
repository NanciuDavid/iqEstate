/**
 * Debug Authentication Page
 * 
 * This page helps debug authentication issues by showing detailed
 * token information and auth state changes in real-time.
 */

import React, { useState, useEffect } from 'react';
import { TokenManager } from '../services/api';
import { useAuth } from '../hooks/useAuthQuery';

interface DebugInfo {
  timestamp: string;
  refreshCount: number;
  hasToken: boolean;
  tokenLength: number;
  tokenPreview: string;
  tokenValid: boolean;
  tokenError: string | null;
  tokenPayload: Record<string, unknown> | null;
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  allCookies: string;
  userAgent: string;
  currentTime: number;
}

const DebugAuthPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({} as DebugInfo);
  const [refreshCount, setRefreshCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  const collectDebugInfo = () => {
    const token = TokenManager.getToken();
    let tokenPayload = null;
    let tokenValid = false;
    let tokenError = null;

    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          tokenPayload = JSON.parse(atob(parts[1]));
          tokenValid = TokenManager.isAuthenticated();
        }
      } catch (error) {
        tokenError = error instanceof Error ? error.message : String(error);
      }
    }

    const info = {
      timestamp: new Date().toISOString(),
      refreshCount,
      // Token info
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 50) + '...' : 'No token',
      tokenValid,
      tokenError,
      tokenPayload,
      // Auth state
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null,
      // Cookie info
      allCookies: document.cookie,
      // Browser info
      userAgent: navigator.userAgent,
      currentTime: Date.now(),
    };

    setDebugInfo(info);
    return info;
  };

  useEffect(() => {
    collectDebugInfo();
  }, [isAuthenticated, user, refreshCount]);

  useEffect(() => {
    // Listen for token changes
    const unsubscribe = TokenManager.addListener(() => {
      console.log('🔄 Debug: Token changed, collecting new debug info...');
      collectDebugInfo();
    });

    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    collectDebugInfo();
  };

  const handleClearToken = () => {
    TokenManager.removeToken();
    collectDebugInfo();
  };

  const handleTestAPI = async () => {
    try {
      const response = await fetch('/api/auth/debug', {
        headers: {
          'Authorization': `Bearer ${TokenManager.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('🔍 API Debug Response:', data);
      alert(`API Test: ${response.status} - ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('🔍 API Test Error:', error);
      alert(`API Test Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Authentication Debug Page
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Refresh Debug Info
            </button>
            
            <button
              onClick={handleClearToken}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑️ Clear Token
            </button>
            
            <button
              onClick={handleTestAPI}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🌐 Test API Endpoint
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              ♻️ Force Page Reload
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-3">Debug Information:</h2>
            <pre className="text-sm whitespace-pre-wrap break-all">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Login normally first</li>
              <li>Visit this page and note the debug info</li>
              <li>Refresh the page (F5) and see what changes</li>
              <li>Check browser console for detailed logs</li>
              <li>Test the API endpoint to verify backend communication</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuthPage; 
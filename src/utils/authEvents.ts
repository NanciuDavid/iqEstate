/**
 * Authentication Event System
 * 
 * Custom event emitter to ensure immediate authentication state updates
 * across all components without relying solely on React state batching.
 */

type AuthEventType = 'login' | 'logout' | 'register';

interface AuthEventData {
  type: AuthEventType;
  isAuthenticated: boolean;
  user?: { id: string; email: string; name: string } | null;
  timestamp: number;
}

class AuthEventEmitter {
  private listeners: ((data: AuthEventData) => void)[] = [];

  subscribe(callback: (data: AuthEventData) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(type: AuthEventType, isAuthenticated: boolean, user?: { id: string; email: string; name: string } | null): void {
    const data: AuthEventData = {
      type,
      isAuthenticated,
      user,
      timestamp: Date.now()
    };

    console.log(`🔔 AuthEvent: ${type}`, data);

    // Notify all listeners immediately
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in auth event listener:', error);
      }
    });
  }
}

export const authEvents = new AuthEventEmitter(); 
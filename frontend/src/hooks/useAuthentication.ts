import { useState } from 'react';
import { signIn, signUp, logOut } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useAuthentication = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await logOut();
      if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    error,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    logOut: handleLogOut,
  };
}; 
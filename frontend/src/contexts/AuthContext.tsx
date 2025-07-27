import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, logOut, signIn, signUp as firebaseSignUp } from '../lib/firebase';
import { UserResponse } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => { },
  isAuthenticated: false,
  login: async () => ({ user: null, error: null }),
  signUp: async () => ({ user: null, error: null }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   if (auth.currentUser) {
  //     apiClient.getUserById(auth.currentUser.uid).then((data) => {
  //       setUserInfo(data);
  //     });
  //   }
  // }, [auth.currentUser]);

  const logout = async () => {
    await logOut();
  };

  const login = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await firebaseSignUp(email, password);
  };

  const value = {
    user,
    loading,
    logout,
    login,
    signUp,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

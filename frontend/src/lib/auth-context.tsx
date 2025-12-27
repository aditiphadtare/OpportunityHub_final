import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string;
  username: string;
  location?: string;
  domains?: string[];
  resumeText?: string;
  wishlist?: string[];
}

interface ProfileUpdate {
  username?: string;
  email?: string;
  location?: string;
  domains?: string[];
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (location: string, domains: string[]) => Promise<void>;
  updateProfile: (data: ProfileUpdate) => void;
  setResumeText: (text: string) => void;
  toggleWishlist: (opportunityId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('opportunityhub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      const newUser: User = {
        uid: data.uid,
        email,
        username,
        wishlist: [],
      };

      setUser(newUser);
      localStorage.setItem("opportunityhub_user", JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error("Signup fetch failed:", err);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) return false;

      const data = await res.json();

      // ✅ FIX: use wishlist returned from backend login
      const wishlistIds = data.wishlist || [];

      const userData: User = {
        uid: data.uid,
        email: data.email,
        username: data.username,
        location: data.location || '',
        domains: data.domains || [],
        wishlist: wishlistIds,
        resumeText: localStorage.getItem(`resume_${data.uid}`) || ''
      };

      setUser(userData);
      localStorage.setItem("opportunityhub_user", JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error("Login fetch failed:", err);
      return false;
    }
  };

  const updatePreferences = async (location: string, domains: string[]) => {
    if (!user) return;

    await fetch(`${API_URL}/profile/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        location,
        domain: domains
      })
    });

    const updatedUser = { ...user, location, domains };
    setUser(updatedUser);
    localStorage.setItem("opportunityhub_user", JSON.stringify(updatedUser));
  };

  const setResumeText = (text: string) => {
    if (!user) return;
    const updatedUser = { ...user, resumeText: text };
    setUser(updatedUser);
    localStorage.setItem("opportunityhub_user", JSON.stringify(updatedUser));
    localStorage.setItem(`resume_${user.uid}`, text);
  };

  const toggleWishlist = async (opportunityId: string) => {
    if (!user) return;

    const isWishlisted = user.wishlist?.includes(opportunityId);
    const method = isWishlisted ? 'DELETE' : 'POST';
    const url = isWishlisted
      ? `${API_URL}/opportunities/wishlist/${user.uid}/${opportunityId}`
      : `${API_URL}/opportunities/wishlist`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: isWishlisted ? undefined : JSON.stringify({ userId: user.uid, opportunityId })
      });

      if (res.ok) {
        const newWishlist = isWishlisted
          ? (user.wishlist || []).filter(id => id !== opportunityId)
          : [...(user.wishlist || []), opportunityId];

        const updatedUser = { ...user, wishlist: newWishlist };
        setUser(updatedUser);
        localStorage.setItem("opportunityhub_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Toggle wishlist failed:", err);
    }
  };

  const updateProfile = (data: ProfileUpdate) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("opportunityhub_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("opportunityhub_user");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signup,
      login,
      logout,
      updatePreferences,
      updateProfile,
      setResumeText,
      toggleWishlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

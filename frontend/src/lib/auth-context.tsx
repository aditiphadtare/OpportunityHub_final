// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   location?: string;
//   domains?: string[];
//   onboardingCompleted?: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (email: string, username: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   updatePreferences: (location: string, domains: string[]) => void;
//   updateProfile: (data: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored user on mount
//     const storedUser = localStorage.getItem('opportunityhub_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Simulated login - in production, this would call an API
//     const storedUsers = JSON.parse(localStorage.getItem('opportunityhub_users') || '[]');
//     const foundUser = storedUsers.find((u: any) => u.email === email);

//     if (foundUser) {
//       setUser(foundUser);
//       localStorage.setItem('opportunityhub_user', JSON.stringify(foundUser));
//       return true;
//     }
//     return false;
//   };

//   const signup = async (email: string, username: string, password: string) => {
//     try {
//       const res = await fetch("http://localhost:8000/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, username, password }),
//       });

//       return res.ok;
//     } catch (err) {
//       console.error("Signup failed:", err);
//       return false;
//     }
//   };

//   // const signup = async (email: string, username: string, password: string): Promise<boolean> => {
//   //   // Simulated signup
//   //   const newUser: User = {
//   //     id: Date.now().toString(),
//   //     email,
//   //     username,
//   //   };

//   //   const storedUsers = JSON.parse(localStorage.getItem('opportunityhub_users') || '[]');
//   //   storedUsers.push(newUser);
//   //   localStorage.setItem('opportunityhub_users', JSON.stringify(storedUsers));

//   //   setUser(newUser);
//   //   localStorage.setItem('opportunityhub_user', JSON.stringify(newUser));
//   //   return true;
//   // };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('opportunityhub_user');
//   };

//   // const updatePreferences = (location: string, domains: string[]) => {
//   //   if (user) {
//   //     const updatedUser = { ...user, location, domains };
//   //     setUser(updatedUser);
//   //     localStorage.setItem('opportunityhub_user', JSON.stringify(updatedUser));

//   //     // Update in users list too
//   //     const storedUsers = JSON.parse(localStorage.getItem('opportunityhub_users') || '[]');
//   //     const index = storedUsers.findIndex((u: User) => u.id === user.id);
//   //     if (index !== -1) {
//   //       storedUsers[index] = updatedUser;
//   //       localStorage.setItem('opportunityhub_users', JSON.stringify(storedUsers));
//   //     }
//   //   }
//   // };
//   const updatePreferences = (location: string, domains: string[]) => {
//     if (user) {
//       const updatedUser = {
//         ...user,
//         location,
//         domains,
//         onboardingCompleted: true, // ✅ THIS IS THE KEY
//       };

//       setUser(updatedUser);
//       localStorage.setItem('opportunityhub_user', JSON.stringify(updatedUser));

//       const storedUsers = JSON.parse(
//         localStorage.getItem('opportunityhub_users') || '[]'
//       );

//       const updatedUsers = storedUsers.map((u: any) =>
//         u.id === user.id ? updatedUser : u
//       );

//       localStorage.setItem('opportunityhub_users', JSON.stringify(updatedUsers));
//     }
//   };


//   const updateProfile = (data: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...data };
//       setUser(updatedUser);
//       localStorage.setItem('opportunityhub_user', JSON.stringify(updatedUser));

//       const storedUsers = JSON.parse(localStorage.getItem('opportunityhub_users') || '[]');
//       const index = storedUsers.findIndex((u: User) => u.id === user.id);
//       if (index !== -1) {
//         storedUsers[index] = updatedUser;
//         localStorage.setItem('opportunityhub_users', JSON.stringify(storedUsers));
//       }
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated: !!user,
//       isLoading,
//       login,
//       signup,
//       logout,
//       updatePreferences,
//       updateProfile,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
  username: string;
  location?: string;
  domains?: string[];
  resumeText?: string;
  wishlist?: string[];
};

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
}

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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Signup error detail:", errorData.error || res.statusText);
        return false;
      }

      const data = await res.json();
      const newUser: User = {
        uid: data.uid,
        email,
        username
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Login error detail:", errorData.error || res.statusText);
        return false;
      }

      const data = await res.json();

      // Fetch wishlist after login
      const wishlistRes = await fetch(`${API_URL}/opportunities/wishlist/${data.uid}`);
      const wishlistData = await wishlistRes.json();
      const wishlistIds = (wishlistData.data || []).map((item: any) => item.id);

      const userData: User = {
        uid: data.uid,
        email: data.email,
        username: data.username,
        location: data.location || '',
        domains: data.domain || [],
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

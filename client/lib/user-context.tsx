import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole, getStoredRole, setStoredRole, clearStoredAuth } from "@/lib/auth";

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  userEmail: string;
  userImage?: string;
  userProfile: UserProfileData;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
  logout: () => void;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>("buyer");
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    bio: "Real estate enthusiast",
    profileImage: "",
  });

  useEffect(() => {
    const savedRole = getStoredRole();
    const savedProfile = localStorage.getItem("userProfile");
    
    if (savedRole) setUserRoleState(savedRole);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setStoredRole(role);
  };

  const updateUserProfile = (data: Partial<UserProfileData>) => {
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));
  };

  const logout = () => {
    clearStoredAuth();
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userSettings");
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        userName: userProfile.name,
        userEmail: userProfile.email,
        userImage: userProfile.profileImage,
        userProfile,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
}

export function useUser() {
  return useUserContext();
}

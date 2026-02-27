import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userRole: "buyer" | "seller";
  setUserRole: (role: "buyer" | "seller") => void;
  userName: string;
  userEmail: string;
  userImage?: string;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
}

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<"buyer" | "seller">("buyer");
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    bio: "Real estate enthusiast",
    profileImage: "",
  });

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as "buyer" | "seller";
    const savedProfile = localStorage.getItem("userProfile");
    
    if (savedRole) setUserRoleState(savedRole);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  const setUserRole = (role: "buyer" | "seller") => {
    setUserRoleState(role);
    localStorage.setItem("userRole", role);
  };

  const updateUserProfile = (data: Partial<UserProfileData>) => {
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));
  };

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        userName: userProfile.name,
        userEmail: userProfile.email,
        userImage: userProfile.profileImage,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

export type UserRole = "buyer" | "seller" | "admin";

const ROLE_KEY = "userRole";
const LEGACY_TYPE_KEY = "userType";

export const normalizeRole = (value: string | null | undefined): UserRole | null => {
  if (!value) return null;
  if (value === "admin") return "admin";
  if (value === "seller") return "seller";
  if (value === "buyer" || value === "user") return "buyer";
  return null;
};

export const getStoredRole = (): UserRole | null => {
  const modern = normalizeRole(localStorage.getItem(ROLE_KEY));
  if (modern) return modern;

  const legacy = normalizeRole(localStorage.getItem(LEGACY_TYPE_KEY));
  if (legacy) {
    localStorage.setItem(ROLE_KEY, legacy);
    return legacy;
  }

  return null;
};

export const setStoredRole = (role: UserRole) => {
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(LEGACY_TYPE_KEY, role === "buyer" ? "user" : role);
};

export const clearStoredAuth = () => {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(LEGACY_TYPE_KEY);
  localStorage.removeItem("userEmail");
};

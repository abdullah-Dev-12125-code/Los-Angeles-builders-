export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

/**
 * Store JWT tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem("access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
}

/**
 * Clear JWT tokens from localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * Refresh JWT token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = (await response.json()) as { access: string };
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    return null;
  }
}

export interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function fetchJson<T>(
  path: string,
  options?: FetchOptions
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options ?? {};
  const token = !skipAuth ? getToken() : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions.headers ?? {}),
  };

  let response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...fetchOptions,
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && !skipAuth && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...(fetchOptions.headers ?? {}),
      };
      response = await fetch(`${API_BASE}${path}`, {
        headers: retryHeaders,
        ...fetchOptions,
      });
    }
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    const errorMsg = message || `Request failed with ${response.status}`;
    const error = new Error(errorMsg);
    (error as any).status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export interface ApiProperty {
  id: number;
  name: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  price: number;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  status?: "available" | "rented" | "maintenance";
}

export async function fetchProperties(): Promise<ApiProperty[]> {
  const data = await fetchJson<any>("/api/properties/");
  if (Array.isArray(data)) {
    return data as ApiProperty[];
  }
  return (data?.results ?? []) as ApiProperty[];
}

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
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

/**
 * Opportunity Service
 * Frontend → Backend API ONLY
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ===========================
   TYPES
=========================== */

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: "hackathon" | "tech-event" | "college-fest" | "internship" | "job";
  location: string;
  deadline: string | Date;
  domains: string[];
  description: string;
  isRemote: boolean;
  link?: string;
  addedAt?: Date;
  matchPercentage?: number;
}

export interface OpportunityFilters {
  type?: string;
  location?: string;
  domains?: string[];
  resumeText?: string;
}

/* ===========================
   OPPORTUNITIES
=========================== */

export async function fetchOpportunities(filters?: OpportunityFilters) {
  const params = new URLSearchParams();

  if (filters?.type) params.append("type", filters.type);
  if (filters?.location) params.append("location", filters.location);
  if (filters?.resumeText) params.append("resumeText", filters.resumeText);
  if (filters?.domains?.length)
    params.append("domains", filters.domains.join(","));

  const res = await fetch(
    `${API_URL}/opportunities${params.toString() ? "?" + params : ""}`
  );

  if (!res.ok) throw new Error("Failed to fetch opportunities");
  const json = await res.json();
  return json.data || [];
}

export async function fetchOpportunityById(id: string) {
  const res = await fetch(`${API_URL}/opportunities/${id}`);
  if (!res.ok) throw new Error("Failed to fetch opportunity");
  const json = await res.json();
  return json.data;
}

/* ===========================
   WISHLIST (API ONLY)
=========================== */

export async function fetchWishlist(userId: string): Promise<Opportunity[]> {
  const res = await fetch(`${API_URL}/opportunities/wishlist/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  const json = await res.json();
  return json.data || [];
}

export async function addToWishlist(userId: string, opportunityId: string) {
  const res = await fetch(`${API_URL}/opportunities/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, opportunityId }),
  });

  if (!res.ok) throw new Error("Failed to add to wishlist");
}

export async function removeFromWishlist(
  userId: string,
  opportunityId: string
) {
  const res = await fetch(
    `${API_URL}/opportunities/wishlist/${userId}/${opportunityId}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to remove from wishlist");
}

/* ===========================
   DEADLINES
=========================== */

export async function fetchDeadlines(userId: string) {
  const res = await fetch(`${API_URL}/deadlines/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch deadlines");
  const json = await res.json();
  return json.data || [];
}

export async function fetchUrgentDeadlines(userId: string) {
  const res = await fetch(`${API_URL}/deadlines/${userId}/urgent`);
  if (!res.ok) throw new Error("Failed to fetch urgent deadlines");
  const json = await res.json();
  return json.data || [];
}

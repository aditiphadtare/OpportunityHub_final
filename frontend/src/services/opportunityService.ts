/**
 * Opportunity Service
 * Frontend service for opportunity-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Opportunity {
    id: string;
    title: string;
    organization: string;
    type: 'hackathon' | 'tech-event' | 'college-fest' | 'internship' | 'job';
    location: string;
    deadline: string | Date;
    domains: string[];
    description: string;
    stipend?: string;
    duration?: string;
    reward?: string;
    isRemote: boolean;
    link?: string;
    matchPercentage?: number;
}

export interface OpportunityFilters {
    type?: string;
    location?: string;
    domains?: string[];
    resumeText?: string;
}

/**
 * Fetch opportunities with optional filters
 */
export async function fetchOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
    try {
        const params = new URLSearchParams();

        if (filters?.type) params.append('type', filters.type);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.resumeText) params.append('resumeText', filters.resumeText);
        if (filters?.domains && filters.domains.length > 0) {
            params.append('domains', filters.domains.join(','));
        }

        const url = `${API_URL}/opportunities${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch opportunities');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
    }
}

/**
 * Get single opportunity by ID
 */
export async function fetchOpportunityById(id: string): Promise<Opportunity> {
    try {
        const response = await fetch(`${API_URL}/opportunities/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch opportunity');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching opportunity:', error);
        throw error;
    }
}

/**
 * Add opportunity to wishlist
 */
export async function addToWishlist(userId: string, opportunityId: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/opportunities/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, opportunityId }),
        });

        if (!response.ok) {
            throw new Error('Failed to add to wishlist');
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}

/**
 * Remove opportunity from wishlist
 */
export async function removeFromWishlist(userId: string, opportunityId: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/opportunities/wishlist/${userId}/${opportunityId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to remove from wishlist');
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}

/**
 * Get user's wishlist
 */
export async function fetchWishlist(userId: string): Promise<Opportunity[]> {
    try {
        const response = await fetch(`${API_URL}/opportunities/wishlist/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
}

/**
 * Get upcoming deadlines
 */
export async function fetchDeadlines(userId: string) {
    try {
        const response = await fetch(`${API_URL}/deadlines/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch deadlines');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching deadlines:', error);
        throw error;
    }
}

/**
 * Get urgent deadlines (within 7 days)
 */
export async function fetchUrgentDeadlines(userId: string) {
    try {
        const response = await fetch(`${API_URL}/deadlines/${userId}/urgent`);

        if (!response.ok) {
            throw new Error('Failed to fetch urgent deadlines');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching urgent deadlines:', error);
        throw error;
    }
}

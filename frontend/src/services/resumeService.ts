/**
 * Resume Service
 * Frontend service for resume analysis API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ResumeAnalysisResult {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: {
        skills: string[];
        projects: string[];
        improvements: string[];
    };
    strengths: string[];
    weaknesses: string[];
    recommendations?: any[];
}

/**
 * Upload and parse resume file
 */
export async function uploadResume(file: File): Promise<{ text: string; filename: string }> {
    try {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch(`${API_URL}/resume/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload resume');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error uploading resume:', error);
        throw error;
    }
}

/**
 * Analyze resume against job description
 */
export async function analyzeResume(
    resumeText: string,
    jobDescription: string,
    userId?: string
): Promise<ResumeAnalysisResult> {
    try {
        const response = await fetch(`${API_URL}/resume/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                resumeText,
                jobDescription,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze resume');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw error;
    }
}

/**
 * Get resume analysis history
 */
export async function fetchAnalysisHistory(userId: string): Promise<any[]> {
    try {
        const response = await fetch(`${API_URL}/resume/history/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch analysis history');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        throw error;
    }
}

/**
 * Refine resume content using AI
 */
export async function refineResume(resumeText: string, additionalInfo: string): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/resume/refine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resumeText,
                additionalInfo,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refine resume');
        }

        const data = await response.json();
        return data.data.text;
    } catch (error) {
        console.error('Error refining resume:', error);
        throw error;
    }
}

/**
 * Get opportunity recommendations or general suggestions
 */
export async function fetchRecommendations(
    params: { matchedSkills?: string[]; missingSkills?: string[]; type?: string; domains?: string[] }
): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/resume/suggestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
}

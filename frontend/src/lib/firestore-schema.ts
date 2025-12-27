/**
 * Firestore Database Schema Documentation
 * 
 * This file documents the structure of collections in Firebase Firestore
 */

export interface User {
    uid: string;
    email: string;
    displayName: string;
    location: string;
    domain: string[]; // User's preferred domains
    createdAt: Date;
    onboardingCompleted: boolean;
}

export interface Opportunity {
    id: string;
    title: string;
    organization: string;
    type: 'hackathon' | 'tech-event' | 'college-fest' | 'internship' | 'job';
    location: string;
    deadline: Date;
    domains: string[];
    description: string;
    stipend?: string;
    duration?: string;
    reward?: string;
    isRemote: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export interface WishlistItem {
    opportunityId: string;
    addedAt: Date;
    deadline: Date;
}

export interface Wishlist {
    userId: string;
    opportunities: { [opportunityId: string]: WishlistItem };
}

export interface ResumeAnalysis {
    id: string;
    userId: string;
    resumeText: string;
    resumeUrl?: string;
    jobDescription: string;
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: {
        skills: string[];
        projects: string[];
        opportunities: string[];
    };
    analyzedAt: Date;
}

/**
 * Firestore Collections Structure:
 * 
 * /users/{userId}
 *   - User profile and preferences
 * 
 * /opportunities/{opportunityId}
 *   - All available opportunities
 * 
 * /wishlists/{userId}
 *   - User's wishlisted opportunities
 * 
 * /resumeAnalyses/{userId}/analyses/{analysisId}
 *   - User's resume analysis history
 */

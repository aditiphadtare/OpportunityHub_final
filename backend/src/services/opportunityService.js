const { admin, db } = require('../config/firebase');

/**
 * Opportunity Service
 * Handles all opportunity-related operations with Firestore
 */

/**
 * Fetch opportunities from Firestore with optional filtering
 * @param {Object} filters - Filter options (domains, location, type, resumeText)
 * @returns {Promise<Array>} Array of opportunities
 */
async function getOpportunities(filters = {}) {
    try {
        let query = db.collection('opportunities');

        // Apply basic filters for Firestore
        if (filters.type && filters.type !== 'all' && filters.type !== '') {
            query = query.where('type', '==', filters.type);
        }

        // Fetch opportunities
        const snapshot = await query.get();

        let opportunities = snapshot.docs.map(doc => {
            const data = doc.data();
            let matchPercentage = 60; // Base match for showing up

            // 1. Location match (10%)
            if (filters.location && data.location) {
                if (data.location === filters.location || data.isRemote || filters.location === 'Remote') {
                    matchPercentage += 10;
                }
            }

            // 2. Domain match (30%)
            if (filters.domains && filters.domains.length > 0 && data.domains) {
                const matchedDomains = data.domains.filter(d =>
                    filters.domains.some(fd => fd.toLowerCase() === d.toLowerCase())
                );
                const domainScore = (matchedDomains.length / Math.max(data.domains.length, 1)) * 30;
                matchPercentage += Math.round(domainScore);
            }

            // 3. Resume text match (additional boost if resume is provided)
            if (filters.resumeText) {
                const resumeLower = filters.resumeText.toLowerCase();
                const titleLower = data.title.toLowerCase();
                const descLower = data.description.toLowerCase();
                const domainsLower = (data.domains || []).map(d => d.toLowerCase());

                // Check title/desc for keywords
                const words = [...titleLower.split(/\s+/), ...descLower.split(/\s+/)];
                const resumeWords = new Set(resumeLower.split(/\s+/));

                let keywordMatches = 0;
                const importantKeywords = [...domainsLower, 'intern', 'developer', 'engineer', 'analyst', 'designer'];

                importantKeywords.forEach(kw => {
                    if (resumeLower.includes(kw)) keywordMatches++;
                });

                const resumeBoost = Math.min((keywordMatches / Math.max(importantKeywords.length, 1)) * 20, 20);
                matchPercentage += Math.round(resumeBoost);
            }

            return {
                id: doc.id,
                ...data,
                matchPercentage: Math.min(matchPercentage, 100),
                deadline: data.deadline?.toDate?.() || data.deadline,
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
            };
        });

        // Sorting: higher match percentage first
        opportunities.sort((a, b) => b.matchPercentage - a.matchPercentage);

        return opportunities;
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
    }
}

/**
 * Get a single opportunity by ID
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<Object>} Opportunity data
 */
async function getOpportunityById(opportunityId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const doc = await db.collection('opportunities').doc(opportunityId).get();

        if (!doc.exists) {
            throw new Error('Opportunity not found');
        }

        return {
            id: doc.id,
            ...doc.data(),
            deadline: doc.data().deadline?.toDate?.() || doc.data().deadline,
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        };
    } catch (error) {
        console.error('Error fetching opportunity:', error);
        throw error;
    }
}

/**
 * Add opportunity to user's wishlist
 * @param {string} userId - User ID
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<void>}
 */
async function addToWishlist(userId, opportunityId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db

        // Get opportunity to store deadline
        const opportunity = await getOpportunityById(opportunityId);

        const wishlistRef = db.collection('wishlists').doc(userId);

        await wishlistRef.set({
            [`opportunities.${opportunityId}`]: {
                addedAt: admin.firestore.FieldValue.serverTimestamp(),
                deadline: opportunity.deadline,
                title: opportunity.title,
                type: opportunity.type,
            }
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}

/**
 * Remove opportunity from user's wishlist
 * @param {string} userId - User ID
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<void>}
 */
async function removeFromWishlist(userId, opportunityId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const wishlistRef = db.collection('wishlists').doc(userId);

        await wishlistRef.update({
            [`opportunities.${opportunityId}`]: admin.firestore.FieldValue.delete()
        });

        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}

/**
 * Get user's wishlist
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of wishlisted opportunities
 */
async function getWishlist(userId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const wishlistDoc = await db.collection('wishlists').doc(userId).get();

        if (!wishlistDoc.exists) {
            return [];
        }

        const wishlistData = wishlistDoc.data();
        const opportunities = wishlistData.opportunities || {};

        // Convert to array and fetch full opportunity details
        const wishlistItems = await Promise.all(
            Object.entries(opportunities).map(async ([oppId, data]) => {
                try {
                    const opp = await getOpportunityById(oppId);
                    return {
                        ...opp,
                        addedAt: data.addedAt?.toDate?.() || data.addedAt,
                    };
                } catch (error) {
                    console.error(`Error fetching opportunity ${oppId}:`, error);
                    return null;
                }
            })
        );

        // Filter out null values and sort by deadline
        return wishlistItems
            .filter(item => item !== null)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
}

module.exports = {
    getOpportunities,
    getOpportunityById,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};

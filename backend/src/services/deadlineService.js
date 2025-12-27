const { admin, db } = require('../config/firebase');

/**
 * Deadline Service
 * Handles deadline tracking and notifications
 */

/**
 * Get upcoming deadlines for user's wishlisted opportunities
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of opportunities with deadline info
 */
async function getUpcomingDeadlines(userId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const wishlistDoc = await db.collection('wishlists').doc(userId).get();

        if (!wishlistDoc.exists) {
            return [];
        }

        const wishlistData = wishlistDoc.data();
        const opportunities = wishlistData.opportunities || {};

        const now = new Date();

        // Convert to array with deadline calculations
        const deadlineItems = Object.entries(opportunities).map(([oppId, data]) => {
            const deadline = data.deadline?.toDate?.() || new Date(data.deadline);
            const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

            return {
                opportunityId: oppId,
                title: data.title,
                type: data.type,
                deadline: deadline,
                daysUntilDeadline,
                isUrgent: daysUntilDeadline <= 7 && daysUntilDeadline >= 0,
                isPast: daysUntilDeadline < 0,
                addedAt: data.addedAt?.toDate?.() || data.addedAt,
            };
        });

        // Filter out past deadlines and sort by urgency
        return deadlineItems
            .filter(item => !item.isPast)
            .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
    } catch (error) {
        console.error('Error fetching upcoming deadlines:', error);
        throw error;
    }
}

/**
 * Get urgent deadlines (within 7 days)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of urgent opportunities
 */
async function getUrgentDeadlines(userId) {
    try {
        const allDeadlines = await getUpcomingDeadlines(userId);
        return allDeadlines.filter(item => item.isUrgent);
    } catch (error) {
        console.error('Error fetching urgent deadlines:', error);
        throw error;
    }
}

/**
 * Get deadline statistics for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deadline statistics
 */
async function getDeadlineStats(userId) {
    try {
        const deadlines = await getUpcomingDeadlines(userId);

        const stats = {
            total: deadlines.length,
            urgent: deadlines.filter(d => d.isUrgent).length,
            thisWeek: deadlines.filter(d => d.daysUntilDeadline <= 7).length,
            thisMonth: deadlines.filter(d => d.daysUntilDeadline <= 30).length,
            byType: {},
        };

        // Count by type
        deadlines.forEach(item => {
            stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        });

        return stats;
    } catch (error) {
        console.error('Error calculating deadline stats:', error);
        throw error;
    }
}

/**
 * Check if opportunity deadline is approaching
 * @param {Date} deadline - Opportunity deadline
 * @param {number} daysThreshold - Days before deadline to consider urgent
 * @returns {boolean} Whether deadline is approaching
 */
function isDeadlineApproaching(deadline, daysThreshold = 7) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    return daysUntil <= daysThreshold && daysUntil >= 0;
}

/**
 * Format deadline for display
 * @param {Date} deadline - Deadline date
 * @returns {Object} Formatted deadline info
 */
function formatDeadline(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    let displayText = '';
    let urgencyLevel = 'normal';

    if (daysUntil < 0) {
        displayText = 'Expired';
        urgencyLevel = 'expired';
    } else if (daysUntil === 0) {
        displayText = 'Today';
        urgencyLevel = 'critical';
    } else if (daysUntil === 1) {
        displayText = 'Tomorrow';
        urgencyLevel = 'critical';
    } else if (daysUntil <= 3) {
        displayText = `${daysUntil} days`;
        urgencyLevel = 'high';
    } else if (daysUntil <= 7) {
        displayText = `${daysUntil} days`;
        urgencyLevel = 'medium';
    } else if (daysUntil <= 30) {
        displayText = `${daysUntil} days`;
        urgencyLevel = 'normal';
    } else {
        displayText = deadlineDate.toLocaleDateString();
        urgencyLevel = 'normal';
    }

    return {
        displayText,
        urgencyLevel,
        daysUntil,
        date: deadlineDate,
    };
}

module.exports = {
    getUpcomingDeadlines,
    getUrgentDeadlines,
    getDeadlineStats,
    isDeadlineApproaching,
    formatDeadline,
};

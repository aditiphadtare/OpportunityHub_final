const express = require('express');
const router = express.Router();
const deadlineService = require('../services/deadlineService');

/**
 * GET /deadlines/:userId
 * Get upcoming deadlines for user's wishlisted opportunities
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const deadlines = await deadlineService.getUpcomingDeadlines(userId);

        res.json({
            success: true,
            count: deadlines.length,
            data: deadlines
        });
    } catch (error) {
        console.error('Error fetching deadlines:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch deadlines'
        });
    }
});

/**
 * GET /deadlines/:userId/urgent
 * Get urgent deadlines (within 7 days)
 */
router.get('/:userId/urgent', async (req, res) => {
    try {
        const { userId } = req.params;
        const urgentDeadlines = await deadlineService.getUrgentDeadlines(userId);

        res.json({
            success: true,
            count: urgentDeadlines.length,
            data: urgentDeadlines
        });
    } catch (error) {
        console.error('Error fetching urgent deadlines:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch urgent deadlines'
        });
    }
});

/**
 * GET /deadlines/:userId/stats
 * Get deadline statistics
 */
router.get('/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await deadlineService.getDeadlineStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching deadline stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch deadline stats'
        });
    }
});

module.exports = router;

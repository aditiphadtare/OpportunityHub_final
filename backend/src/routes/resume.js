const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeService = require('../services/resumeService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
        }
    }
});

/**
 * POST /resume/upload
 * Upload and parse resume file
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        let resumeText = '';

        // Parse based on file type
        if (req.file.mimetype === 'application/pdf') {
            resumeText = await resumeService.extractTextFromPDF(req.file.buffer);
        } else {
            resumeText = await resumeService.extractTextFromImage(req.file.buffer);
        }

        res.json({
            success: true,
            data: {
                text: resumeText,
                filename: req.file.originalname,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to parse resume file'
        });
    }
});

/**
 * POST /resume/analyze
 * Analyze resume against job description
 * Body: { userId, resumeText, jobDescription }
 */
router.post('/analyze', async (req, res) => {
    try {
        const { userId, resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                success: false,
                error: 'resumeText and jobDescription are required'
            });
        }

        // Analyze resume with AI
        const analysis = await resumeService.analyzeResumeWithAI(resumeText, jobDescription);

        // Get opportunity recommendations
        const recommendations = await resumeService.getOpportunityRecommendations(
            analysis.matchedSkills,
            analysis.missingSkills
        );

        // Add recommendations to analysis
        analysis.recommendations = recommendations;

        // Save analysis if userId provided
        if (userId) {
            const savedAnalysis = await resumeService.saveAnalysis(userId, {
                resumeText,
                jobDescription,
                ...analysis
            });

            return res.json({
                success: true,
                data: savedAnalysis
            });
        }

        res.json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze resume'
        });
    }
});

/**
 * GET /resume/history/:userId
 * Get user's resume analysis history
 */
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await resumeService.getAnalysisHistory(userId);

        res.json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analysis history'
        });
    }
});

/**
 * POST /resume/suggestions
 * Get skill improvement suggestions based on analysis
 * Body: { matchedSkills, missingSkills, type, domains }
 */
router.post('/suggestions', async (req, res) => {
    try {
        const { matchedSkills, missingSkills, type, domains } = req.body;

        if (!matchedSkills && !missingSkills && type) {
            // Provide general suggestions if no resume analysis available
            const suggestions = resumeService.getGeneralImprovements(type, domains);
            return res.json({
                success: true,
                data: suggestions
            });
        }

        const recommendations = await resumeService.getOpportunityRecommendations(
            matchedSkills || [],
            missingSkills || []
        );

        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get suggestions'
        });
    }
});

/**
 * POST /resume/refine
 * Refine resume content using AI
 * Body: { resumeText, additionalInfo }
 */
router.post('/refine', async (req, res) => {
    try {
        const { resumeText, additionalInfo } = req.body;

        if (!resumeText || !additionalInfo) {
            return res.status(400).json({
                success: false,
                error: 'resumeText and additionalInfo are required'
            });
        }

        const refinedText = await resumeService.refineResumeWithAI(resumeText, additionalInfo);

        res.json({
            success: true,
            data: { text: refinedText }
        });
    } catch (error) {
        console.error('Error refining resume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refine resume'
        });
    }
});

module.exports = router;

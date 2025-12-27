const { GoogleGenerativeAI } = require('@google/generative-ai');
const { admin, db } = require('../config/firebase');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Resume Analysis Service
 * Handles resume parsing and AI-powered analysis
 */

/**
 * Extract text from PDF buffer
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromPDF(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to parse PDF');
    }
}

/**
 * Extract text from image using OCR
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromImage(imageBuffer) {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
            logger: m => console.log(m)
        });
        return text;
    } catch (error) {
        console.error('Error extracting text from image:', error);
        throw new Error('Failed to parse image');
    }
}

/**
 * Analyze resume against job description using Gemini AI
 * @param {string} resumeText - Resume content
 * @param {string} jobDescription - Job description
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeResumeWithAI(resumeText, jobDescription) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `Analyze resume vs job.
Resume: ${resumeText.substring(0, 8000)}
Job: ${jobDescription.substring(0, 4000)}
Return ONLY JSON:
{
  "matchPercentage": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestions": { "skills": string[], "projects": string[], "improvements": string[] },
  "strengths": string[],
  "weaknesses": string[]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : generateBasicAnalysis(resumeText, jobDescription);
    } catch (error) {
        console.error('AI Analysis failed:', error.message);
        return generateBasicAnalysis(resumeText, jobDescription);
    }
}

/**
 * Refine resume content using AI based on user feedback or new info
 * @param {string} resumeText - Original resume content
 * @param {string} additionalInfo - New info or feedback to incorporate
 * @returns {Promise<string>} Refined resume content
 */
async function refineResumeWithAI(resumeText, additionalInfo) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const prompt = `Refine resume with new info.
Resume: ${resumeText.substring(0, 8000)}
Info: ${additionalInfo.substring(0, 2000)}
Return ONLY the refined text.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        const fs = require('fs');
        fs.appendFileSync('error.log', `Refine Error: ${error.message}\n`);
        throw new Error('AI Refinement failed');
    }
}

/**
 * Get general improvement suggestions for a category if no resume is uploaded
 * @param {string} type - Opportunity type
 * @param {Array} domains - User domains
 * @returns {Object} General suggestions
 */
function getGeneralImprovements(type, domains = []) {
    const domainStr = domains.length > 0 ? domains.join(', ') : 'technology';

    return {
        skills: [
            `Master core concepts in ${domainStr}`,
            `Learn popular frameworks like React, Node.js, or others relevant to your field`,
            `Develop problem-solving and algorithmic thinking`
        ],
        projects: [
            `Build a comprehensive project in ${domains[0] || 'your core area'}`,
            `Contribute to open source projects on GitHub`,
            `Develop a personal portfolio website showcasing your skills`
        ],
        improvements: [
            `Start by creating a structured resume focusing on ${domainStr}`,
            `Highlight any relevant coursework or certifications`,
            `Showcase soft skills like teamwork and leadership through projects`
        ]
    };
}

/**
 * Generate basic analysis without AI (fallback)
 * @param {string} resumeText - Resume content
 * @param {string} jobDescription - Job description
 * @returns {Object} Basic analysis results
 */
function generateBasicAnalysis(resumeText, jobDescription) {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Common tech skills to check
    const commonSkills = [
        'javascript', 'typescript', 'python', 'java', 'react', 'node.js',
        'angular', 'vue', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'mongodb', 'postgresql', 'mysql', 'git', 'ci/cd', 'agile'
    ];

    const matchedSkills = commonSkills.filter(skill =>
        resumeLower.includes(skill) && jobLower.includes(skill)
    );

    const missingSkills = commonSkills.filter(skill =>
        !resumeLower.includes(skill) && jobLower.includes(skill)
    );

    const matchPercentage = Math.min(
        Math.round((matchedSkills.length / Math.max(missingSkills.length + matchedSkills.length, 1)) * 100),
        100
    );

    return {
        matchPercentage,
        matchedSkills,
        missingSkills,
        matchedKeywords: matchedSkills,
        missingKeywords: missingSkills,
        suggestions: {
            skills: missingSkills.slice(0, 5).map(skill => `Learn ${skill} to match job requirements`),
            projects: [
                'Build a full-stack web application',
                'Contribute to open-source projects',
                'Create a portfolio website'
            ],
            improvements: [
                'Add more quantifiable achievements',
                'Include relevant certifications',
                'Highlight leadership experience'
            ]
        },
        strengths: ['Technical skills present', 'Relevant experience'],
        weaknesses: ['Missing some required skills', 'Could add more details']
    };
}

/**
 * Get opportunity recommendations based on resume analysis
 * @param {Array} matchedSkills - Skills from resume
 * @param {Array} missingSkills - Skills to improve
 * @returns {Promise<Array>} Recommended opportunities
 */
async function getOpportunityRecommendations(matchedSkills, missingSkills) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const opportunitiesRef = db.collection('opportunities');

        // Get all opportunities
        const snapshot = await opportunitiesRef.get();
        const opportunities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Score opportunities based on skill match
        const scoredOpportunities = opportunities.map(opp => {
            const oppDomains = (opp.domains || []).map(d => d.toLowerCase());
            const allSkills = [...matchedSkills, ...missingSkills].map(s => s.toLowerCase());

            const matchCount = oppDomains.filter(domain =>
                allSkills.some(skill => domain.includes(skill) || skill.includes(domain))
            ).length;

            return {
                ...opp,
                relevanceScore: matchCount
            };
        });

        // Sort by relevance and return top 5
        return scoredOpportunities
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5)
            .map(({ relevanceScore, ...opp }) => {
                // Map relevanceScore to a percentage
                const base = 70;
                const bonus = Math.min(relevanceScore * 5, 28);
                return {
                    ...opp,
                    matchPercentage: base + bonus
                };
            });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}

/**
 * Save resume analysis to Firestore
 * @param {string} userId - User ID
 * @param {Object} analysisData - Analysis results
 * @returns {Promise<Object>} Saved analysis with ID
 */
async function saveAnalysis(userId, analysisData) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const analysisRef = db.collection('resumeAnalyses').doc(userId).collection('analyses');

        const docRef = await analysisRef.add({
            ...analysisData,
            analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
            id: docRef.id,
            ...analysisData
        };
    } catch (error) {
        console.error('Error saving analysis:', error);
        throw error;
    }
}

/**
 * Get user's resume analysis history
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of past analyses
 */
async function getAnalysisHistory(userId) {
    try {
        // const db = admin.firestore(); // Removed, using imported db
        const analysesRef = db.collection('resumeAnalyses').doc(userId).collection('analyses');

        const snapshot = await analysesRef.orderBy('analyzedAt', 'desc').limit(10).get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            analyzedAt: doc.data().analyzedAt?.toDate?.() || doc.data().analyzedAt,
        }));
    } catch (error) {
        console.error('Error fetching analysis history:', error);
        return [];
    }
}

module.exports = {
    extractTextFromPDF,
    extractTextFromImage,
    analyzeResumeWithAI,
    refineResumeWithAI,
    getGeneralImprovements,
    getOpportunityRecommendations,
    saveAnalysis,
    getAnalysisHistory,
};

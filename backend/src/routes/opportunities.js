const express = require("express");
const router = express.Router();
const opportunityService = require("../services/opportunityService");

/**
 * GET /opportunities
 * Filters supported:
 * - location (string)
 * - domains (comma-separated)
 */
router.get("/", async (req, res) => {
  try {
    const { location, domains } = req.query;

    const filters = {};

    // normalize location
    if (location && typeof location === "string") {
      filters.location = location.trim();
    }

    // normalize domains
    if (domains && typeof domains === "string") {
      filters.domains = domains
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    }

    const opportunities = await opportunityService.getOpportunities(filters);

    res.json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);

    // 🚨 FAIL SAFE: never break home page
    const fallback = await opportunityService.getOpportunities({});
    res.json({
      success: true,
      count: fallback.length,
      data: fallback,
    });
  }
});

/**
 * GET /opportunities/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = await opportunityService.getOpportunityById(id);

    res.json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    res.status(404).json({
      success: false,
      error: "Opportunity not found",
    });
  }
});

/**
 * POST /opportunities/wishlist
 */
router.post("/wishlist", async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    if (!userId || !opportunityId) {
      return res.status(400).json({
        success: false,
        error: "userId and opportunityId are required",
      });
    }

    await opportunityService.addToWishlist(userId, opportunityId);

    res.json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add to wishlist",
    });
  }
});

/**
 * DELETE /opportunities/wishlist/:userId/:opportunityId
 */
router.delete("/wishlist/:userId/:opportunityId", async (req, res) => {
  try {
    const { userId, opportunityId } = req.params;

    await opportunityService.removeFromWishlist(userId, opportunityId);

    res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove from wishlist",
    });
  }
});

/**
 * GET /opportunities/wishlist/:userId
 */
router.get("/wishlist/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await opportunityService.getWishlist(userId);

    res.json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch wishlist",
    });
  }
});

module.exports = router;

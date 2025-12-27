const express = require("express");
const { db } = require("../config/firebase");
const router = express.Router();

router.post("/update", async (req, res) => {
    const { uid, location, domains } = req.body;

    if (!uid) {
        return res.status(400).json({ error: "Missing uid" });
    }

    try {
        await db.collection("users").doc(uid).update({
            location,
            domain: domains, // Mapping domains to 'domain' field in Firestore
            updatedAt: new Date(),
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Profile update error:", err.message);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

module.exports = router;

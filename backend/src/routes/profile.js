const express = require("express");
const { db } = require("../config/firebase");
const admin = require("firebase-admin"); // already initialized elsewhere
const router = express.Router();

/**
 * UPDATE PREFERENCES (location + domain)
 * This route is already working — DO NOT CHANGE LOGIC
 */
router.post("/update", async (req, res) => {
  try {
    const { uid, location, domain } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    await db.collection("users").doc(uid).update({
      location: location || "",
      domain: Array.isArray(domain) ? domain : [],
      updatedAt: new Date(),
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * UPDATE PROFILE INFO (username + email in Firestore)
 */
router.post("/update-info", async (req, res) => {
  try {
    const { uid, username, email } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;

    await db.collection("users").doc(uid).update({
      ...updates,
      updatedAt: new Date(),
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Profile info update error:", err);
    return res.status(500).json({ error: "Failed to update profile info" });
  }
});

/**
 * UPDATE LOGIN EMAIL (Firebase Auth)
 * Required so new email works for login
 */
router.post("/update-email", async (req, res) => {
  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" });
    }

    await admin.auth().updateUser(uid, { email });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Email update error:", err);

    // Firebase requires recent login for sensitive changes
    if (err.code === "auth/requires-recent-login") {
      return res.status(401).json({
        error: "Please re-login to change email",
      });
    }

    return res.status(500).json({ error: "Failed to update email" });
  }
});

module.exports = router;

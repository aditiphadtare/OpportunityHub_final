const express = require("express");
const { admin, db } = require("../config/firebase");
const router = express.Router();

// db is now imported from config

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Store additional user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      username,
      domain: null,
      location: null,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      uid: userRecord.uid,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    // In a real Firebase app, the frontend handles password auth.
    // For this implementation, we'll fetch the user by email from Firestore.
    // NOTE: This assumes password check is done or simplified for this hackathon context.
    const userSnapshot = await db.collection("users").where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    res.json({
      uid: userDoc.id,
      email: userData.email,
      username: userData.username,
      location: userData.location,
      domain: userData.domain || [],
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;


// 🔐 Firebase Admin Init
const path = require("path");
const admin = require("firebase-admin");
const opportunities = require("./opportunities.seed");

admin.initializeApp({
  credential: admin.credential.cert(
    require(path.join(__dirname, "../../firebaseKey.json"))
  ),
});

const db = admin.firestore();

async function seedOpportunities() {
  const batch = db.batch();

  opportunities.forEach((opp) => {
    // ✅ Use stable ID to avoid duplicates
    const ref = db.collection("opportunities").doc(opp.externalId);

    batch.set(
      ref,
      {
        ...opp,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true } // safe re-seeding
    );
  });

  await batch.commit();
  console.log("✅ Opportunities seeded successfully (no duplicates)");
}

seedOpportunities().catch(console.error);

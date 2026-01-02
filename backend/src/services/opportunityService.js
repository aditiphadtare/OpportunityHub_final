const { admin, db } = require("../config/firebase");

/**
 * Fetch opportunities with optional filters
 */
async function getOpportunities(filters = {}) {
  try {
    const snapshot = await db.collection("opportunities").get();

    let opportunities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* =========================
       LOCATION FILTER (SAFE)
    ========================== */
    if (filters.location) {
      const userLocation = filters.location.toLowerCase();

      opportunities = opportunities.filter((opp) => {
        if (!opp.location) return false;

        const oppLocation = opp.location.toLowerCase();

        return (
          oppLocation.includes(userLocation) ||
          oppLocation.includes("remote")
        );
      });
    }

    /* =========================
       DOMAIN FILTER (SAFE)
    ========================== */
    if (Array.isArray(filters.domains) && filters.domains.length > 0) {
      const userDomains = filters.domains.map((d) => d.toLowerCase());

      opportunities = opportunities.filter((opp) => {
        if (!Array.isArray(opp.domains)) return false;

        const oppDomains = opp.domains.map((d) => d.toLowerCase());

        return oppDomains.some((d) => userDomains.includes(d));
      });
    }

    return opportunities;
  } catch (error) {
    console.error("Error filtering opportunities:", error);
    throw error;
  }
}


/**
 * Get single opportunity
 */
async function getOpportunityById(opportunityId) {
  const docRef = await db.collection("opportunities").doc(opportunityId).get();

  if (!docRef.exists) {
    throw new Error("Opportunity not found");
  }

  const data = docRef.data();

  return {
    id: docRef.id,
    ...data,
    deadline: data.deadline?.toDate?.() || data.deadline,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
  };
}

/**
 * ADD TO WISHLIST (SUBCOLLECTION)
 */
async function addToWishlist(userId, opportunityId) {
  const opportunity = await getOpportunityById(opportunityId);

  const wishlistRef = db
    .collection("wishlists")
    .doc(userId)
    .collection("opportunities")
    .doc(opportunityId);

  await wishlistRef.set({
    title: opportunity.title,
    type: opportunity.type,
    deadline: opportunity.deadline,
    organization: opportunity.organization || "",
    location: opportunity.location || "",
    addedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
}

/**
 * REMOVE FROM WISHLIST
 */
async function removeFromWishlist(userId, opportunityId) {
  const wishlistRef = db
    .collection("wishlists")
    .doc(userId)
    .collection("opportunities")
    .doc(opportunityId);

  await wishlistRef.delete();
  return { success: true };
}

/**
 * GET USER WISHLIST
 */
async function getWishlist(userId) {
  const wishlistRef = db
    .collection("wishlists")
    .doc(userId)
    .collection("opportunities");

  const snapshot = await wishlistRef.get();

  const items = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      type: data.type,
      deadline: data.deadline,
      organization: data.organization,
      location: data.location,
      addedAt: data.addedAt?.toDate?.() || data.addedAt,
    };
  });

  return items.sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );
}

module.exports = {
  getOpportunities,
  getOpportunityById,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};


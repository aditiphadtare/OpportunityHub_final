const { admin, db } = require("../config/firebase");

/**
 * Fetch opportunities with optional filters
 */
async function getOpportunities(filters = {}) {
  try {
    let query = db.collection("opportunities");

    if (filters.type && filters.type !== "all") {
      query = query.where("type", "==", filters.type);
    }

    const snapshot = await query.get();

    const opportunities = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate?.() || data.deadline,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      };
    });

    return opportunities;
  } catch (error) {
    console.error("Error fetching opportunities:", error);
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


const { db } = require("../config/firebase");

/**
 * Get all upcoming deadlines
 */
async function getUpcomingDeadlines(userId) {
  const wishlistSnap = await db
    .collection("wishlists")
    .doc(userId)
    .collection("opportunities")
    .get();

  const now = new Date();

  return wishlistSnap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        deadline: data.deadline,
        organization: data.organization || "",
      };
    })
    .filter((item) => new Date(item.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

/**
 * Get urgent deadlines (within 7 days)
 */
async function getUrgentDeadlines(userId) {
  const deadlines = await getUpcomingDeadlines(userId);
  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);

  return deadlines.filter(
    (d) => new Date(d.deadline) <= in7Days
  );
}

/**
 * Get deadline stats
 */
async function getDeadlineStats(userId) {
  const deadlines = await getUpcomingDeadlines(userId);
  const urgent = await getUrgentDeadlines(userId);

  return {
    total: deadlines.length,
    urgent: urgent.length,
  };
}

module.exports = {
  getUpcomingDeadlines,
  getUrgentDeadlines,
  getDeadlineStats,
};

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().trim();
}

function extractKeywords(text) {
  // Remove common stop words and extract meaningful words
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'about', 'and', 'but', 'or',
    'because', 'until', 'while', 'this', 'that', 'these', 'those',
    'it', 'its', 'he', 'she', 'they', 'them', 'their', 'his', 'her',
    'my', 'your', 'our', 'i', 'you', 'we', 'me', 'us',
  ]);

  const words = normalizeText(text).split(/\s+/);
  return words.filter(word => word.length > 2 && !stopWords.has(word));
}

function calculateMatchScore(item1, item2) {
  let score = 0;
  const maxScore = 100;

  // Category match (high weight - 40 points)
  if (item1.category === item2.category) {
    score += 40;
  }

  // Title keyword matching (30 points)
  const title1Keywords = extractKeywords(item1.title);
  const title2Keywords = extractKeywords(item2.title);

  if (title1Keywords.length > 0 && title2Keywords.length > 0) {
    const titleMatches = title1Keywords.filter(word =>
      title2Keywords.includes(word) ||
      title2Keywords.some(tk => tk.includes(word) || word.includes(tk))
    );
    if (titleMatches.length > 0) {
      const titleMatchRatio = titleMatches.length / Math.max(title1Keywords.length, title2Keywords.length);
      score += Math.floor(titleMatchRatio * 30);
    }
  }

  // Description keyword matching (20 points)
  const desc1Keywords = extractKeywords(item1.description || '');
  const desc2Keywords = extractKeywords(item2.description || '');

  if (desc1Keywords.length > 0 && desc2Keywords.length > 0) {
    const descMatches = desc1Keywords.filter(word =>
      desc2Keywords.includes(word) ||
      desc2Keywords.some(dk => dk.includes(word) || word.includes(dk))
    );
    if (descMatches.length > 0) {
      const descMatchRatio = descMatches.length / Math.max(desc1Keywords.length, desc2Keywords.length);
      score += Math.floor(descMatchRatio * 20);
    }
  }

  // Location match (10 points)
  if (item1.location?.city && item2.location?.city) {
    if (normalizeText(item1.location.city) === normalizeText(item2.location.city)) {
      score += 10;
    }
  }

  return Math.min(score, maxScore);
}

async function findMatches(newItem, LostFound, Notification) {
  const MATCH_THRESHOLD = 25; // Minimum score to consider a match
  const matches = [];

  try {
    // Find opposite-type items only
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    const oppositeItems = await LostFound.find({
      type: oppositeType,
      status: 'active',
      user: { $ne: newItem.user }, // Exclude same user
    }).populate('user', 'firstName lastName email');

    for (const oppositeItem of oppositeItems) {
      const score = calculateMatchScore(newItem, oppositeItem);

      if (score >= MATCH_THRESHOLD) {
        matches.push({
          item: oppositeItem,
          score,
        });
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    return matches;
  } catch (error) {
    console.error('Matching error:', error);
    return [];
  }
}

async function findPoliceMatches(policeItem, LostFound) {
  const MATCH_THRESHOLD = 25;
  const matches = [];
  try {
    const lostItems = await LostFound.find({
      type: 'lost',
      status: 'active',
    }).populate('user', 'firstName lastName email');

    for (const lostItem of lostItems) {
      const score = calculateMatchScore(lostItem, policeItem); // reuse existing scoring
      if (score >= MATCH_THRESHOLD) {
        matches.push({ item: lostItem, score });
      }
    }
    matches.sort((a, b) => b.score - a.score);
    return matches;
  } catch (err) {
    console.error('Police matching error:', err);
    return [];
  }
}

module.exports = { findMatches, findPoliceMatches };
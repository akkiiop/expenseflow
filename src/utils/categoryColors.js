/**
 * Unified Category Color Palette & Resolver
 * Ensures consistent color representation across Categories, Expenses, Dashboard, and Reports.
 */

export const CATEGORY_COLORS = [
  '#10b981', // 0: Emerald Green (Food)
  '#6366f1', // 1: Indigo (Shopping)
  '#f43f5e', // 2: Rose Red (Bills / Utilities)
  '#f59e0b', // 3: Amber Orange (Recharge / Mobile)
  '#8b5cf6', // 4: Purple (Entertainment)
  '#ec4899', // 5: Pink (Personal Care)
  '#14b8a6', // 6: Teal (Travel / Transport)
  '#f97316', // 7: Deep Orange (Health)
  '#06b6d4', // 8: Cyan (Education)
  '#84cc16', // 9: Lime (Groceries)
];

/**
 * Returns a consistent category color.
 * 1. Checks if category matches an entry in user's category list -> index-based color.
 * 2. Fallback: deterministic string hash of category name.
 *
 * @param {string|number} categoryId
 * @param {string} categoryName
 * @param {Array} categoriesList
 * @returns {string} Hex color
 */
export const getCategoryColor = (categoryId, categoryName, categoriesList = []) => {
  if (Array.isArray(categoriesList) && categoriesList.length > 0) {
    const idx = categoriesList.findIndex(
      (c) =>
        (categoryId && String(c.id) === String(categoryId)) ||
        (categoryName && c.name?.trim().toLowerCase() === categoryName.trim().toLowerCase())
    );
    if (idx !== -1) {
      return CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
    }
  }

  // Deterministic fallback based on category name
  if (categoryName) {
    let hash = 0;
    const str = categoryName.trim().toLowerCase();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
  }

  return CATEGORY_COLORS[0];
};

/**
 * Generates styling for category badge pills.
 *
 * @param {string} color Hex color
 * @returns {object} CSS style object
 */
export const getCategoryBadgeStyle = (color) => {
  const safeColor = color || CATEGORY_COLORS[0];
  return {
    color: safeColor,
    backgroundColor: `${safeColor}18`, // ~10% tint
    borderColor: `${safeColor}35`,     // ~20% border
  };
};

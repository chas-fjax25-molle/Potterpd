export const CSS = Object.freeze({
    FAVORITE_ICON_CLASS: "favorite-icon",
    FAVORITE_ICON_ACTIVE_CLASS: "favorite-icon--active",
});
/**
 * Generate the favorite icon HTML element.
 *
 * @param {string} id - The entity ID associated with the favorite icon.
 *
 * @returns {HTMLElement} - The favorite icon HTML element.
 */
export function favoriteIcon(id) {
    const favoriteIcon = document.createElement("span");
    favoriteIcon.classList.add(CSS.FAVORITE_ICON_CLASS);
    favoriteIcon.dataset.entityId = id;
    favoriteIcon.setAttribute("role", "button");
    favoriteIcon.setAttribute("aria-label", "Toggle Favorite");
    favoriteIcon.tabIndex = 0;
    favoriteIcon.textContent = "★";
    return favoriteIcon;
}

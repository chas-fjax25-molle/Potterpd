export const CSS = Object.freeze({
    FAVORITE_ICON_CLASS: "favorite-icon",
    FAVORITE_ICON_ACTIVE_CLASS: "favorite-icon--active",
});
/**
 * Generate the favorite icon HTML element.
 *
 * @param {string} id - The entity ID associated with the favorite icon.
 * @param {boolean} [isFavorite=false] - Indicates whether the entity is currently a favorite, which determines the icon's appearance.
 *
 * @returns {HTMLButtonElement} - The favorite icon HTML element.
 */
export function favoriteIcon(id, isFavorite = false) {
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add(CSS.FAVORITE_ICON_CLASS);
    favoriteButton.type = "button";
    favoriteButton.dataset.entityId = id;

    const updateUI = () => {
        favoriteButton.textContent = isFavorite ? "★" : "☆";
        favoriteButton.classList.toggle(CSS.FAVORITE_ICON_ACTIVE_CLASS, isFavorite);

        favoriteButton.setAttribute("aria-pressed", String(isFavorite));
        favoriteButton.setAttribute(
            "aria-label",
            isFavorite ? "Remove from favorites" : "Add to favorites"
        );
    };
    //favoriteButton.addEventListener("click", () => {
    //    isActive = !isActive;
    //    //TODO: Connect to favorites logic! <3
    //    updateUI();
    //});

    updateUI();
    return favoriteButton;
}

/**
 * Register a click event listener for favorite icons within a specified container.
 * @param {any} container - The container element to attach the click listener to (default: document).
 * @param {(id: string) => void} callback - The callback function to invoke when a favorite icon is clicked, receiving the entity ID as an argument.
 * @returns {() => void} A function to unregister the click listener.
 */
export function registerFavoriteIconClick(container = document, callback = () => {}) {
    /**
     * Callback function for handling click events on favorite icons. It toggles the active state of the clicked icon and invokes the provided callback with the associated entity ID.
     * @param {PointerEvent} e - The click event object, used to determine if a favorite icon was clicked and to extract the associated entity ID for the callback function.
     */
    function onClick(e) {
        if (!e.target || !e.target) return;
        const btn = e.target.closest(`.${CSS.FAVORITE_ICON_CLASS}`);
        if (!btn) return;
        const entityId = btn.dataset.entityId;
        if (!entityId) return;

        const isActive = btn.classList.toggle(CSS.FAVORITE_ICON_ACTIVE_CLASS);
        console.log(`Toggled favorite for entity ID: ${entityId}, active: ${isActive}`);

        btn.textContent = isActive ? "★" : "☆";
        btn.setAttribute("aria-pressed", String(isActive));
        btn.setAttribute("aria-label", isActive ? "Remove from favorites" : "Add to favorites");

        callback(entityId);
    }
    container.addEventListener("click", onClick);
    // Return a teardown function so callers can unregister the delegated handler.
    return () => container.removeEventListener("click", onClick);
}

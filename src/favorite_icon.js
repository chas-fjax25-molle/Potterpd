export const CSS = Object.freeze({
    FAVORITE_ICON_CLASS: "favorite-icon",
    FAVORITE_ICON_ACTIVE_CLASS: "favorite-icon--active",
});
/**
 * Generate the favorite icon HTML element.
 *
 * @param {string} id - The entity ID associated with the favorite icon.
 *
 * @returns {HTMLButtonElement} - The favorite icon HTML element.
 */
export function favoriteIcon(id) {
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add(CSS.FAVORITE_ICON_CLASS);
    favoriteButton.type = "button";
    favoriteButton.dataset.entityId = id;

    let isActive = false;

    const updateUI = () => {
        favoriteButton.textContent = isActive ? "★" : "☆";
        favoriteButton.classList.toggle(CSS.FAVORITE_ICON_ACTIVE_CLASS, isActive);

        favoriteButton.setAttribute("aria-pressed", String(isActive));
        favoriteButton.setAttribute(
            "aria-label",
            isActive ? "Remove from favorites" : "Add to favorites"
        );
    };
    favoriteButton.addEventListener("click", () => {
        isActive = !isActive;
        //TODO: Connect to favorites logic! <3
        updateUI();
    });

    updateUI();
    return favoriteButton;
}

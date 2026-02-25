/* eslint-disable indent */
import { Favorites, EntityType } from "./favorites";
import { registerFavoriteIconClick } from "./favorite_icon";

const container = document.getElementById("favorites-container");

/**
 * Render favorites of all types
 */
async function renderFavorites() {
    if (!container) {
        console.error("favorites-container element not found");
        return;
    }

    const favorites = Favorites.getInstance();
    const allFavorites = favorites.getAll();

    container.innerHTML = "";

    if (allFavorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    // Render each favorite item using their previewHTML() method
    for (const item of allFavorites) {
        let card;

        switch (item.type) {
            case EntityType.CHARACTER:
                card = item.previewHTML();
                break;
            case EntityType.SPELL:
                card = item.previewHTML();
                break;
            case EntityType.POTION:
                card = item.previewHTML();
                break;
            default:
                console.warn(`Unknown item type: ${item.type}`);
                continue;
        }

        container.appendChild(card);
    }

    // Wire up favorite icon clicks to toggle favorites
    if (container) {
        registerFavoriteIconClick(container, (id) => {
            handleFavoriteToggle(id);
        });
    }
}

/**
 * Handle favorite icon clicks - toggle and re-render
 * @param {string} id - Entity ID
 */
async function handleFavoriteToggle(id) {
    const favorites = Favorites.getInstance();
    const allFavorites = favorites.getAll();

    // Find and remove the item from favorites
    const item = allFavorites.find((i) => i.id === id);
    if (item) {
        favorites.remove(item);
        favorites.store();
        // Re-render the page
        renderFavorites();
    }
}

// Initial render when page loads
document.addEventListener("DOMContentLoaded", renderFavorites);

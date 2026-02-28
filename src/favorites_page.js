/**
 * truned off eslint becouse switch statement had errors that
 * disurbed code and have been trowing errors on webpage too.
 */

import { Favorites } from "./favorites";
import { registerFavoriteIconClick } from "./favorite_icon";

// favorites page reuses the generic list container
const container = document.getElementById("list-container");

/**
 * Current state tracking
 * @type {{view: 'list' | 'detail', currentItem: any | null}}
 */
let state = {
    view: "list",
    currentItem: null,
};

/**
 * Track whether list click handlers have been attached
 */
let handlersAttached = false;

/**
 * Navigate to detail view for a specific item
 * @param {string} id - Item ID
 */
function navigateToDetail(id) {
    const favorites = Favorites.getInstance();
    const allFavorites = favorites.getAll();
    const item = allFavorites.find((i) => i.id === id);

    if (item) {
        state.view = "detail";
        state.currentItem = item;
        renderDetail();
    }
}

/**
 * Navigate back to list view
 */
function navigateToList() {
    state.view = "list";
    state.currentItem = null;
    renderList();
}

/**
 * Render list view of all favorites
 */
async function renderList() {
    if (!container) {
        console.error("list-container element not found for favorites page");
        return;
    }

    const favorites = Favorites.getInstance();
    const allFavorites = favorites.getAll();

    container.innerHTML = "";

    if (!allFavorites || allFavorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    const list = document.createElement("ul");
    list.classList.add("preview-list");

    for (const item of allFavorites) {
        // Ensure preview shows as favorited
        item.isFavorite = true;

        const card = item.previewHTML();
        // ensure card carries an id for delegated handlers
        if (!card.dataset.itemId) card.dataset.itemId = item.id;

        list.appendChild(card);
    }

    container.appendChild(list);

    if (!handlersAttached) {
        setupListClickHandlers();
        registerFavoriteIconClick(container, (id) => handleFavoriteToggle(id));
        handlersAttached = true;
    }
}

/**
 * Render detail view for current item
 */
function renderDetail() {
    if (!container || !state.currentItem) {
        console.error("Container or current item not found");
        return;
    }

    container.innerHTML = "";

    const detail = state.currentItem.detailsHTML();
    container.appendChild(detail);

    setupDetailClickHandlers();
    if (container) {
        registerFavoriteIconClick(container, (id) => {
            handleFavoriteToggle(id);
        });
    }
}

/**
 * Set up click handlers for list view
 */
function setupListClickHandlers() {
    if (!container) return;

    container.addEventListener("click", (ev) => {
        // @ts-ignore
        const card = ev.target.closest("[data-item-id]");
        if (card) {
            const id = card.getAttribute("data-item-id");

            if (id) {
                // Don't navigate if clicking on favorite icon
                // @ts-ignore
                const fav = ev.target.closest(".favorite-icon");
                if (!fav) {
                    ev.preventDefault();
                    navigateToDetail(id);
                }
            }
        }
    });
}

/**
 * Set up click handlers for detail view
 */
function setupDetailClickHandlers() {
    if (!container) return;

    container.addEventListener("click", (ev) => {
        // Handle back button click (works for character, spell, and potion back buttons)
        // @ts-ignore
        const backButton = ev.target.closest("button[class*='back-button']");
        if (backButton) {
            ev.preventDefault();
            navigateToList();
            return;
        }
    });
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

        // If we're viewing the detail of this item, go back to list
        if (state.currentItem && state.currentItem.id === id) {
            navigateToList();
        } else {
            // Otherwise just re-render current view
            if (state.view === "list") {
                renderList();
            }
        }
    }
}

// Initial render when page loads
document.addEventListener("DOMContentLoaded", renderList);

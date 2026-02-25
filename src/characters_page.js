
import { registerFavoriteIconClick } from "./favorite_icon";
import { EntityService } from "./entity_service";
import { EntityType } from "./favorites";
import { Character } from "./character";
import { createEntityRouter } from "./entity_router";
import { registerSearchCallback } from "./search_form";

/**
 * Container and service instances used across small helpers.
 * @type {HTMLElement | null}
 */
let charactersContainer = null;

/**
 * @type {EntityService | null}
 */
let service = null;

/**
 * @type {() => void}
 */
let navigateToList;
/**
 * @type {(id: string) => void}
 */
let navigateToDetail;
/**
 * @type {(q: string) => void}
 */
let navigateToSearch;

/**
 * Initialize the application: ensure DOM elements and service are present,
 * wire handlers and start the router.
 * @returns {void}
 */
function initApp() {
    if (!ensureContainer()) return;
    setupService();
    setupFavoriteHandler();
    setupClickInterceptor();
    const router = createEntityRouter({
        basePath: "/characters",
        renderList: listView,
        renderDetail: detailView,
        renderSearch: searchView,
    });
    router.init();
    navigateToList = router.navigateToList;
    navigateToDetail = router.navigateToDetail;
    navigateToSearch = router.navigateToSearch;
    registerSearchCallback(navigateToSearch);
}

/**
 * Ensure the characters container is present in the DOM.
 * @returns {boolean} true when container is found
 */
function ensureContainer() {
    charactersContainer = document.getElementById("characters-container");
    if (!charactersContainer) {
        console.error("Characters container element not found.");
        return false;
    }
    return true;
}

/**
 * Initialize the CharacterService instance.
 * @returns {void}
 */
function setupService() {
    service = new EntityService({
        category: "characters",
        fromJson: Character.fromJson,
        entityType: EntityType.CHARACTER,
        favoritesTypeKey: "character",
    });
}

/**
 * Wire favorite icon delegated handler.
 * @returns {void}
 */
function setupFavoriteHandler() {
    if (!charactersContainer || !service) return;

    registerFavoriteIconClick(charactersContainer, (id) => {
        service?.toggleFavorite(id);
    });
}

/**
 * Small helper to clear display area.
 * @returns {void}
 */
function clearContainer() {
    if (charactersContainer) charactersContainer.innerHTML = "";
}

/**
 * Render the list view of characters (preview cards).
 * @param {number} [page=1]
 * @returns {Promise<void>}
 */
async function listView(page = 1) {
    clearContainer();

    service?.loadList(page).then((characters) => {
        characters.forEach((/** @type {import("./character").Character} */ character) => {
            const preview = character.previewHTML();
            if (charactersContainer) charactersContainer.appendChild(preview);
        });
    });
}

/**
 * Render the detail view for a single character.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function detailView(id) {
    clearContainer();
    service?.loadById(id).then((character) => {
        const detail = character.detailsHTML();
        if (charactersContainer) charactersContainer.appendChild(detail);
    });
}

/**
 * Render search results for query `q`.
 * @param {string} q
 * @param {number} [page=1]
 * @returns {Promise<void>}
 */
async function searchView(q, page = 1) {
    clearContainer();
    try {
        service?.search(q, page).then((characters) => {
            console.log("Search results: ", characters);
            characters.forEach((/** @type {import("./character").Character} */ character) => {
                console.log("Rendering character: ", character);
                const preview = character.previewHTML();
                if (charactersContainer) charactersContainer.appendChild(preview);
            });
        });
    } catch (error) {
        console.error("Search failed: ", error);
        navigateToList();
    }
}

/**
 * Handle clicks on character cards and their overlays to navigate to detail views.
 */
function setupClickInterceptor() {
    if (!charactersContainer) return;
    charactersContainer.addEventListener("click", (ev) => {
        // Try overlay anchor first
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const overlay = ev.target.closest("a.character-card-overlay");
        if (overlay && overlay.getAttribute("href")) {
            ev.preventDefault();
            const card = overlay.closest("[data-character-id]");
            const id = card ? card.getAttribute("data-character-id") : null;
            if (id) navigateToDetail(id);
            return;
        }

        // Or click on card element itself
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const card = ev.target.closest("[data-character-id]");
        if (card) {
            const id = card.getAttribute("data-character-id");
            if (id) {
                // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
                const fav = ev.target.closest(".favorite-icon");
                if (!fav) {
                    ev.preventDefault();
                    navigateToDetail(id);
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", initApp);


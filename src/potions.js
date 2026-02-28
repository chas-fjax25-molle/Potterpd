import { registerFavoriteIconClick } from "./favorite_icon";
import { EntityService } from "./entity_service";
import { EntityType } from "./favorites";
import { Potion } from "./potion";
import { createEntityRouter } from "./entity_router";
import { registerSearchCallback } from "./search_form";

/**
 * Container and service instances used across small helpers.
 * @type {HTMLElement | null}
 */
let listContainer = null;

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
        basePath: "/potions",
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
 * Ensure the potions container is present in the DOM.
 * @returns {boolean} true when container is found
 */
function ensureContainer() {
    listContainer = document.getElementById("list-container");
    if (!listContainer) {
        console.error("Potions container element not found.");
        return false;
    }
    return true;
}

/**
 * Initialize the PotionService instance.
 * @returns {void}
 */
function setupService() {
    service = new EntityService({
        category: "potions",
        fromJson: Potion.fromJson,
        entityType: EntityType.POTION,
        favoritesTypeKey: "potion",
    });
}

/**
 * Wire favorite icon delegated handler.
 * @returns {void}
 */
function setupFavoriteHandler() {
    if (!listContainer || !service) return;

    registerFavoriteIconClick(listContainer, (id) => {
        service?.toggleFavorite(id);
    });
}

/**
 * Small helper to clear display area.
 * @returns {void}
 */
function clearContainer() {
    if (listContainer) listContainer.innerHTML = "";
}

/**
 * Render the list view of potions (preview cards).
 * @param {number} [page=1]
 * @returns {Promise<void>}
 */
async function listView(page = 1) {
    clearContainer();

    if (!listContainer) return;

    const list = document.createElement("ul");
    list.classList.add("preview-list");

    service?.loadList(page).then((potions) => {
        potions.forEach((/** @type {import("./potion").Potion} */ potion) => {
            const preview = potion.previewHTML();
            if (listContainer) list.appendChild(preview);
        });
        listContainer?.appendChild(list);
    });
}

/**
 * Render the detail view for a single potion.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function detailView(id) {
    clearContainer();
    service?.loadById(id).then((potion) => {
        const detail = potion.detailsHTML();
        if (listContainer) listContainer.appendChild(detail);
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
    if (!listContainer) return;

    const list = document.createElement("ul");
    list.classList.add("preview-list");

    try {
        service?.search(q, page).then((potions) => {
            console.log("Search results: ", potions);
            potions.forEach((/** @type {import("./potion").Potion} */ potion) => {
                console.log("Rendering potion: ", potion);
                const preview = potion.previewHTML();
                list.appendChild(preview);
            });
            listContainer?.appendChild(list);
        });
    } catch (error) {
        console.error("Search failed: ", error);
        navigateToList();
    }
}

/**
 * Handle clicks on potion cards and their overlays to navigate to detail views.
 */
function setupClickInterceptor() {
    if (!listContainer) return;
    listContainer.addEventListener("click", (ev) => {
        // Handle back button click
        // @ts-ignore - TS doesn't know about closest() on EventTarget
        const backButton = ev.target.closest(".back-button");
        if (backButton) {
            ev.preventDefault();
            navigateToList();
            return;
        }

        // Try overlay anchor first
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const overlay = ev.target.closest("a.card-overlay");
        if (overlay && overlay.getAttribute("href")) {
            ev.preventDefault();
            const card = overlay.closest("[data-potion-id]");
            const id = card ? card.getAttribute("data-potion-id") : null;
            if (id) navigateToDetail(id);
            return;
        }

        // Or click on card element itself
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const card = ev.target.closest("[data-potion-id]");
        if (card) {
            const id = card.getAttribute("data-potion-id");
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

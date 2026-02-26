import { registerFavoriteIconClick } from "./favorite_icon";
import { EntityService } from "./entity_service";
import { EntityType } from "./favorites";
import { Spell } from "./spell";
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
        basePath: "/spells",
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
 * Ensure the spells container is present in the DOM.
 * @returns {boolean} true when container is found
 */
function ensureContainer() {
    listContainer = document.getElementById("list-container");
    if (!listContainer) {
        console.error("Spells container element not found.");
        return false;
    }

    
    return true;
}

/**
 * Initialize the SpellService instance.
 * @returns {void}
 */
function setupService() {
    service = new EntityService({
        category: "spells",
        fromJson: Spell.fromJson,
        entityType: EntityType.SPELL,
        favoritesTypeKey: "spell",
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
 * Render the list view of spells (preview cards).
 * @param {number} [page=1]
 * @returns {Promise<void>}
 */
async function listView(page = 1) {
    clearContainer();

    if (!listContainer) return;

    // Create a proper semantic list wrapper
    const list = document.createElement("ul");
    list.classList.add("preview-list");

    service?.loadList(page).then((spells) => {
        spells.forEach((/** @type {import("./spell").Spell} */ spell) => {
            const preview = spell.previewHTML(); // returns <li>
            list.appendChild(preview); // ✅ now li is inside ul
        });

        listContainer?.appendChild(list);
    });
}

/**
 * Render the detail view for a single spell.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function detailView(id) {
    clearContainer();
    service?.loadById(id).then((spell) => {
        const detail = spell.detailsHTML();
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
        service?.search(q, page).then((spells) => {
            spells.forEach((/** @type {import("./spell").Spell} */ spell) => {
                const preview = spell.previewHTML();
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
 * Handle clicks on spell cards and their overlays to navigate to detail views.
 */
function setupClickInterceptor() {
    if (!listContainer) return;
    listContainer.addEventListener("click", (ev) => {
        // Try overlay anchor first
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const overlay = ev.target.closest("a.card-overlay");
        if (overlay && overlay.getAttribute("href")) {
            ev.preventDefault();
            const card = overlay.closest("[data-spell-id]");
            const id = card ? card.getAttribute("data-spell-id") : null;
            if (id) navigateToDetail(id);
            return;
        }

        // Or click on card element itself
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const card = ev.target.closest("[data-spell-id]");
        if (card) {
            const id = card.getAttribute("data-spell-id");
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

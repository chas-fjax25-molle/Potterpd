// @ts-ignore
import "./styles/base.css";
// @ts-ignore
import "./styles/layout.css";
// @ts-ignore
import "./styles/components.css";
// @ts-ignore
import "./styles/responsive.css";
// @ts-ignore
import "./styles/themes.css";
import "./styles/themes";
// @ts-ignore
import "./spell_layout.css";

import { registerFavoriteIconClick } from "./favorite_icon";
import { SpellService } from "./spell_service";

/**
 * Container and service instances used across small helpers.
 * @type {HTMLElement | null}
 */
let spellsContainer = null;

/**
 * @type {SpellService | null}
 */
let service = null;

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
    setupSearchHandler();
    setupPopstateListener();
    initRouter();
}

/**
 * Ensure the spells container is present in the DOM.
 * @returns {boolean} true when container is found
 */
function ensureContainer() {
    spellsContainer = document.getElementById("spells-container");
    if (!spellsContainer) {
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
    service = new SpellService();
}

/**
 * Wire favorite icon delegated handler.
 * @returns {void}
 */
function setupFavoriteHandler() {
    if (!spellsContainer || !service) return;

    registerFavoriteIconClick(spellsContainer, (id) => {
        service?.toggleFavorite(id);
    });
}

/**
 * Small helper to clear display area.
 * @returns {void}
 */
function clearContainer() {
    if (spellsContainer) spellsContainer.innerHTML = "";
}

/**
 * Render the list view of spells (preview cards).
 * @param {number} [page=1]
 * @returns {Promise<void>}
 */
async function listView(page = 1) {
    clearContainer();

    service?.loadSpells(page).then((spells) => {
        spells.forEach((/** @type {import("./spell").Spell} */ spell) => {
            const preview = spell.previewHTML();
            if (spellsContainer) spellsContainer.appendChild(preview);
        });
    });
}

/**
 * Render the detail view for a single spell.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function detailView(id) {
    clearContainer();
    service?.loadSpellById(id).then((spell) => {
        const detail = spell.detailsHTML();
        if (spellsContainer) spellsContainer.appendChild(detail);
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
        service?.searchSpells(q, page).then((spells) => {
            console.log("Search results: ", spells);
            spells.forEach((/** @type {import("./spell").Spell} */ spell) => {
                console.log("Rendering spell: ", spell);
                const preview = spell.previewHTML();
                if (spellsContainer) spellsContainer.appendChild(preview);
            });
        });
    } catch (error) {
        console.error("Search failed: ", error);
        navigateToList();
    }
}

/**
 * Navigate to the list view and update the history state.
 * @returns {void}
 */
function navigateToList() {
    history.pushState({}, "", "/spells");
    listView();
}

/**
 * Navigate to a detail view for a spell id and update history.
 * @param {string} id
 * @returns {void}
 */
function navigateToDetail(id) {
    history.pushState({ id }, "", "?id=" + encodeURIComponent(id));
    detailView(id);
}

/**
 * Navigate to search results for query `q` and update history.
 * @param {string} q
 * @returns {void}
 */
function navigateToSearch(q) {
    history.pushState({ s: q }, "", "?s=" + encodeURIComponent(q));
    searchView(q);
}

/**
 * Initialize router by reading URLSearchParams and routing to the appropriate view.
 * @returns {void}
 */
function initRouter() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    const sParam = params.get("s");

    if (idParam) {
        detailView(idParam);
    } else if (sParam) {
        searchView(sParam);
    } else {
        listView();
    }
}

/**
 * Attach popstate listener to support back/forward.
 * @returns {void}
 */
function setupPopstateListener() {
    window.addEventListener("popstate", () => {
        initRouter();
    });
}

/**
 * Handle clicks on spell cards and their overlays to navigate to detail views.
 */
function setupClickInterceptor() {
    if (!spellsContainer) return;
    spellsContainer.addEventListener("click", (ev) => {
        // Try overlay anchor first
        // @ts-ignore - TS doesn't know about closest() and getAttribute() on EventTarget
        const overlay = ev.target.closest("a.spell-card-overlay");
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

/**
 * Expose programmatic search helper for external code to trigger searches.
 * @throws Will throw an error if the search container or its elements are not found.
 */
function setupSearchHandler() {
    const searchContainer = document.getElementsByClassName("search-container")[0];
    if (!searchContainer) throw new Error("Search container not found");
    const button = searchContainer.querySelector("button");
    const input = searchContainer.querySelector("input");
    if (!button || !input) throw new Error("Search button or input not found");

    button.addEventListener("click", () => {
        const query = input.value.trim();
        if (query) navigateToSearch(query);
    });
}

document.addEventListener("DOMContentLoaded", initApp);

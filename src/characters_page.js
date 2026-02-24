import { Character } from "./character.js";
import EntityService from "./entity_service.js";
import { EntityType } from "./favorites.js";
import { registerSearchCallback } from "./search_form.js";

/**
 * @type {EntityService | null}
 */
let service = null;

function initApp() {
    setupService();
    // TODO(Pontus)
    //addEventListenerSearch();
    registerSearchCallback((q) => {
        service?.search(q, 1).then(renderCharacters);
    });
}

/**
 * Initialize the SpellService instance.
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
/*
async function addEventListenerSearch() {
    const searchForm = document.getElementById("searchForm");
    if (searchForm === null) {
        console.error("Element with id 'searchForm' not found.");
        return;
    }
    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form values
        // eslint-disable-next-line quotes
        const searchInput = document.querySelector('input[type="text"]');
        const searchValue =
            (searchInput instanceof HTMLInputElement ? searchInput.value : "") || "";
        const pageNumber = 1; // Default page number

        service?.search(searchValue, pageNumber).then(renderCharacters);
    });
}*/

/**
 * @param {Character[]} characters
 */
export function renderCharacters(characters) {
    const mainSection = document.getElementById("character-previews");
    // Clear the existing content
    if (mainSection) {
        while (mainSection.firstChild) {
            mainSection.removeChild(mainSection.firstChild);
        }
    }
    characters.forEach(
        /**
         * @param {Character} character
         */
        (character) => {
            mainSection?.appendChild(character.previewHTML());
        }
    );
}

initApp();

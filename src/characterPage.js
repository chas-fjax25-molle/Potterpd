import { Character } from "./character.js";
import { getSearchBy } from "./RequestsFromAPI";


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
        const filterElement = document.getElementById("filter");
        const searchCategory =
            (filterElement instanceof HTMLSelectElement ? filterElement.value : "") || "";
        const pageNumber = 1; // Default page number

        // Call the function from RequestFromAPI.js
        renderCharacters(await getSearchBy(searchCategory, searchValue, pageNumber));
    });
}

addEventListenerSearch();


/**
 * @param {*} response
 */
export function renderCharacters(response) {
    const mainSection = document.getElementById("character-previews");
    /**
     * @type {Character[]}
     */
    const characters = response.data.map(Character.fromJson);
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

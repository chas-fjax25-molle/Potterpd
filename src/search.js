import { getSearchBy } from "./RequestsFromAPI";

function addEventListenerSearch() {
    const searchForm = document.getElementById("searchForm");
    if (searchForm === null) {
        console.error("Element with id 'searchForm' not found.");
        return;
    }
    searchForm.addEventListener("submit", function (event) {
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
        getSearchBy(searchCategory, searchValue, pageNumber);
    });
}

addEventListenerSearch();

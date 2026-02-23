/**
 * @file Functions for fetching data from the API.
 */

import { Character } from "./character";
import { renderCharacters } from "./charactersPage";

/**
 * @param {string} category
 * @param {number} pageNumber - The page number to fetch. Defaults to 1. 50 is the default number of results per page.
 * @returns {Promise<*>} - Category objects 50 results per page.
 */
export async function getCategory(category, pageNumber) {
    const defaultPage = 1;
    const pageNumberValue = pageNumber || defaultPage;

    const categoryUrl = `https://api.potterdb.com/v1/${category}?page[number]=${pageNumberValue}`;

    try {
        const response = await fetch(categoryUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

//console.log(getCategory("characters", 2));

/**
 * @param {string} category
 * @param {string} id
 * @returns {Promise<*>} - Specific object in category by id
 */
export async function getSpecific(category, id) {
    const specificUrl = `https://api.potterdb.com/v1/${category}/${id}`;

    try {
        const response = await fetch(specificUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

//console.log(getSpecific("books", "3e161309-4c3c-4094-9db9-a8dfe911de14"));

/**
 *
 * @param {string} category
 * @param {string} filterParameter
 * @param {string} filterValue
 * @param {number} pageNumber
 * @returns {Promise<*>} - Category objects filtered by filterParameter and filterValue, 50 results per page.
 */
export async function getCategoryFilteredBy(category, filterParameter, filterValue, pageNumber) {
    const defaultPage = 1;
    const pageNumberValue = pageNumber || defaultPage;

    const filterUrl = `https://api.potterdb.com/v1/${category}?filter[${filterParameter}]=${filterValue}&?page[number]=${pageNumberValue}`;

    try {
        const response = await fetch(filterUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

//console.log(getCategoryFilteredBy("characters", "name_cont", "Potter", 1));

/**
 * @param {string} searchCategory - Takes a string value
 * @param {string} searchValue - Takes a string value and searches in all the fields of the API
 * @param {number} pageNumber
 */
export async function getSearchBy(searchCategory, searchValue, pageNumber) {
    const defaultPage = 1;
    const pageNumberValue = pageNumber || defaultPage;

    console.log(searchCategory);
    console.log(searchValue);

    const filterUrl = `https://api.potterdb.com/v1/${searchCategory}?filter[name_cont]=${searchValue}&?page[number]=${pageNumberValue}`;

    try {
        const response = await fetch(filterUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);

        if (result && Array.isArray(result.data)) {
            /**
             * @type {Character[]}
             */
            const characters = result.data.map(Character.fromJson);
            renderCharacters(characters);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

//console.log(getSearchBy("boobs", "Phoenix", 1));

function addEventListenerSearch() {
    const searchForm = document.getElementById("searchForm");
    if (searchForm === null) {
        console.error("Element with id 'searchForm' not found.");
        return;
    }
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form values
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

/**
 * @file Functions for fetching data from the API.
 */

/**
 * @param {string} category
 * @param {number} pageNumber - The page number to fetch. Defaults to 1. 100 is the default number of results per page.
 * @returns {Promise<*>} - Category objects 100 results per page.
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
export async function getCategoryFilteredBy(category, filterParameter, filterValue, pageNumber = 1) {

    const filterUrl = `https://api.potterdb.com/v1/${category}?filter[${filterParameter}]=${filterValue}&?page[number]=${pageNumber}`;

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
 * 
 */
export async function getSearchBy(searchCategory, searchValue, pageNumber = 1) {
    
    return getCategoryFilteredBy(searchCategory, "name_cont", searchValue, pageNumber);
}

//console.log(getSearchBy("boobs", "Phoenix", 1));


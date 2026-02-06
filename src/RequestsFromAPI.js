/**
 * @param {string} category
 * @param {string} pageNumber - The page number to fetch. Defaults to 1. 50 is the default number of results per page.
 * @returns {Promise<*>}
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

console.log(getCategory("characters", "2"));
console.log(getCategory("characters", "1"));

/**
 * @param {string} category
 * @param {string} id
 * @returns {Promise<*>}
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

console.log(getSpecific("books", "3e161309-4c3c-4094-9db9-a8dfe911de14"));


/**
 * 
 * @param {string} category 
 * @param {string} filterParameter 
 * @param {string} filterValue
 * @param {string} pageNumber 
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

console.log(getCategoryFilteredBy("characters", "name_cont", "Potter", "1"));


/**
 * 
 * @param {string} filterValue - Takes a string value and searches in all the fields of the API
 * @param {string} pageNumber 
 */
export async function getSearchBy(filterValue, pageNumber) {
    const defaultPage = 1;
    const pageNumberValue = pageNumber || defaultPage;

    const filterUrl = `https://api.potterdb.com/v1/?filter[in_any]=${filterValue}&?page[number]=${pageNumberValue}`;

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

console.log(getSearchBy("Phoenix", "1"));

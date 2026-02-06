/**
 * @param {string} category
 * @returns {Promise<*>}
 */
export async function getCategory(category) {
    const categoryUrl = `https://api.potterdb.com/v1/${category}`;

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

console.log(getCategory("characters"));


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

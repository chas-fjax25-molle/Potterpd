import { getCategoryFilteredBy } from "./RequestsFromAPI";

/**
 * @param {Promise<*>} books
 */
let books = null;

/**
 * @type {HTMLElement | null}
 */
let container = null;

async function initApp() {
    ensureContainer();
    books = await getCategoryFilteredBy("books", "title_cont", "", 1);

    const generatedHTML = generateHTMLFromData(books, "data", "title");

    if (container) {
        // Initialize the HTML string
        container.innerHTML = generatedHTML;
    }
}

/**
 * Ensure the characters container is present in the DOM.
 * @returns {boolean} true when container is found
 */
function ensureContainer() {
    container = document.getElementById("books-container");
    if (!container) {
        console.error("Characters container element not found.");
        return false;
    }
    return true;
}

/**
 *
 * @param {*} data
 * @param {*} dataArrayKey
 * @param {*} titleKey
 * @returns
 */
function generateHTMLFromData(
    data,
    dataArrayKey = "data",
    titleKey = "title",
    imageExtensions = /\.(png|jpe?g|gif|svg)$/i
) {
    let html = "";

    // Check if the input is valid
    if (data && data[dataArrayKey] && Array.isArray(data[dataArrayKey])) {
        // Loop through each item in the array
        data[dataArrayKey].forEach((item) => {
            // Start a div for each item
            html += "<div class=\"item-container\">";

            // Add title (if available)
            if (titleKey in item.attributes) {
                html += `<h2>${item.attributes[titleKey]}</h2>`;
            }
            for (const key in item.attributes) {
                if (String(item.attributes[key]).match(imageExtensions)) {
                    html += `<img src="${item.attributes[key]}"
                    alt="${item.attributes[titleKey]} images" class="image" width="200"></img>`;
                }
            }

            // Loop through each attribute of the item
            for (let key in item.attributes) {
                if (Object.prototype.hasOwnProperty.call(item.attributes, key)) {
                    if (key !== titleKey && key !== "id" && key !== "type") {
                        // Avoiding redundant info like id and type
                        html += `<p><strong>${key}:</strong> ${item.attributes[key]}</p>`;
                    }
                }
            }

            // Close the div container for this item
            html += "</div>";
        });
    } else {
        html = "<p>No items provided.</p>";
    }

    return html;
}

initApp();

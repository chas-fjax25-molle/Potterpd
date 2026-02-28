import { getCategoryFilteredBy } from "./RequestsFromAPI";

/**
 * @param {Promise<*>} res
 */
let res = null;

/**
 * @type {HTMLElement | null}
 */
let container = null;

/**
 * @param {string} category
 */

export async function initApp(category) {
    ensureContainer();
    res = await getCategoryFilteredBy(category, "title_cont", "", 1);

    const generatedHTML = generateHTMLFromData(res, "data", "title");

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
    container = document.getElementById("main-container");
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
    nameKey = "name",
    imageExtensions = /\.(png|jpe?g|gif|svg)$/i,
    urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*(?<!\.(jpg|jpeg|png|gif|bmp|svg))$/i
) {
    let html = "";

    // Check if the input is valid
    if (data && data[dataArrayKey] && Array.isArray(data[dataArrayKey])) {
        // Loop through each item in the array
        data[dataArrayKey].forEach((item) => {
            // Start a div for each item
            html += "<div class=\"item-container\" onclick=\"this.classList.toggle('active')\" >";
            // Add title (if available)
            if (titleKey in item.attributes) {
                html += `<h3 id="heading">${item.attributes[titleKey]}</h3>`;
            }
            if (nameKey in item.attributes) {
                html += `<h3 id="heading">${item.attributes[nameKey]}</h3>`;
            }
            for (const key in item.attributes) {
                // Checks if attribute is an image
                if (String(item.attributes[key]).match(imageExtensions)) {
                    html += `<img src="${item.attributes[key]}"
                    alt="${item.attributes[titleKey]} image" class="image" width="200"></img>`;
                }
                // Checks so wanted data is made to be displayed as text
                if (
                    key !== titleKey &&
                    key !== nameKey &&
                    key !== "id" &&
                    key !== "type" &&
                    key !== "slug" &&
                    !String(item.attributes[key]).match(urlPattern) &&
                    !String(item.attributes[key]).match(imageExtensions)
                ) {
                    // Avoiding redundant info like id and type
                    html += `<p aria-label='${key}: ${item.attributes[key]}' ><strong>${key}:</strong> ${item.attributes[key]}</p>`;
                }
                // Checks if attribute is a link
                if (String(item.attributes[key]).match(urlPattern)) {
                    html += `<a href="${item.attributes[key]}" aria-label='Resource Link' >Resource Link</a>`;
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

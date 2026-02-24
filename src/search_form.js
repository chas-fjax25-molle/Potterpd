/**
 * @param {function(string): void} callback
 */
export function registerSearchCallback(callback) {
    const searchContainer = document.getElementsByClassName("search-container")[0];
    if (!searchContainer) throw new Error("Search container not found");
    const button = searchContainer.querySelector("button");
    const input = searchContainer.querySelector("input");
    if (!button || !input) throw new Error("Search button or input not found");

    button.addEventListener("click", (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) callback(query);
    });
}

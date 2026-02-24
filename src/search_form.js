/**
 * @param {function(string): void} callback
 */
export function registerSearchCallback(callback) {
    const form = document.querySelector(".search-container");
    if (!form) throw new Error("Search form not found");
    const input = form.querySelector("input");
    if (!input) throw new Error("Search input not found");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (q) callback(q);
    });
}

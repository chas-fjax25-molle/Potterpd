/**
 * Validate that a given URL is valid and uses https.
 *
 * @param {string|null} url
 * @returns {boolean} - True if the URL is valid and uses https, false otherwise.
 */
export function isURLValid(url) {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "https:";
    } catch {
        return false;
    }
}

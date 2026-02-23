import { EntityType, Favorites } from "./favorites";
import { getCategory, getCategoryFilteredBy } from "./RequestsFromAPI";
import { Potion } from "./potion";

export class PotionService {
    /**
     * Cache for loaded potions, keyed by potions ID.
     * @type {Map<string, Potion>}
     */
    #potions = new Map();

    /**
     * Load potions, either from cache or API.
     * @param {number} page
     */
    async loadpotions(page = 1) {
        let isOnline = navigator.onLine;
        let potions = [];
        if (isOnline) {
            console.log("Online: Fetching potions from API.");
            try {
                let result = await this.#loadFromAPI(page);
                if (result && result.length > 0) {
                    potions = result;
                }
            } catch (error) {
                console.error("Error fetching potions:", error);
            }
        } else {
            console.log("Offline: Loading potions from cache.");
        }
        if (potions.length == 0) {
            let favorites = Favorites.getInstance();
            potions = await favorites.getByType("potions");
        }
        this.#updateFavoriteStatus(potions);
        this.#cachePotions(potions);
        return potions;
    }

    /**
     * Load a specific potions by its ID.
     *
     * This method first checks the cache for the potions. If not found, it attempts to load it from either the API or the favorites.
     *
     * @param {string} potionId - The ID of the potions to load.
     * @returns {Promise<Potion>} A promise that resolves to the loaded potions instance.
     * @throws Will throw an error if the potions cannot be found in either the cache, API, or favorites.
     */
    async loadPotionById(potionId) {
        let potion = this.#potions.get(potionId);
        if (potion) return potion;

        if (navigator.onLine) {
            try {
                const response = await getCategory("potions", potionId);

                if (response?.data) {
                    const potion = Potion.fromJson(response.data);
                    this.#updateFavoriteStatus([potion]);
                    this.#cachePotions([potion]);
                    return potion;
                }
            } catch (error) {
                console.error("Failed to load potion from API: ", error);
            }
            // TODO(Vera): Load from either API or favorites
            // After loading, update the cache (see #cachepotions) and return the potion
        }

        const favorites = Favorites.getInstance();
        const favPotion = await favorites.getById(EntityType.POTION, potionId);

        if (favPotion) {
            this.#cachePotions([favPotion]);
            return favPotion;
        }

        throw new Error(`Potion ${potionId} not found`);
    }

    /**
     * Search for potions matching the given query.
     * @param {string} query - The search query.
     * @param {number} [page=1] - The page number for paginated results (optional).
     * @returns {Promise<Potion[]>} A promise that resolves to an array of matching potions instances.
     * @throws Will throw an error if the search cannot be performed while offline.
     */
    async searchPotions(query, page = 1) {
        if (!navigator.onLine) {
            console.warn("Cannot perform search while offline.");
            throw new Error("Offline: Search is not available.");
        }
        try {
            const response = await getCategoryFilteredBy(
                "potions",
                "name_cont",
                query,
                String(page)
            );
            console.log("API search response: ", response);
            if (response?.data) {
                console.log("API search results: ", response.data);
                const potions = response.data.map(Potion.fromJson);
                console.log("Mapped Potion instances: ", potions);
                this.#updateFavoriteStatus(potions);
                this.#cachePotions(potions);
                return potions;
            }
        } catch (error) {
            console.error("Search failed: ", error);
        }
        console.warn("Search returned no results.");
        return [];
    }

    /**
     * Toggle the favorite status of a potion by its ID. If the potion is currently a favorite, it will be removed from favorites; if it is not a favorite, it will be added to favorites. The updated favorites list is then stored persistently.
     * @param {string} potionId - The ID of the potion to toggle as a favorite.
     */
    toggleFavorite(potionId) {
        const potion = this.#potions.get(potionId);
        if (potion) {
            let favorites = Favorites.getInstance();
            if (favorites.has(potion)) {
                favorites.remove(potion);
            } else {
                favorites.add(potion);
            }
            favorites.store();
        }
    }

    async #loadFromAPI(page = 1) {
        return getCategory("potions", String(page)).then((response) => {
            if (response.data) {
                return response.data.map(Potion.fromJson);
            }
            return [];
        });
    }

    /**
     * Update the favorite status of the given potions based on the current favorites in the Favorites service.
     * @param {Potion[]} potions - An array of Potion instances whose favorite status should be updated.
     */
    #updateFavoriteStatus(potions) {
        let favorites = Favorites.getInstance();
        potions.forEach((potion) => {
            potion.isFavorite = favorites.has(potion);
        });
    }

    /**
     * Cache the given potions for future access.
     * @param {Potion[]} potions - An array of Potion instances to be cached, keyed by their ID for quick retrieval.
     */
    #cachePotions(potions) {
        potions.forEach((potion) => {
            this.#potions.set(potion.id, potion);
        });
    }
}

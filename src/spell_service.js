import { EntityType, Favorites } from "./favorites";
import { getCategory } from "./RequestsFromAPI";
import { Spell } from "./spell";

export class SpellService {
    /**
     * Cache for loaded spells, keyed by spell ID.
     * @type {Map<string, Spell>}
     */
    #spells = new Map();

    /**
     * Load spells, either from cache or API.
     * @param {number} page
     */
    async loadSpells(page = 1) {
        let isOnline = navigator.onLine;
        let spells = [];
        if (isOnline) {
            console.log("Online: Fetching spells from API.");
            try {
                let result = await this.#loadFromAPI(page);
                if (result && result.length > 0) {
                    spells = result;
                }
            } catch (error) {
                console.error("Error fetching spells:", error);
            }
        } else {
            console.log("Offline: Loading spells from cache.");
        }
        if (spells.length == 0) {
            let favorites = Favorites.getInstance();
            spells = await favorites.getByType("spell");
        }
        this.#updateFavoriteStatus(spells);
        this.#cacheSpells(spells);
        return spells;
    }

    /**
     * Load a specific spell by its ID.
     *
     * This method first checks the cache for the spell. If not found, it attempts to load it from either the API or the favorites.
     *
     * @param {string} spellId - The ID of the spell to load.
     * @returns {Promise<Spell>} A promise that resolves to the loaded Spell instance.
     * @throws Will throw an error if the spell cannot be found in either the cache, API, or favorites.
     */
    async loadSpellById(spellId) {
        let spell = this.#spells.get(spellId);
        if (spell) return spell;

        if (navigator.onLine) {
            try {
                const response = await getCategory("spells", spellId);

                if (response?.data) {
                    spell = Spell.fromJson(response.data);
                    this.#updateFavoriteStatus([spell]);
                    this.#cacheSpells([spell]);
                    return spell;
                }
            } catch (error) {
                console.error("Failed to load spell from API: ", error);
            }
            // TODO(Vera): Load from either API or favorites
            // After loading, update the cache (see #cacheSpells) and return the spell
        }

        const favorites = Favorites.getInstance();
        const favSpell = await favorites.getById(EntityType.SPELL, spellId);

        if (favSpell) {
            this.#cacheSpells([favSpell]);
            return favSpell;
        }

        throw new Error(`Spell ${spellId} not found`);
    }

    /**
     * Toggle the favorite status of a spell by its ID. If the spell is currently a favorite, it will be removed from favorites; if it is not a favorite, it will be added to favorites. The updated favorites list is then stored persistently.
     * @param {string} spellId - The ID of the spell to toggle as a favorite.
     */
    toggleFavorite(spellId) {
        const spell = this.#spells.get(spellId);
        if (spell) {
            let favorites = Favorites.getInstance();
            if (favorites.has(spell)) {
                favorites.remove(spell);
            } else {
                favorites.add(spell);
            }
            favorites.store();
        }
    }

    async #loadFromAPI(page = 1) {
        return getCategory("spells", String(page)).then((response) => {
            if (response.data) {
                return response.data.map(Spell.fromJson);
            }
            return [];
        });
    }

    /**
     * Update the favorite status of the given spells based on the current favorites in the Favorites service.
     * @param {Spell[]} spells - An array of Spell instances whose favorite status should be updated.
     */
    #updateFavoriteStatus(spells) {
        let favorites = Favorites.getInstance();
        spells.forEach((spell) => {
            spell.isFavorite = favorites.has(spell);
        });
    }

    /**
     * Cache the given spells for future access.
     * @param {Spell[]} spells - An array of Spell instances to be cached, keyed by their ID for quick retrieval.
     */
    #cacheSpells(spells) {
        spells.forEach((spell) => {
            this.#spells.set(spell.id, spell);
        });
    }
}

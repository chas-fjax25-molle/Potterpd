import { Favorites } from "./favorites";
import { getCategory, getCategoryFilteredBy } from "./RequestsFromAPI";

/**
 * @typedef {Object} EntityAdapter
 * @property {string} category - API category, e.g. 'spells'
 * @property {Function} fromJson - Function that maps API JSON to a model instance
 * @property {any} entityType - EntityType enum value used by Favorites.getById
 * @property {string} [favoritesTypeKey] - Optional string key used by Favorites.getByType (e.g. 'spell')
 */

/**
 * Generic service for loading entities from the PotterDB API, with caching and favorites support.
 * The service is designed to be reusable across different entity types (spells, characters, etc.) by providing an adapter.
 *
 * Examples of usage:
 *
 * // For spells:
 * const spellService = new EntityService({
 *   category: 'spells',
 *   fromJson: Spell.fromJson,
 *   entityType: EntityType.SPELL,
 *   favoritesTypeKey: 'spell'
 * });
 *
 * spellService.loadList().then(spells => console.log(spells));
 * spellService.loadById('some-spell-id').then(spell => console.log(spell));
 * spellService.search('stun').then(results => console.log(results));
 * spellService.toggleFavorite('some-spell-id');
 */
export class EntityService {
    #entities = new Map();

    /**
     * @param {EntityAdapter} adapter
     */
    constructor(adapter) {
        if (!adapter || !adapter.category || !adapter.fromJson) {
            throw new Error(
                "GenericEntityService requires an adapter with `category` and `fromJson`"
            );
        }
        this.adapter = adapter;
    }

    /**
     * Load a paginated list of entities. Falls back to favorites when offline or API returns empty.
     * @param {number} [page=1] Optional page number for API pagination.
     * @returns {Promise<any[]>}
     */
    async loadList(page = 1) {
        const isOnline = navigator.onLine;
        let items = [];

        if (isOnline) {
            try {
                const result = await this.#loadFromAPI(page);
                if (result && result.length > 0) items = result;
            } catch (err) {
                console.error("Error fetching list from API:", err);
            }
        } else {
            console.log("Offline: will load from favorites if available.");
        }

        if (items.length === 0) {
            const favorites = Favorites.getInstance();
            const typeKey = this.adapter.favoritesTypeKey || this._deriveFavoritesKey();
            items = await favorites.getByType(typeKey);
        }

        this.#updateFavoriteStatus(items);
        this.#cacheEntities(items);
        return items;
    }

    /**
     * Load a single entity by ID. Tries cache -> API -> favorites.
     *
     * @param {string} id - The ID of the entity to load.
     * @returns {Promise<any>} - The loaded entity instance.
     * @throws Will throw an error if the entity cannot be found in cache, API, or favorites.
     */
    async loadById(id) {
        const cached = this.#entities.get(id);
        if (cached) return cached;

        if (navigator.onLine) {
            try {
                // TODO: consider implementing a getSpecific in RequestsFromAPI for cleaner API calls by ID
                const response = await getCategory(this.adapter.category, id);
                if (response?.data) {
                    const entity = this.adapter.fromJson(response.data);
                    this.#updateFavoriteStatus([entity]);
                    this.#cacheEntities([entity]);
                    return entity;
                }
            } catch (err) {
                console.error(`Failed to load ${this.adapter.category} from API:`, err);
            }
        }

        const favorites = Favorites.getInstance();
        const fav = await favorites.getById(this.adapter.entityType, id);
        if (fav) {
            this.#cacheEntities([fav]);
            return fav;
        }

        throw new Error(`${this.adapter.category} ${id} not found`);
    }

    /**
     * Search entities via API. Throws when offline.
     * @param {string} query - The search query string.
     * @param {number} [page=1] - Optional page number for API pagination.
     * @returns {Promise<any[]>} - Array of matching entities.
     * @throws Will throw an error if search is attempted while offline.
     */
    async search(query, page = 1) {
        if (!navigator.onLine) {
            console.warn("Cannot perform search while offline.");
            throw new Error("Offline: Search is not available.");
        }

        try {
            const response = await getCategoryFilteredBy(
                this.adapter.category,
                "name_cont",
                query,
                page
            );
            if (response?.data) {
                const items = response.data.map(this.adapter.fromJson);
                this.#updateFavoriteStatus(items);
                this.#cacheEntities(items);
                return items;
            }
        } catch (err) {
            console.error("Search failed:", err);
        }

        return [];
    }

    /**
     * Toggle favorite for an entity id.
     * @param {string} id
     */
    toggleFavorite(id) {
        const entity = this.#entities.get(id);
        if (!entity) return;

        const favorites = Favorites.getInstance();
        if (favorites.has(entity)) {
            favorites.remove(entity);
        } else {
            favorites.add(entity);
        }
        favorites.store();
    }

    async #loadFromAPI(page = 1) {
        return getCategory(this.adapter.category, page).then((response) => {
            if (response?.data) return response.data.map(this.adapter.fromJson);
            return [];
        });
    }

    /**
     * @param {any[]} items
     */
    #updateFavoriteStatus(items) {
        const favorites = Favorites.getInstance();
        items.forEach((it) => {
            try {
                it.isFavorite = favorites.has(it);
            } catch {
                it.isFavorite = false;
            }
        });
    }

    /**
     * @param {any[]} items
     */
    #cacheEntities(items) {
        items.forEach((it) => {
            if (it && it.id) this.#entities.set(it.id, it);
        });
    }

    _deriveFavoritesKey() {
        // default: 'spells' -> 'spell'
        if (!this.adapter.category) return this.adapter.category;
        if (this.adapter.category.endsWith("s")) return this.adapter.category.slice(0, -1);
        return this.adapter.category;
    }
}

export default EntityService;

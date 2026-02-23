import { Character } from "./character";
import { Potion } from "./potion";

/**
 * Entity types enum for type-safe favorites management.
 * @readonly
 * @enum {string}
 */
export const EntityType = Object.freeze({
    CHARACTER: "character",
    BOOK: "book",
    MOVIE: "movie",
    SPELL: "spell",
    POTION: "potion",
});

/**
 * Storage and management of user favorites.
 * Uses singleton pattern and in-memory cache with localStorage persistence.
 *
 * Example usage:
 * const favorites = Favorites.getInstance();
 * favorites.add(new Character(...));
 * favorites.add(EntityType.BOOK, { id: "123", title: "Harry Potter and the Sorcerer's Stone" });
 * console.log(favorites.getCharacters());
 * console.log(favorites.getBooks());
 * favorites.store(); // Manually trigger save to localStorage
 * favorites.load(); // Manually load from localStorage
 * favorites.clear(); // Clear all favorites
 * favorites.clearByType(EntityType.CHARACTER); // Clear only character favorites
 *
 * Note: The add() and remove() methods can be called with either the item itself (which must have an 'id' property)
 * or with the type and item/id. The getByType() method returns class instances, not raw JSON.
 */
export class Favorites {
    /**
     * Singleton instance of the Favorites class.
     * @type {Favorites|null}
     */
    static #instance = null;

    /**
     * Internal storage for favorites, categorized by type.
     * @type {Map<string, any[]>}
     */
    #favorites = new Map();

    /**
     * Flag indicating if favorites have been modified since last save.
     * @type {boolean}
     */
    #dirty = false;

    /**
     * Timer for debounced auto-save.
     * @type {ReturnType<typeof setTimeout>|null}
     */
    #saveTimer = null;

    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() {
        // Initialize storage for all entity types
        this.#favorites.set(EntityType.CHARACTER, []);
        this.#favorites.set(EntityType.BOOK, []);
        this.#favorites.set(EntityType.MOVIE, []);
        this.#favorites.set(EntityType.SPELL, []);
        this.#favorites.set(EntityType.POTION, []);

        // Set up auto-save on page unload
        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () => this.store());
            document.addEventListener("visibilitychange", () => {
                if (document.hidden && this.#dirty) {
                    this.store();
                }
            });
        }
    }

    /**
     * Get the singleton instance of the Favorites class.
     * @returns {Favorites} The singleton instance.
     */
    static getInstance() {
        if (!Favorites.#instance) {
            Favorites.#instance = new Favorites();
            Favorites.#instance.load();
        }
        return Favorites.#instance;
    }

    /**
     * Get the EntityType enum value for a given class instance.
     * @param {any} item - The class instance.
     * @returns {string} The corresponding EntityType value.
     */
    #getEntityType(item) {
        const className = item.constructor.name;
        /** @type {Record<string, string>} */
        const typeMap = {
            Character: EntityType.CHARACTER,
            Book: EntityType.BOOK,
            Movie: EntityType.MOVIE,
            Spell: EntityType.SPELL,
            Potion: EntityType.POTION,
        };
        const type = typeMap[className];
        if (!type) {
            throw new Error(`Unknown class type: ${className}`);
        }
        return type;
    }

    /**
     * Add an item to favorites.
     * Can be called as:
     * - add(item) - automatically determines type from class
     * - add(type, item) - explicitly specify type
     * @param {string|any} typeOrItem - Entity type from EntityType enum, or the item itself.
     * @param {any} [item] - The item to add (if first param is type). Must have an 'id' property.
     */
    add(typeOrItem, item) {
        let type;
        let itemToAdd;

        // Determine if called with (item) or (type, item)
        if (item === undefined) {
            // Called as add(item)
            itemToAdd = typeOrItem;
            type = this.#getEntityType(itemToAdd);
        } else {
            // Called as add(type, item)
            type = typeOrItem;
            itemToAdd = item;
        }

        if (!itemToAdd || !itemToAdd.id) {
            throw new Error("Invalid item: Item must have an 'id' property.");
        }

        const items = this.#favorites.get(type);
        if (!items) {
            throw new Error(`Invalid type: ${type}`);
        }

        // Check if item already exists
        if (!items.find((i) => i.id === itemToAdd.id)) {
            items.push(itemToAdd);
            this.#dirty = true;
            this.#scheduleSave();
        }
    }

    /**
     * Remove an item from favorites.
     * Can be called as:
     * - remove(item) - automatically determines type from class
     * - remove(type, id) - explicitly specify type and id
     * @param {string|any} typeOrItem - Entity type from EntityType enum, or the item itself.
     * @param {string} [id] - The ID of the item to remove (if first param is type).
     * @returns {boolean} True if item was removed, false if not found.
     */
    remove(typeOrItem, id) {
        let type;
        let itemId;

        // Determine if called with (item) or (type, id)
        if (id === undefined) {
            // Called as remove(item)
            const item = typeOrItem;
            if (!item || !item.id) {
                throw new Error("Invalid item: Item must have an 'id' property.");
            }
            type = this.#getEntityType(item);
            itemId = item.id;
        } else {
            // Called as remove(type, id)
            type = typeOrItem;
            itemId = id;
        }

        const items = this.#favorites.get(type);
        if (!items) {
            throw new Error(`Invalid type: ${type}`);
        }

        const index = items.findIndex((i) => i.id === itemId);
        if (index !== -1) {
            items.splice(index, 1);
            this.#dirty = true;
            this.#scheduleSave();
            return true;
        }
        return false;
    }

    /**
     * Check if an item is in favorites.
     * Can be called as:
     * - has(item) - automatically determines type from class
     * - has(type, id) - explicitly specify type and id
     * @param {string|any} typeOrItem - Entity type from EntityType enum, or the item itself.
     * @param {string} [id] - The ID of the item to check (if first param is type).
     * @returns {boolean} True if item is in favorites.
     */
    has(typeOrItem, id) {
        let type;
        let itemId;

        // Determine if called with (item) or (type, id)
        if (id === undefined) {
            // Called as has(item)
            const item = typeOrItem;
            if (!item || !item.id) {
                return false;
            }
            type = this.#getEntityType(item);
            itemId = item.id;
        } else {
            // Called as has(type, id)
            type = typeOrItem;
            itemId = id;
        }

        const items = this.#favorites.get(type);
        return items ? items.some((i) => i.id === itemId) : false;
    }

    /**
     * Get all favorites of a specific type.
     * Returns class instances (e.g., Character objects), not raw JSON.
     * @param {string} type - Entity type from EntityType enum.
     * @returns {any[]} Array of favorite class instances of the specified type.
     */
    getByType(type) {
        const items = this.#favorites.get(type);
        if (!items) {
            throw new Error(`Invalid type: ${type}`);
        }
        return [...items]; // Return a copy to prevent external modification
    }

    /**
     * Get all favorites across all types.
     * Returns class instances (e.g., Character, Book objects), not raw JSON.
     * @returns {any[]} Array of all favorite class instances.
     */
    getAll() {
        const all = [];
        for (const items of this.#favorites.values()) {
            all.push(...items);
        }
        return all;
    }

    /**
     * Get total count of favorites.
     * @returns {number} Total number of favorite items.
     */
    getCount() {
        let count = 0;
        for (const items of this.#favorites.values()) {
            count += items.length;
        }
        return count;
    }

    /**
     * Get count of favorites by type.
     * @param {string} type - Entity type from EntityType enum.
     * @returns {number} Number of favorite items of the specified type.
     */
    getCountByType(type) {
        const items = this.#favorites.get(type);
        return items ? items.length : 0;
    }

    /**
     * Clear all favorites.
     */
    clear() {
        for (const key of this.#favorites.keys()) {
            this.#favorites.set(key, []);
        }
        this.#dirty = true;
        this.store();
    }

    /**
     * Clear favorites of a specific type.
     * @param {string} type - Entity type from EntityType enum.
     */
    clearByType(type) {
        if (!this.#favorites.has(type)) {
            throw new Error(`Invalid type: ${type}`);
        }
        this.#favorites.set(type, []);
        this.#dirty = true;
        this.#scheduleSave();
    }

    /**
     * Convenience method: Get all character favorites.
     * @returns {Character[]} Array of favorite characters.
     */
    getCharacters() {
        return this.getByType(EntityType.CHARACTER);
    }

    /**
     * Convenience method: Get all book favorites.
     * @returns {any[]} Array of favorite books.
     */
    getBooks() {
        return this.getByType(EntityType.BOOK);
    }

    /**
     * Convenience method: Get all movie favorites.
     * @returns {any[]} Array of favorite movies.
     */
    getMovies() {
        return this.getByType(EntityType.MOVIE);
    }

    /**
     * Convenience method: Get all spell favorites.
     * @returns {any[]} Array of favorite spells.
     */
    getSpells() {
        return this.getByType(EntityType.SPELL);
    }

    /**
     * Convenience method: Get all potion favorites.
     * @returns {any[]} Array of favorite potions.
     */
    getPotions() {
        return this.getByType(EntityType.POTION);
    }

    /**
     * Schedule a debounced save to disk.
     */
    #scheduleSave() {
        if (this.#saveTimer) {
            clearTimeout(this.#saveTimer);
        }
        this.#saveTimer = setTimeout(() => this.store(), 1000);
    }

    /**
     * Store the current favorites to localStorage.
     */
    store() {
        if (!this.#dirty) return;

        try {
            /** @type {Record<string, any[]>} */
            const serialized = {};
            for (const [type, items] of this.#favorites.entries()) {
                serialized[type] = items.map((item) => {
                    // Store the item in its API JSON format for proper deserialization
                    const jsonData = this.#serializeItem(item);
                    return {
                        type: item.constructor.name,
                        data: jsonData,
                    };
                });
            }
            localStorage.setItem("favorites", JSON.stringify(serialized));
            this.#dirty = false;
        } catch (error) {
            console.error("Failed to store favorites:", error);
        }
    }

    /**
     * Serialize an item to the format expected by its fromJson method.
     * Converts plain objects back to API JSON structure.
     * @param {any} item - The item to serialize.
     * @returns {any} The serialized item in API JSON format.
     */
    #serializeItem(item) {
        // Check that the class has a serialize method
        if (typeof item.serialize === "function") {
            return item.serialize();
        } else {
            throw new Error(
                `Item of type ${item.constructor.name} does not have a serialize() method.`
            );
        }
    }

    /**
     * Load favorites from localStorage.
     */
    load() {
        try {
            const stored = localStorage.getItem("favorites");
            if (!stored) return;

            const serialized = JSON.parse(stored);

            for (const [type, items] of Object.entries(serialized)) {
                if (this.#favorites.has(type)) {
                    const deserializedItems = /** @type {any[]} */ (items).map((item) =>
                        this.#deserializeItem(/** @type {any} */ (item))
                    );
                    this.#favorites.set(type, deserializedItems);
                }
            }
            this.#dirty = false;
        } catch (error) {
            console.error("Failed to load favorites:", error);
        }
    }

    /**
     * Deserialize an item from storage using its type information.
     * @param {{type: string, data: any}} serializedItem - Object with 'type' and 'data' properties.
     * @returns {any} The deserialized item.
     */
    #deserializeItem(serializedItem) {
        const { type, data } = serializedItem;

        // Factory pattern for deserialization
        /** @type {Record<string, (data: any) => any>} */
        const deserializers = {
            Character: Character.fromJson,
            // TODO: Add other entity types here
            // Book: Book.fromJson,
            // Movie: Movie.fromJson,
            // Spell: Spell.fromJson,
            Potion: Potion.fromJson,
        };

        const deserializer = deserializers[type];
        if (!deserializer) {
            console.warn(`No deserializer found for type: ${type}`);
            return data; // Return raw data as fallback
        }

        return deserializer(data);
    }

    /**
     * Reset the singleton instance (for testing purposes only).
     *
     * Note: This method is intended for testing and should not be used in production code.
     */
    static resetInstance() {
        Favorites.#instance = null;
    }
}

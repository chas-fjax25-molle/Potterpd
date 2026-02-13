import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Favorites, EntityType } from "../../src/favorites.js";
import { Character } from "../../src/character.js";

/**
 * Mock localStorage for testing
 */
const localStorageMock = (() => {
    /** @type {Record<string, string>} */
    let store = {};

    return {
        /**
         * @param {string} key
         * @returns {string|null}
         */
        getItem: (key) => store[key] || null,
        /**
         * @param {string} key
         * @param {string} value
         */
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        /**
         * @param {string} key
         */
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        length: 0,
        /**
         * @param {number} _index
         * @returns {string|null}
         */
        // eslint-disable-next-line no-unused-vars
        key: (_index) => null,
    };
})();

// Mock window and document for auto-save tests
// @ts-ignore - Simplified mock for testing
globalThis.window = { addEventListener: vi.fn() };
// @ts-ignore - Simplified mock for testing
globalThis.document = { addEventListener: vi.fn() };
// @ts-ignore - Simplified mock for testing
globalThis.localStorage = localStorageMock;

/**
 * Create a mock character for testing
 * @param {string} id
 * @param {string} name
 * @returns {Character}
 */
function createMockCharacter(id, name) {
    const character = new Character();
    character.id = id;
    character.name = name;
    character.type = "character";
    character.house = "Gryffindor";
    return character;
}

describe("Favorites", () => {
    /** @type {Favorites} */
    let favorites;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorageMock.clear();
        // Reset singleton instance
        // @ts-ignore - Accessing private static for testing
        Favorites["_Favorites__instance"] = null;
        favorites = new Favorites();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("add()", () => {
        it("should add a character using object reference", async () => {
            const character = createMockCharacter("1", "Harry Potter");

            favorites.add(character);
            const characters = await favorites.getCharacters();
            expect(favorites.getCount()).toBe(1);
            expect(characters).toHaveLength(1);
            expect(characters[0].id).toBe("1");
            expect(characters[0].name).toBe("Harry Potter");
        });

        it("should add a character using explicit type", async () => {
            const character = createMockCharacter("2", "Hermione Granger");

            favorites.add(EntityType.CHARACTER, character);
            const characters = await favorites.getCharacters();
            expect(favorites.getCount()).toBe(1);
            expect(characters).toHaveLength(1);
            expect(characters[0].name).toBe("Hermione Granger");
        });

        it("should not add duplicate characters", () => {
            const character = createMockCharacter("1", "Harry Potter");

            favorites.add(character);
            favorites.add(character);

            expect(favorites.getCount()).toBe(1);
        });

        it("should add multiple different characters", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            const ron = createMockCharacter("3", "Ron Weasley");

            favorites.add(harry);
            favorites.add(hermione);
            favorites.add(ron);

            expect(favorites.getCount()).toBe(3);
            expect(await favorites.getCharacters()).toHaveLength(3);
        });

        it("should throw error for item without id", () => {
            const invalidCharacter = new Character();
            invalidCharacter.name = "No ID Character";

            expect(() => favorites.add(invalidCharacter)).toThrow(
                "Invalid item: Item must have an 'id' property."
            );
        });
    });

    describe("remove()", () => {
        it("should remove a character using object reference", () => {
            const character = createMockCharacter("1", "Harry Potter");
            favorites.add(character);

            const removed = favorites.remove(character);

            expect(removed).toBe(true);
            expect(favorites.getCount()).toBe(0);
        });

        it("should remove a character using type and id", () => {
            const character = createMockCharacter("1", "Harry Potter");
            favorites.add(character);

            const removed = favorites.remove(EntityType.CHARACTER, "1");

            expect(removed).toBe(true);
            expect(favorites.getCount()).toBe(0);
        });

        it("should return false when removing non-existent character", () => {
            const removed = favorites.remove(EntityType.CHARACTER, "999");

            expect(removed).toBe(false);
        });

        it("should only remove the specified character", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            favorites.remove(harry);

            expect(favorites.getCount()).toBe(1);
            expect((await favorites.getCharacters())[0].name).toBe("Hermione Granger");
        });

        it("should throw error for item without id when using object reference", () => {
            const invalidCharacter = new Character();

            expect(() => favorites.remove(invalidCharacter)).toThrow(
                "Invalid item: Item must have an 'id' property."
            );
        });
    });

    describe("has()", () => {
        it("should return true for favorited character using object reference", () => {
            const character = createMockCharacter("1", "Harry Potter");
            favorites.add(character);

            expect(favorites.has(character)).toBe(true);
        });

        it("should return true for favorited character using type and id", () => {
            const character = createMockCharacter("1", "Harry Potter");
            favorites.add(character);

            expect(favorites.has(EntityType.CHARACTER, "1")).toBe(true);
        });

        it("should return false for non-favorited character", () => {
            const character = createMockCharacter("1", "Harry Potter");

            expect(favorites.has(character)).toBe(false);
            expect(favorites.has(EntityType.CHARACTER, "1")).toBe(false);
        });

        it("should return false for item without id", () => {
            const invalidCharacter = new Character();

            expect(favorites.has(invalidCharacter)).toBe(false);
        });
    });

    describe("getByType()", () => {
        it("should return all characters", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            const characters = await favorites.getByType(EntityType.CHARACTER);

            expect(characters).toHaveLength(2);
            expect(characters[0]).toBeInstanceOf(Character);
            expect(characters[1]).toBeInstanceOf(Character);
        });

        it("should return empty array for type with no favorites", async () => {
            const books = await favorites.getByType(EntityType.BOOK);

            expect(books).toHaveLength(0);
        });

        it("should return a copy of the array", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            favorites.add(harry);

            const characters1 = favorites.getByType(EntityType.CHARACTER);
            const characters2 = favorites.getByType(EntityType.CHARACTER);

            expect(characters1).not.toBe(characters2);
            expect(characters1).toEqual(characters2);
        });

        it("should throw error for invalid type", async () => {
            await expect(favorites.getByType("invalid-type")).rejects.toThrow(
                "Invalid type: invalid-type"
            );
        });
    });

    describe("getCharacters()", () => {
        it("should return all character favorites", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            const characters = await favorites.getCharacters();

            expect(characters).toHaveLength(2);
            expect(characters[0].name).toBe("Harry Potter");
            expect(characters[1].name).toBe("Hermione Granger");
        });
    });

    describe("getAll()", () => {
        it("should return all favorites across all types", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            const all = favorites.getAll();

            expect(all).toHaveLength(2);
        });

        it("should return empty array when no favorites", () => {
            const all = favorites.getAll();

            expect(all).toHaveLength(0);
        });
    });

    describe("getCount()", () => {
        it("should return 0 when no favorites", () => {
            expect(favorites.getCount()).toBe(0);
        });

        it("should return correct count", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            expect(favorites.getCount()).toBe(2);
        });
    });

    describe("getCountByType()", () => {
        it("should return 0 for type with no favorites", () => {
            expect(favorites.getCountByType(EntityType.CHARACTER)).toBe(0);
        });

        it("should return correct count for type", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            expect(favorites.getCountByType(EntityType.CHARACTER)).toBe(2);
            expect(favorites.getCountByType(EntityType.BOOK)).toBe(0);
        });
    });

    describe("clear()", () => {
        it("should clear all favorites", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            const hermione = createMockCharacter("2", "Hermione Granger");
            favorites.add(harry);
            favorites.add(hermione);

            favorites.clear();

            expect(favorites.getCount()).toBe(0);
        });
    });

    describe("clearByType()", () => {
        it("should clear only favorites of specified type", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            favorites.add(harry);

            favorites.clearByType(EntityType.CHARACTER);

            expect(favorites.getCountByType(EntityType.CHARACTER)).toBe(0);
        });

        it("should throw error for invalid type", () => {
            expect(() => favorites.clearByType("invalid-type")).toThrow(
                "Invalid type: invalid-type"
            );
        });
    });

    describe("store() and load()", () => {
        it("should persist favorites to localStorage", () => {
            const harry = createMockCharacter("1", "Harry Potter");
            favorites.add(harry);

            favorites.store();

            const stored = localStorageMock.getItem("favorites");
            expect(stored).toBeTruthy();

            const parsed = JSON.parse(/** @type {string} */ (stored));
            expect(parsed.character).toBeDefined();
            expect(parsed.character).toHaveLength(1);
        });

        it("should load favorites from localStorage", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            favorites.add(harry);
            favorites.store();

            // Create new instance and load
            const newFavorites = new Favorites();
            newFavorites.load();

            expect(newFavorites.getCount()).toBe(1);
            expect((await newFavorites.getCharacters())[0].id).toBe("1");
            expect((await newFavorites.getCharacters())[0].name).toBe("Harry Potter");
        });

        it("should deserialize characters as Character instances", async () => {
            const harry = createMockCharacter("1", "Harry Potter");
            favorites.add(harry);
            favorites.store();

            const newFavorites = new Favorites();
            newFavorites.load();

            const characters = await newFavorites.getCharacters();
            expect(characters[0]).toBeInstanceOf(Character);
        });

        it("should handle empty localStorage", () => {
            const newFavorites = new Favorites();
            newFavorites.load();

            expect(newFavorites.getCount()).toBe(0);
        });

        it("should not store if not dirty", () => {
            const setItemSpy = vi.spyOn(localStorageMock, "setItem");

            favorites.store();

            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("getInstance()", () => {
        it("should return singleton instance", () => {
            // Use a fresh instance, not singleton
            const instance1 = new Favorites();
            const instance2 = new Favorites();

            // They are different instances
            expect(instance1).not.toBe(instance2);

            // But getInstance returns the same one
            const singleton1 = Favorites.getInstance();
            const singleton2 = Favorites.getInstance();
            expect(singleton1).toBe(singleton2);
        });

        it("should load from localStorage when a new instance is created", async () => {
            // Store data to localStorage first
            const harry = createMockCharacter("1", "Harry Potter");
            const tempFavorites = new Favorites();
            tempFavorites.add(harry);
            tempFavorites.store();

            Favorites.resetInstance();

            // Create new instance which should load from localStorage
            const newFavorites = Favorites.getInstance();
            expect(newFavorites).not.toBe(tempFavorites); // They are different instances

            expect(newFavorites.getCount()).toBe(1);
            expect((await newFavorites.getCharacters())[0].id).toBe("1");
            expect((await newFavorites.getCharacters())[0].name).toBe("Harry Potter");
        });
    });

    describe("Favorites minimal store/load", () => {
        it("should store to localStorage and load into a new instance", async () => {
            // Arrange: create and store
            const harry = createMockCharacter("1", "Harry Potter");
            const fav1 = new Favorites();
            fav1.add(harry);
            fav1.store();

            // Act: create a new instance and load
            const fav2 = new Favorites();
            fav2.load();

            // Assert
            expect(fav2.getCount()).toBe(1);
            expect((await fav2.getCharacters())[0].id).toBe("1");
            expect((await fav2.getCharacters())[0].name).toBe("Harry Potter");
        });
    });
});

/**
 * @file Character entity representation and HTML generation.
 */

import { isURLValid } from "./utils";

/**
 * CSS styles for the Character entity.
 * @constant {Object} CSS - CSS styles for the Character entity.
 */
const CSS = Object.freeze({
    // Favorite icon class
    FAVORITE_ICON_CLASS: "character-favorite-icon",

    // Preview card classes
    PREVIEW_CARD_CLASS: "character-preview-card",
    PREVIEW_NAME_CLASS: "character-preview-name",
    PREVIEW_IMAGE_CONTAINER_CLASS: "character-preview-image-container",
    PREVIEW_IMAGE_CLASS: "character-preview-image",
    PREVIEW_PLACEHOLDER_CLASS: "character-preview-placeholder",

    // Details card classes
    DETAILS_CARD_CLASS: "character-details-card",
    DETAILS_NAME_CLASS: "character-details-name",
    DETAILS_IMAGE_CONTAINER_CLASS: "character-details-image-container",
    DETAILS_IMAGE_CLASS: "character-details-image",
    DETAILS_PLACEHOLDER_CLASS: "character-details-placeholder",
    DETAILS_ALIAS_NAMES_CLASS: "character-details-alias-names",
    // Fact classes
    DETAILS_FACTS_CONTAINER_CLASS: "character-details-facts",

    // Class for individual character fact
    DETAILS_FACT_CLASS: "character-details-fact",
    /**
     * Class for individual character fact item
     *
     * Used for facts that are single items (not lists)
     * Well be added as three classes:
     * 1. character-details-fact
     * 2. character-details-fact-{fact-name}
     * 3. character-details-fact-item
     */
    DETAILS_FACT_ITEM_CLASS: "character-details-fact-item",
    /**
     * Class for character facts that take the form of a list
     *
     * Used for facts that are lists (e.g., family members, jobs, wands)
     * Will be added as three classes:
     * 1. character-details-fact
     * 2. character-details-fact-{fact-name}
     * 3. character-details-fact-list
     */
    DETAILS_FACT_LIST_CLASS: "character-details-fact-list",
});

/**
 * Constant for the width of the character image in the preview card.
 * Set to null to use the image's original width.
 *
 * @type {number|null}
 */
const PREVIEW_IMAGE_WIDTH = 200;
/**
 * Constant for the width of the character image in the details card.
 * Set to null to use the image's original width.
 *
 * @type {number|null}
 */
const DETAILS_IMAGE_WIDTH = 300;

/**
 * @typedef {Object} CharacterAttributes
 * @property {string} slug
 * @property {string[]} alias_names
 * @property {string|null} animagus
 * @property {string} blood_status
 * @property {string|null} boggart
 * @property {string|null} born
 * @property {string|null} died
 * @property {string|null} eye_color
 * @property {string[]} family_members
 * @property {string} gender
 * @property {string} hair_color
 * @property {string} height
 * @property {string} house
 * @property {string|null} image
 * @property {string[]} jobs
 * @property {string} marital_status
 * @property {string} name
 * @property {string} nationality
 * @property {string} patronus
 * @property {string[]} romances
 * @property {string} skin_color
 * @property {string} species
 * @property {string[]} titles
 * @property {string[]} wands
 * @property {string} weight
 * @property {string} wiki
 */

/**
 * @typedef {Object} CharacterJSON
 * @property {string} id - Unique identifier for the character
 * @property {string} type - Type of the entity (character)
 * @property {CharacterAttributes} attributes - Attributes of the character
 */

export class Character {
    /**
     * @type {string} id - Unique identifier for the character
     */
    id = "";
    /**
     * @type {string} type - Type of the entity (character)
     */
    type = "";
    /**
     * @type {string} slug - Slug identifier for the character
     */
    slug = "";
    /**
     * @type {string[]} alias_names - Alias names of the character
     */
    alias_names = [];
    /**
     * @type {string|null} animagus - Animagus form of the character
     */
    animagus = null;
    /**
     * @type {string} blood_status - Blood status of the character
     */
    blood_status = "";
    /**
     * @type {string|null} boggart - Boggart form of the character
     */
    boggart = null;
    /**
     * @type {string|null} born - Birth information of the character
     */
    born = null;
    /**
     * @type {string|null} died - Death information of the character
     */
    died = null;
    /**
     * @type {string|null} eye_color - Eye color of the character
     */
    eye_color = null;
    /**
     * @type {string[]} family_members - Family members of the character
     */
    family_members = [];
    /**
     * @type {string} gender - Gender of the character
     */
    gender = "";
    /**
     * @type {string} hair_color - Hair color of the character
     */
    hair_color = "";
    /**
     * @type {string} height - Height of the character
     */
    height = "";
    /**
     * @type {string} house - House of the character
     */
    house = "";
    /**
     * @type {string|null} image - Image URL of the character
     */
    image = null;
    /**
     * @type {string[]} jobs - Jobs of the character
     */
    jobs = [];
    /**
     * @type {string} marital_status - Marital status of the character
     */
    marital_status = "";
    /**
     * @type {string} name - Name of the character
     */
    name = "";
    /**
     * @type {string} nationality - Nationality of the character
     */
    nationality = "";
    /**
     * @type {string} patronus - Patronus of the character
     */
    patronus = "";
    /**
     * @type {string[]} romances - Romances of the character
     */
    romances = [];
    /**
     * @type {string} skin_color - Skin color of the character
     */
    skin_color = "";
    /**
     * @type {string} species - Species of the character
     */
    species = "";
    /**
     * @type {string[]} titles - Titles of the character
     */
    titles = [];
    /**
     * @type {string[]} wands - Wands of the character
     */
    wands = [];
    /**
     * @type {string} weight - Weight of the character
     */
    weight = "";
    /**
     * @type {string} wiki - Wiki URL of the character
     */
    wiki = "";

    /**
     * Creates a Character instance from a JSON structure.
     *
     * @param {CharacterJSON} jsonStruct - The JSON structure representing a character.
     * @returns {Character} - The created Character instance.
     *
     * @throws {Error} - If the JSON structure is invalid.
     */
    static fromJson(jsonStruct) {
        const character = new Character();
        character.id = jsonStruct.id;
        character.type = jsonStruct.type;
        if (!jsonStruct.attributes) {
            throw new Error("Invalid JSON structure: Missing attributes");
        }
        /** @type {CharacterAttributes} */
        const attributes = jsonStruct.attributes;

        character.slug = attributes.slug;
        character.alias_names = attributes.alias_names;
        character.animagus = attributes.animagus;
        character.blood_status = attributes.blood_status;
        character.boggart = attributes.boggart;
        character.born = attributes.born;
        character.died = attributes.died;
        character.eye_color = attributes.eye_color;
        character.family_members = attributes.family_members;
        character.gender = attributes.gender;
        character.hair_color = attributes.hair_color;
        character.height = attributes.height;
        character.house = attributes.house;
        character.image = attributes.image;
        character.jobs = attributes.jobs;
        character.marital_status = attributes.marital_status;
        character.name = attributes.name;
        character.nationality = attributes.nationality;
        character.patronus = attributes.patronus;
        character.romances = attributes.romances;
        character.skin_color = attributes.skin_color;
        character.species = attributes.species;
        character.titles = attributes.titles;
        character.wands = attributes.wands;
        character.weight = attributes.weight;
        character.wiki = attributes.wiki;
        return character;
    }

    /**
     * Create a preview card HTML element for the character.
     *
     * @returns {HTMLElement} - The HTML representation of the character.
     */
    previewHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.PREVIEW_CARD_CLASS);
        container.id = this.id;
        const header = document.createElement("h3");
        header.classList.add(CSS.PREVIEW_NAME_CLASS);
        header.textContent = this.name;
        container.appendChild(header);
        container.appendChild(this.#favoriteIcon());
        container.appendChild(this.#characterImageSmall());
        return container;
    }

    /**
     * Create a detailed card HTML element for the character.
     *
     * @returns {HTMLElement} - The detailed HTML representation of the character.
     */
    detailsHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.DETAILS_CARD_CLASS);
        container.id = this.id;
        const header = document.createElement("h2");
        header.classList.add(CSS.DETAILS_NAME_CLASS);
        header.textContent = this.name;
        container.appendChild(header);
        container.appendChild(this.#favoriteIcon());
        container.appendChild(this.#characterImageLarge());
        if (this.alias_names.length > 0) {
            container.appendChild(this.#characterAliasNames());
        }
        container.appendChild(this.#factsContainer());
        return container;
    }

    /**
     * Generate the favorite icon HTML element.
     *
     * @returns {HTMLElement} - The favorite icon HTML element.
     */
    #favoriteIcon() {
        const favoriteIcon = document.createElement("span");
        favoriteIcon.classList.add(CSS.FAVORITE_ICON_CLASS);
        favoriteIcon.dataset.characterId = this.id;
        favoriteIcon.setAttribute("role", "button");
        favoriteIcon.setAttribute("aria-label", "Toggle Favorite");
        favoriteIcon.tabIndex = 0;
        favoriteIcon.textContent = "★";
        return favoriteIcon;
    }

    /**
     * Generates the HTML container for a small character image.
     *
     * @returns {HTMLElement} - The HTML container for the small character image.
     */
    #characterImageSmall() {
        const container = document.createElement("div");
        container.classList.add(CSS.PREVIEW_IMAGE_CONTAINER_CLASS);
        if (this.image && isURLValid(this.image)) {
            const imageElem = document.createElement("img");
            imageElem.classList.add(CSS.PREVIEW_IMAGE_CLASS);
            imageElem.src = this.image;
            imageElem.alt = `${this.name} image`;
            if (PREVIEW_IMAGE_WIDTH) {
                imageElem.width = PREVIEW_IMAGE_WIDTH;
            }
            container.appendChild(imageElem);
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add(CSS.PREVIEW_PLACEHOLDER_CLASS);
            placeholder.textContent = "No Image";
            container.appendChild(placeholder);
        }
        return container;
    }

    /**
     * Generates the HTML container for a large character image.
     *
     * @returns {HTMLElement} - The HTML container for the large character image.
     */
    #characterImageLarge() {
        const container = document.createElement("div");
        container.classList.add(CSS.DETAILS_IMAGE_CONTAINER_CLASS);
        if (this.image && isURLValid(this.image)) {
            const imageElem = document.createElement("img");
            imageElem.classList.add(CSS.DETAILS_IMAGE_CLASS);
            imageElem.src = this.image;
            imageElem.alt = `${this.name} image`;
            if (DETAILS_IMAGE_WIDTH) {
                imageElem.width = DETAILS_IMAGE_WIDTH;
            }
            container.appendChild(imageElem);
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add(CSS.DETAILS_PLACEHOLDER_CLASS);
            placeholder.textContent = "No Image";
            container.appendChild(placeholder);
        }
        return container;
    }

    /**
     * Helper function to generate a list section.
     *
     * @param {string} title - The title of the section.
     * @param {string[]} items - The items to include in the list.
     * @param {string} emptyMessage - The message to display if the list is empty.
     * @param {string} className - The fact class name, will be appended to the section class.
     *
     * @returns {HTMLElement} - The HTML representation of the list section.
     */
    #generateFactListSection(title, items, emptyMessage, className) {
        const section = document.createElement("div");
        section.classList.add(CSS.DETAILS_FACT_CLASS);
        if (className) {
            section.classList.add(`${CSS.DETAILS_FACT_CLASS}-${className}`);
        }
        section.classList.add(CSS.DETAILS_FACT_LIST_CLASS);
        const header = document.createElement("h4");
        header.textContent = title;
        section.appendChild(header);
        if (items.length === 0) {
            const noItems = document.createElement("p");
            noItems.textContent = emptyMessage;
            section.appendChild(noItems);
        } else {
            const list = document.createElement("ul");
            items.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;
                list.appendChild(li);
            });
            section.appendChild(list);
        }
        return section;
    }

    /**
     * Generate a single fact item HTML element.
     * Will generate a fact item with the format "Title: Value". If the value is null, it will display "Title: Unknown".
     *
     * @param {string} title - The title of the fact (e.g., "House", "Patronus")
     * @param {string|null} value - The value of the fact (e.g., "Gryffindor", "Stag"). If null, "Unknown" will be displayed.
     * @param {string} className - The fact class name, will be appended to the fact item class.
     * @returns {HTMLElement}
     */
    #generateFactItem(title, value, className) {
        const factItem = document.createElement("p");
        factItem.classList.add(CSS.DETAILS_FACT_CLASS);
        if (className) {
            factItem.classList.add(`${CSS.DETAILS_FACT_CLASS}-${className}`);
        }
        factItem.classList.add(CSS.DETAILS_FACT_ITEM_CLASS);
        if (value) {
            factItem.textContent = `${title}: ${value}`;
        } else {
            factItem.textContent = `${title}: Unknown`;
        }
        return factItem;
    }

    /**
     * Generate HTML for the character's alias names.
     *
     * @returns {HTMLElement} - The HTML representation of the character's alias names.
     */
    #characterAliasNames() {
        const aliasNames = document.createElement("ul");
        aliasNames.classList.add(CSS.DETAILS_ALIAS_NAMES_CLASS);
        this.alias_names.forEach((alias) => {
            const li = document.createElement("li");
            li.textContent = alias;
            aliasNames.appendChild(li);
        });
        return aliasNames;
    }

    /**
     * Generates the HTML container for character facts.
     *
     * @returns {HTMLElement} - The HTML container for character facts.
     */
    #factsContainer() {
        const factsContainer = document.createElement("div");
        factsContainer.classList.add(CSS.DETAILS_FACTS_CONTAINER_CLASS);
        const factHeader = document.createElement("h3");
        factHeader.textContent = "Facts";
        factsContainer.appendChild(factHeader);
        factsContainer.appendChild(this.#houseHTML());
        factsContainer.appendChild(this.#familyMembersHTML());
        factsContainer.appendChild(this.#jobsHTML());
        factsContainer.appendChild(this.#wandsHTML());
        factsContainer.appendChild(this.#patronusHTML());
        factsContainer.appendChild(this.#boggartHTML());
        return factsContainer;
    }

    /**
     * Generate HTML for the character's house.
     *
     * @returns {HTMLElement} - The HTML representation of the character's house.
     */
    #houseHTML() {
        return this.#generateFactItem("House", this.house, "house");
    }

    /**
     * Generate HTML for the character's family members.
     *
     * @returns {HTMLElement} - The HTML representation of the character's family members.
     */
    #familyMembersHTML() {
        return this.#generateFactListSection(
            "Family Members",
            this.family_members,
            "No known family members.",
            "family-members"
        );
    }

    /**
     * Generate HTML for the character's jobs.
     *
     * @returns {HTMLElement} - The HTML representation of the character's jobs.
     */
    #jobsHTML() {
        return this.#generateFactListSection("Jobs", this.jobs, "No known jobs.", "jobs");
    }

    /**
     * Generate HTML for the character's wands.
     *
     * @returns {HTMLElement} - The HTML representation of the character's wands.
     */
    #wandsHTML() {
        return this.#generateFactListSection("Wands", this.wands, "No known wands.", "wands");
    }

    /**
     * Generate HTML for the character's patronus.
     *
     * @returns {HTMLElement} - The HTML representation of the character's patronus.
     */
    #patronusHTML() {
        return this.#generateFactItem("Patronus", this.patronus, "patronus");
    }

    /**
     * Generate HTML for the character's boggart.
     *
     * @returns {HTMLElement} - The HTML representation of the character's boggart.
     */
    #boggartHTML() {
        return this.#generateFactItem("Boggart", this.boggart, "boggart");
    }
}

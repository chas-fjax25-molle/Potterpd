/**
 * @file Character entity representation and HTML generation.
 */

import { isURLValid } from "./utils";
import { favoriteIcon } from "./favorite_icon";

/**
 * CSS styles for the Character entity.
 * @constant {Object} CSS - CSS styles for the Character entity.
 */
const CSS = Object.freeze({
    // Favorite icon class
    FAVORITE_ICON_CLASS: "character-favorite-icon",

    // Preview card classes
    PREVIEW_LIST: "preview-list",
    PREVIEW_ITEM: "preview-card-item",
    PREVIEW_CARD: "preview-card",
    PREVIEW_HEADER: "preview-card-header",
    PREVIEW_NAME: "preview-name",
    PREVIEW_IMAGE_CONTAINER: "preview-image-container",
    PREVIEW_IMAGE: "preview-image",
    PREIVEW_DETAIL: "preview-detail",
    CARD_OVERLAY: "card-overlay",

    // Details card classes
    DETAILS_CARD: "details-card",
    DETAILS_HEADER: "details-header",
    DETAILS_NAME: "details-name",
    DETAILS_TOP_WRAPPER: "details-top-wrapper",
    DETAILS_FIGURE: "details-figure",
    DETAILS_IMAGE_CONTAINER: "details-image-container",
    DETAILS_IMAGE: "details-image",
    DETAILS_GRID: "details-grid",
    DETAILS_LABEL: "details-label",
    DETAILS_VALUE: "details-value",
    DETAILS_EMPTY: "details-empty",

    IMAGE_PLACEHOLDER_OVERLAY: "image-placeholder-overlay",

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
     * Will be added as three classes:
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
    DETAILS_BACK_BUTTON_CLASS: "character-details-back-button",
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
 * importing the placeholder image for spells in the api missing an image.
 * @type {string|null}
 */
const PLACEHOLDER_IMAGE =
    import.meta.env.BASE_URL + "image-placeholders/spells-placeholder-image-200.webp";

/**
 * Utility: fixes long API words like "Apparition/Disapparition"
 * by allowing a break after slashes (WITHOUT changing visible text)
 * @param {string|null} text - Takes in the String value of the heading for the item
 * @returns {string|null} - Returns a formatted version of the heading
 *
 */
const formatWithWordBreaks = (text) => {
    if (!text) return "";
    return text.replaceAll("/", "/\u200B");
};

/**
 * @typedef {Object} CharacterAttributes
 * @property {string} slug
 * @property {string[]} alias_names
 * @property {string|null} animagus
 * @property {string|null} blood_status
 * @property {string|null} boggart
 * @property {string|null} born
 * @property {string|null} died
 * @property {string|null} eye_color
 * @property {string[]} family_members
 * @property {string|null} gender
 * @property {string|null} hair_color
 * @property {string|null} height
 * @property {string|null} house
 * @property {string|null} image
 * @property {string[]} jobs
 * @property {string|null} marital_status
 * @property {string} name
 * @property {string|null} nationality
 * @property {string|null} patronus
 * @property {string[]} romances
 * @property {string|null} skin_color
 * @property {string|null} species
 * @property {string[]} titles
 * @property {string[]} wands
 * @property {string|null} weight
 * @property {string|null} wiki
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
     * @type {boolean} isFavorite - Indicates whether the character is marked as a favorite
     */
    isFavorite = false;

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
     * @type {string|null} blood_status - Blood status of the character
     */
    blood_status = null;
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
     * @type {string|null} gender - Gender of the character
     */
    gender = null;
    /**
     * @type {string|null} hair_color - Hair color of the character
     */
    hair_color = null;
    /**
     * @type {string|null} height - Height of the character
     */
    height = null;
    /**
     * @type {string|null} house - House of the character
     */
    house = null;
    /**
     * @type {string|null} image - Image URL of the character
     */
    image = null;
    /**
     * @type {string[]} jobs - Jobs of the character
     */
    jobs = [];
    /**
     * @type {string|null} marital_status - Marital status of the character
     */
    marital_status = null;
    /**
     * @type {string} name - Name of the character
     */
    name = "";
    /**
     * @type {string|null} nationality - Nationality of the character
     */
    nationality = null;
    /**
     * @type {string|null} patronus - Patronus of the character
     */
    patronus = null;
    /**
     * @type {string[]} romances - Romances of the character
     */
    romances = [];
    /**
     * @type {string|null} skin_color - Skin color of the character
     */
    skin_color = null;
    /**
     * @type {string|null} species - Species of the character
     */
    species = null;
    /**
     * @type {string[]} titles - Titles of the character
     */
    titles = [];
    /**
     * @type {string[]} wands - Wands of the character
     */
    wands = [];
    /**
     * @type {string|null} weight - Weight of the character
     */
    weight = null;
    /**
     * @type {string|null} wiki - Wiki URL of the character
     */
    wiki = null;
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
        if (!jsonStruct.id || !jsonStruct.type) {
            throw new Error("Invalid JSON structure: Missing id or type");
        }
        character.id = jsonStruct.id;
        character.type = jsonStruct.type;

        if (!jsonStruct.attributes) {
            throw new Error("Invalid JSON structure: Missing attributes");
        }
        /** @type {CharacterAttributes} */
        const attributes = jsonStruct.attributes;

        character.slug = attributes.slug ?? "";
        character.alias_names = attributes.alias_names ?? [];
        character.animagus = attributes.animagus ?? null;
        character.blood_status = attributes.blood_status ?? null;
        character.boggart = attributes.boggart ?? null;
        character.born = attributes.born ?? null;
        character.died = attributes.died ?? null;
        character.eye_color = attributes.eye_color ?? null;
        character.family_members = attributes.family_members ?? [];
        character.gender = attributes.gender ?? null;
        character.hair_color = attributes.hair_color ?? null;
        character.height = attributes.height ?? null;
        character.house = attributes.house ?? null;
        character.image = attributes.image ?? null;
        character.jobs = attributes.jobs ?? [];
        character.marital_status = attributes.marital_status ?? null;
        if (!attributes.name) {
            throw new Error("Invalid JSON structure: Missing character name");
        }
        character.name = attributes.name;
        character.nationality = attributes.nationality ?? null;
        character.patronus = attributes.patronus ?? null;
        character.romances = attributes.romances ?? [];
        character.skin_color = attributes.skin_color ?? null;
        character.species = attributes.species ?? null;
        character.titles = attributes.titles ?? [];
        character.wands = attributes.wands ?? [];
        character.weight = attributes.weight ?? null;
        character.wiki = attributes.wiki ?? null;
        return character;
    }

    /**
     * Create a preview card HTML element for the character.
     *
     * @returns {HTMLElement} - The HTML representation of the character.
     */
    previewHTML() {
        const listItem = document.createElement("li");
        listItem.classList.add(CSS.PREVIEW_ITEM);

        const article = document.createElement("article");
        article.classList.add(CSS.PREVIEW_CARD);
        article.dataset.characterId = this.id;

        const titleId = `character-title-${this.id}`;
        article.setAttribute("aria-labelledby", titleId);

        const link = document.createElement("a");
        link.href = `/characters/${this.id}`;
        link.classList.add(CSS.CARD_OVERLAY);
        link.setAttribute("aria-labelledby", titleId);
        article.appendChild(link);

        const headerRow = document.createElement("div");
        headerRow.classList.add(CSS.PREVIEW_HEADER);

        const header = document.createElement("h3");
        header.id = titleId;
        header.classList.add(CSS.PREVIEW_NAME);

        header.textContent = formatWithWordBreaks(this.name);

        headerRow.appendChild(header);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));

        article.appendChild(headerRow);
        article.appendChild(this.#characterImageSmall());

        const detailElem = document.createElement("p");
        detailElem.classList.add(CSS.PREIVEW_DETAIL);
        detailElem.textContent = this.alias_names;

        article.appendChild(detailElem);
        listItem.appendChild(article);

        return listItem;
    }

    /**
     * Create a detailed card HTML element for the character.
     *
     * @returns {HTMLElement} - The detailed HTML representation of the character.
     */
    detailsHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.DETAILS_CARD);
        container.dataset.characterId = this.id;

        const topWrapper = document.createElement("div");
        topWrapper.classList.add(CSS.DETAILS_TOP_WRAPPER);

        const headerRow = document.createElement("div");
        headerRow.classList.add(CSS.DETAILS_HEADER);

        const title = document.createElement("h3");
        title.classList.add(CSS.DETAILS_NAME);
        title.textContent = this.name;

        const backButton = document.createElement("button");
        backButton.classList.add(CSS.DETAILS_BACK_BUTTON_CLASS);
        backButton.setAttribute("aria-label", "Back to characters list");
        backButton.textContent = "← Back";
        headerRow.appendChild(backButton);

        headerRow.appendChild(title);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));

        topWrapper.appendChild(headerRow);
        topWrapper.appendChild(this.#characterImageLarge());

        container.appendChild(topWrapper);

        // Info grid
        const infoGrid = document.createElement("div");
        infoGrid.classList.add(CSS.DETAILS_GRID);

        let hasAnyInfo = false;

        const addRow = (label, value) => {
            if (!value) return;

            hasAnyInfo = true;

            const labelElem = document.createElement("div");
            labelElem.classList.add(CSS.DETAILS_LABEL);
            labelElem.textContent = label;

            const valueElem = document.createElement("div");
            valueElem.classList.add(CSS.DETAILS_VALUE);
            valueElem.textContent = formatWithWordBreaks(value);

            infoGrid.appendChild(labelElem);
            infoGrid.appendChild(valueElem);
        };

        addRow("Slug", this.slug);
        addRow("Alias names", this.alias_names?.join(", "));
        addRow("Animagus", this.animagus);
        addRow("Blood status", this.blood_status);
        addRow("Boggart", this.boggart);
        addRow("Born", this.born);
        addRow("Died", this.died);
        addRow("Eye color", this.eye_color);
        addRow("Family members", this.family_members?.join(", "));
        addRow("Gender", this.gender);
        addRow("Hair color", this.hair_color);
        addRow("Height", this.height);
        addRow("House", this.house);
        addRow("Nationality", this.nationality);
        addRow("Patronus", this.patronus);
        addRow("Romances", this.romances?.join(", "));
        addRow("Skin color", this.skin_color);
        addRow("Species", this.species);
        addRow("Titles", this.titles?.join(", "));
        addRow("Wands", this.wands?.join(", "));
        addRow("Weight", this.weight);
        addRow("Marital status", this.marital_status);
        addRow("Jobs", this.jobs?.join(", "));
        addRow("Wiki", this.wiki);

        if (hasAnyInfo) {
            container.appendChild(infoGrid);
        } else {
            const emptyMsg = document.createElement("p");
            emptyMsg.classList.add("details-empty");
            emptyMsg.textContent = "No additional information available for this spell.";
            container.appendChild(emptyMsg);
        }

        return container;
    }

    /**
     * Serialize the character instance into a JSON structure for storage.
     * @returns {CharacterJSON} - The JSON structure representing the character.
     */
    serialize() {
        return {
            id: this.id,
            type: this.type,
            attributes: {
                slug: this.slug,
                alias_names: this.alias_names,
                animagus: this.animagus,
                blood_status: this.blood_status,
                boggart: this.boggart,
                born: this.born,
                died: this.died,
                eye_color: this.eye_color,
                family_members: this.family_members,
                gender: this.gender,
                hair_color: this.hair_color,
                height: this.height,
                house: this.house,
                image: this.image,
                jobs: this.jobs,
                marital_status: this.marital_status,
                name: this.name,
                nationality: this.nationality,
                patronus: this.patronus,
                romances: this.romances,
                skin_color: this.skin_color,
                species: this.species,
                titles: this.titles,
                wands: this.wands,
                weight: this.weight,
                wiki: this.wiki,
            },
        };
    }

    /**
     * Generates the HTML container for a small character image.
     *
     * @returns {HTMLElement} - The HTML container for the small character image.
     */
    #characterImageSmall() {
        const container = document.createElement("div");
        container.classList.add(CSS.PREVIEW_IMAGE_CONTAINER);
        const hasImage = this.image && isURLValid(this.image);

        const imageElem = document.createElement("img");
        imageElem.classList.add(CSS.PREVIEW_IMAGE);
        imageElem.src = hasImage ? this.image : PLACEHOLDER_IMAGE;
        imageElem.alt = `${this.name} image`;

        if (PREVIEW_IMAGE_WIDTH) {
            imageElem.width = PREVIEW_IMAGE_WIDTH;
        }
        container.appendChild(imageElem);

        if (!hasImage) {
            const overlay = document.createElement("div");
            overlay.classList.add("image-placeholder-overlay");
            overlay.textContent = "Missing image for this character!";
            container.appendChild(overlay);
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
        container.classList.add(CSS.DETAILS_IMAGE_CONTAINER);

        const hasRealImage = this.image && isURLValid(this.image);

        const imageElem = document.createElement("img");
        imageElem.classList.add(CSS.DETAILS_IMAGE);
        imageElem.src = hasRealImage ? this.image : PLACEHOLDER_IMAGE;
        imageElem.alt = `${this.name} image`;

        if (DETAILS_IMAGE_WIDTH) {
            imageElem.width = DETAILS_IMAGE_WIDTH;
        }

        container.appendChild(imageElem);

        if (!hasRealImage) {
            const overlay = document.createElement("div");
            overlay.classList.add("image-placeholder-overlay");
            overlay.textContent = "Missing image for this character!";
            container.appendChild(overlay);
        }

        return container;
    }
}

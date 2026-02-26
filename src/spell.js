/**
 * @file spell.js Spell class definition and HTML generation.
 */

import { favoriteIcon } from "./favorite_icon";
import { isURLValid } from "./utils";

/**
 * CSS styles used in the Spell entity.
 * @constant {Object} CSS - CSS styles for the Spell entity.
 */
const CSS = Object.freeze({
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

    IMAGE_PLACEHOLDER_OVERLAY: "image-placeholder-overlay"
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
 * @typedef {Object} SpellAttributes
 * @property {string} name - Name of the spell
 * @property {string} incantation - Incantation of the spell
 * @property {string} effect - Effect of the spell
 * @property {string} [image] - Optional image URL for the spell
 * @property {string} handmovement - Hand movement for the spell
 * @property {string} creator - Creator of the spell
 * @property {string} category - Category of the spell
 * @property {string} light - The light of a spell
 */

/**
 * @typedef {Object} SpellJSON
 * @property {string} id - Unique identifier for the spell
 * @property {string} type - Type of the object (should be "spells")
 * @property {SpellAttributes} attributes - Attributes of the spell
 */

export class Spell {
    /**
     * @type {string} id - Unique identifier for the spell
     */
    id = "";

    /**
     * @type {boolean} isFavorite - Indicates whether the spell is marked as a favorite
     */
    isFavorite = false;

    /**
     * @type {string} type - Type of the object (should be "spells")
     */
    type = "spell";

    /**
     * @type {string} name - Name of the spell
     */
    name = "";

    /**
     * @type {string} incantation - Incantation of the spell
     */
    incantation = "";

    /**
     * @type {string} effect - Effect of the spell
     */
    effect = "";

    /**
     * @type {string} handmovement - Hand movement of the spell
     */
    handmovement = "";

    /**
     * @type {string} creator - Creator of the spell
     */
    creator = "";

    /**
     * @type {string} category - Category of the spell
     */
    category = "";

    /**
     * @type {string} light - Light of the spell
     */
    light = "";

    /**
     * @type {string|null} image - Optional image URL for the spell
     */
    image = null;

    /**
     *
     * @param {SpellJSON} json - JSON object representing a spell
     * @returns {Spell} - An instance of the Spell class populated with data from the JSON object
     *
     * @throws {Error} Throws an error if the JSON object is missing required properties or if the properties are of incorrect types
     */
    static fromJson(json) {
        const spell = new Spell();
        if (!json.id || !json.type) {
            throw new Error("Invalid JSON: Missing required properties 'id' or 'type'");
        }
        if (json.type !== "spell") {
            throw new Error(`Invalid JSON: Expected type 'spell' but got '${json.type}'`);
        }

        spell.id = json.id || "";
        spell.type = json.type || "spell";

        if (!json.attributes) {
            throw new Error("Invalid JSON: Missing 'attributes' properties");
        }
        /** @type {SpellAttributes} */
        const attributes = json.attributes;

        spell.name = attributes.name || "";
        spell.incantation = attributes.incantation || "";
        spell.effect = attributes.effect || "";
        spell.image = attributes.image || null;
        spell.handmovement = attributes.handmovement || "";
        spell.creator = attributes.creator || "";
        spell.category = attributes.category || "";
        spell.light = attributes.light || "";

        return spell;
    }


    previewHTML() {
        const listItem = document.createElement("li");
        listItem.classList.add(CSS.PREVIEW_ITEM);

        const article = document.createElement("article");
        article.classList.add(CSS.PREVIEW_CARD);
        article.dataset.spellId = this.id;

        const titleId = `spell-title-${this.id}`;
        article.setAttribute("aria-labelledby", titleId);

        const link = document.createElement("a");
        link.href = `/spells/${this.id}`;
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
        article.appendChild(this.#spellImageSmall());

        const detailElem = document.createElement("p");
        detailElem.classList.add(CSS.PREIVEW_DETAIL);
        detailElem.textContent = this.effect;

        article.appendChild(detailElem);
        listItem.appendChild(article);

        return listItem;
    }

    detailsHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.DETAILS_CARD);
        container.dataset.spellId = this.id;

        const topWrapper = document.createElement("div");
        topWrapper.classList.add(CSS.DETAILS_TOP_WRAPPER);

        const headerRow = document.createElement("div");
        headerRow.classList.add(CSS.DETAILS_HEADER);

        const title = document.createElement("h3"); 
        title.classList.add(CSS.DETAILS_NAME);
        title.textContent = this.name;

        headerRow.appendChild(title);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));
        
        topWrapper.appendChild(headerRow);
        topWrapper.appendChild(this.#spellsImageLarge());

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

        addRow("Effect", this.effect);
        addRow("Incantation", this.incantation);
        addRow("Hand movement", this.handmovement);
        addRow("Creator", this.creator);
        addRow("Category", this.category);
        addRow("Light", this.light);

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

    serialize() {
        return {
            id: this.id,
            type: this.type,
            attributes: {
                name: this.name,
                incantation: this.incantation,
                effect: this.effect,
                image: this.image,
            },
        };
    }

    /**
     * Generates the HTML container for a small spell image.
     *
     * @returns {HTMLElement} - The HTML container for the small spell image.
     */
    #spellImageSmall() {
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
            overlay.textContent = "Missing image for this spell!";
            container.appendChild(overlay);
        }
        return container;
    }

    /**
     * Generates the HTML container for a large spell image.
     *
     * @returns {HTMLElement} - The HTML container for the large spell image.
     */
    #spellsImageLarge() {
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
            overlay.textContent = "Missing image for this spell!";
            container.appendChild(overlay);
        }

        return container;
    }
}

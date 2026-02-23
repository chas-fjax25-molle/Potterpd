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
    PREVIEW_CARD_CLASS: "spell-preview-card",
    PREVIEW_NAME_CLASS: "spell-preview-name",
    PREVIEW_IMAGE_CONTAINER_CLASS: "spell-preview-image-container",
    PREVIEW_IMAGE_CLASS: "spell-preview-image",
    PREVIEW_PLACEHOLDER_CLASS: "spell-preview-placeholder",
    PREIVEW_EFFECT_CLASS: "spell-preview-effect",
    SPELL_CARD_OVERLAY_CLASS: "spell-card-overlay",

    // Details card classes
    DETAILS_CARD_CLASS: "spell-details-card",
    DETAILS_NAME_CLASS: "spell-details-name",
    DETAILS_IMAGE_CONTAINER_CLASS: "spell-image-container",
    DETAILS_IMAGE_CLASS: "spell-details-image",
    DETAILS_PLACEHOLDER_CLASS: "spell-details-placeholder",
    DETAILS_EFFECT_CLASS: "spell-details-effect",
    DETAILS_INCANTATION_CLASS: "spell-details-incantation",
    DETAILS_HANDMOVEMENT_CLASS: "spell-details-handmovement",
    DETAILS_CREATOR_CLASS: "spell-details-creator",
    DETAILS_CATEGORY_CLASS: "spell-details-category",
    DETAILS_LIGHT_CLASS: "spell-details-light",
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
 */
const PLACEHOLDER_IMAGE =
    import.meta.env.BASE_URL + "image-placeholders/spells-placeholder-image-200.webp";

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
        const container = document.createElement("article");
        container.classList.add(CSS.PREVIEW_CARD_CLASS);
        container.dataset.spellId = this.id;

        const link = document.createElement("a");
        link.href = `/spells/${this.id}`;
        link.classList.add(CSS.SPELL_CARD_OVERLAY_CLASS);
        link.setAttribute("aria-label", `View details for ${this.name}`);
        container.appendChild(link);

        const headerRow = document.createElement("div");
        headerRow.classList.add("spell-preview-header");

        const header = document.createElement("h3");
        header.classList.add(CSS.PREVIEW_NAME_CLASS);
        header.textContent = this.name;

        headerRow.appendChild(header);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));

        container.appendChild(headerRow);
        container.appendChild(this.#spellImageSmall());

        const effectElem = document.createElement("p");
        effectElem.classList.add(CSS.PREIVEW_EFFECT_CLASS);
        effectElem.textContent = this.effect;

        container.appendChild(effectElem);

        return container;
    }

    detailsHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.DETAILS_CARD_CLASS);
        container.dataset.spellId = this.id;

        // Header row
        const headerRow = document.createElement("div");
        headerRow.classList.add("spell-details-header");

        const header = document.createElement("h2");
        header.classList.add(CSS.DETAILS_NAME_CLASS);
        header.textContent = this.name;

        headerRow.appendChild(header);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));
        container.appendChild(headerRow);

        // Image
        container.appendChild(this.#spellsImageLarge());

        // Info grid
        const infoGrid = document.createElement("div");
        infoGrid.classList.add("spell-details-grid");

        let hasAnyInfo = false;

        const addRow = (label, value) => {
            if (!value) return;

            hasAnyInfo = true;

            const labelElem = document.createElement("div");
            labelElem.classList.add("spell-details-label");
            labelElem.textContent = label;

            const valueElem = document.createElement("div");
            valueElem.classList.add("spell-details-value");
            valueElem.textContent = value;

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
            emptyMsg.classList.add("spell-details-empty");
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
        container.classList.add(CSS.PREVIEW_IMAGE_CONTAINER_CLASS);

        const hasImage = this.image && isURLValid(this.image);

        const imageElem = document.createElement("img");
        imageElem.classList.add(CSS.PREVIEW_IMAGE_CLASS);
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
        container.classList.add(CSS.DETAILS_IMAGE_CONTAINER_CLASS);

        const hasRealImage = this.image && isURLValid(this.image);

        const imageElem = document.createElement("img");
        imageElem.classList.add(CSS.DETAILS_IMAGE_CLASS);
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

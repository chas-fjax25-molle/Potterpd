/**
 * @file potion.js potion class definition and HTML generation.
 */

import { favoriteIcon } from "./favorite_icon";
import { isURLValid } from "./utils";

/**
 * CSS styles used in the potion entity.
 * @constant {Object} CSS - CSS styles for the potion entity.
 */

const CSS = Object.freeze({
    // Preview card classes
    PREVIEW_CARD_CLASS: "potion-preview-card",
    PREVIEW_NAME_CLASS: "potion-preview-name",
    PREVIEW_IMAGE_CONTAINER_CLASS: "potion-preview-image-container",
    PREVIEW_IMAGE_CLASS: "potion-preview-image",
    PREVIEW_PLACEHOLDER_CLASS: "potion-preview-placeholder",
    PREIVEW_EFFECT_CLASS: "potion-preview-effect",
    POTION_CARD_OVERLAY_CLASS: "potion-card-overlay",

    // Details card classes
    DETAILS_CARD_CLASS: "potion-details-card",
    DETAILS_NAME_CLASS: "potion-details-name",
    DETAILS_IMAGE_CONTAINER_CLASS: "potion-image-container",
    DETAILS_IMAGE_CLASS: "potion-details-image",
    DETAILS_PLACEHOLDER_CLASS: "potion-details-placeholder",
    DETAILS_EFFECT_CLASS: "potion-details-effect",
    DETAILS_CHARASTERISTICS_CLASS: "potion-details-characteristics",
    DETAILS_DIFFICULTY_CLASS: "potion-details-difficulty",
    DETAILS_INVENTORS_CLASS: "potion-details-inventors",
    DETAILS_MANUFACTURERS_CLASS: "potion-details-manufacturers",
    DETAILS_INGREDIENTS_CLASS: "potion-details-ingredients",
    DETAILS_SIDE_EFFECTS_CLASS: "potion-details-side-effects",
    DETAILS_BACK_BUTTON_CLASS: "potion-details-back-button",
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
 * importing the placeholder image for potions in the api missing an image.
 */
const PLACEHOLDER_IMAGE = "/image-placeholders/potions-placeholder-image-200.webp";

/**
 * @typedef {Object} PotionAttributes
 * @property {string} name - Name of the potion
 * @property {string} characteristics - Characteristics of the potion
 * @property {string} effect - Effect of the potion
 * @property {string} [image] - Optional image URL for the potion
 * @property {string} difficulty - Difficulty to brew the potion
 * @property {string} inventors - Inventors of the potion
 * @property {string} manufacturers - Manufacturers of the potion
 * @property {string} ingredients - Ingredients needed to brew the potion
 * @property {string} side_effects - Side effects of the potion
 */

/**
 * @typedef {Object} PotionJSON
 * @property {string} id - Unique identifier for the potion
 * @property {string} type - Type of the object (should be "potions")
 * @property {PotionAttributes} attributes - Attributes of the potion
 */

export class Potion {
    /**
     * @type {string} id - Unique identifier for the potion
     */
    id = "";

    /**
     * @type {boolean} isFavorite - Indicates whether the potion is marked as a favorite
     */
    isFavorite = false;

    /**
     * @type {string} type - Type of the object (should be "potions")
     */
    type = "potion";

    /**
     * @type {string} name - Name of the potion
     */
    name = "";

    /**
     * @type {string} characteristics - Characteristics of the potion
     */
    characteristics = "";

    /**
     * @type {string} effect - Effect of the potion
     */
    effect = "";

    /**
     * @type {string} difficulty - Difficulty to brew the potion
     */
    difficulty = "";

    /**
     * @type {string} inventors - Inventors of the potion
     */
    inventors = "";

    /**
     * @type {string} manufacturers - Manufacturers of the potion
     */
    manufacturers = "";

    /**
     * @type {string} ingredients - Ingredients needed to brew the potion
     */
    ingredients = "";

    /**
     * @type {string} side_effects - Side effects of the potion
     */
    side_effects = "";

    /**
     * @type {string|null} image - Optional image URL for the potion
     */
    image = null;

    /**
     *
     * @param {PotionJSON} json - JSON object representing a potion
     * @returns {Potion} - An instance of the Potion class populated with data from the JSON object
     *
     * @throws {Error} Throws an error if the JSON object is missing required properties or if the properties are of incorrect types
     */
    static fromJson(json) {
        const potion = new Potion();
        if (!json.id || !json.type) {
            throw new Error("Invalid JSON: Missing required properties 'id' or 'type'");
        }
        if (json.type !== "potion") {
            throw new Error(`Invalid JSON: Expected type 'potion' but got '${json.type}'`);
        }

        potion.id = json.id || "";
        potion.type = json.type || "potion";

        if (!json.attributes) {
            throw new Error("Invalid JSON: Missing 'attributes' properties");
        }
        /** @type {PotionAttributes} */
        const attributes = json.attributes;

        potion.name = attributes.name || "";
        potion.characteristics = attributes.characteristics || "";
        potion.effect = attributes.effect || "";
        potion.image = attributes.image || null;
        potion.difficulty = attributes.difficulty || "";
        potion.inventors = attributes.inventors || "";
        potion.manufacturers = attributes.manufacturers || "";
        potion.ingredients = attributes.ingredients || "";
        potion.side_effects = attributes.side_effects || "";

        return potion;
    }

    previewHTML() {
        const container = document.createElement("article");
        container.classList.add(CSS.PREVIEW_CARD_CLASS);
        container.dataset.potionId = this.id;

        const link = document.createElement("a");
        link.href = `/potions/${this.id}`;
        link.classList.add(CSS.POTION_CARD_OVERLAY_CLASS);
        link.setAttribute("aria-label", `View details for ${this.name}`);
        container.appendChild(link);

        const headerRow = document.createElement("div");
        headerRow.classList.add("potion-preview-header");

        const header = document.createElement("h3");
        header.classList.add(CSS.PREVIEW_NAME_CLASS);
        header.textContent = this.name;

        headerRow.appendChild(header);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));

        container.appendChild(headerRow);
        container.appendChild(this.#potionImageSmall());

        const effectElem = document.createElement("p");
        effectElem.classList.add(CSS.PREIVEW_EFFECT_CLASS);
        effectElem.textContent = this.effect;

        container.appendChild(effectElem);

        return container;
    }

    detailsHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.DETAILS_CARD_CLASS);
        container.dataset.potionId = this.id;

        // Header row
        const headerRow = document.createElement("div");
        headerRow.classList.add("potion-details-header");

        const backButton = document.createElement("button");
        backButton.classList.add(CSS.DETAILS_BACK_BUTTON_CLASS);
        backButton.setAttribute("aria-label", "Back to potions list");
        backButton.textContent = "← Back";
        headerRow.appendChild(backButton);

        const header = document.createElement("h2");
        header.classList.add(CSS.DETAILS_NAME_CLASS);
        header.textContent = this.name;

        headerRow.appendChild(header);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));
        container.appendChild(headerRow);

        // Image
        container.appendChild(this.#potionsImageLarge());

        // Info grid
        const infoGrid = document.createElement("div");
        infoGrid.classList.add("potion-details-grid");

        let hasAnyInfo = false;

        const addRow = (label, value) => {
            if (!value) return;

            hasAnyInfo = true;

            const labelElem = document.createElement("div");
            labelElem.classList.add("potion-details-label");
            labelElem.textContent = label;

            const valueElem = document.createElement("div");
            valueElem.classList.add("potion-details-value");
            valueElem.textContent = value;

            infoGrid.appendChild(labelElem);
            infoGrid.appendChild(valueElem);
        };

        addRow("Effect", this.effect);
        addRow("Characteristics", this.characteristics);
        addRow("Difficulty", this.difficulty);
        addRow("Inventors", this.inventors);
        addRow("Manufacturers", this.manufacturers);
        addRow("Ingredients", this.ingredients);
        addRow("Side Effects", this.side_effects);

        if (hasAnyInfo) {
            container.appendChild(infoGrid);
        } else {
            const emptyMsg = document.createElement("p");
            emptyMsg.classList.add("potion-details-empty");
            emptyMsg.textContent = "No additional information available for this potion.";
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
                characteristics: this.characteristics,
                difficulty: this.difficulty,
                effect: this.effect,
                image: this.image,
            },
        };
    }

    /**
     * Generates the HTML container for a small potion image.
     *
     * @returns {HTMLElement} - The HTML container for the small potion image.
     */
    #potionImageSmall() {
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
            overlay.textContent = "Missing image for this potion!";
            container.appendChild(overlay);
        }
        return container;
    }

    /**
     * Generates the HTML container for a large potion image.
     *
     * @returns {HTMLElement} - The HTML container for the large potion image.
     */
    #potionsImageLarge() {
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
            overlay.textContent = "Missing image for this potion!";
            container.appendChild(overlay);
        }

        return container;
    }
}

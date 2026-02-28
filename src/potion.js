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
    DETAILS_FIGURE: "details-figure",
    DETAILS_IMAGE_CONTAINER: "details-image-container",
    DETAILS_IMAGE: "details-image",
    DETAILS_GRID: "details-grid",
    DETAILS_LABEL: "details-label",
    DETAILS_VALUE: "details-value",
    DETAILS_EMPTY: "details-empty",
    IMAGE_PLACEHOLDER_OVERLAY: "image-placeholder-overlay",
    DETAILS_BACK_BUTTON_CLASS: "back-button",
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
const PLACEHOLDER_IMAGE =
    import.meta.env.BASE_URL + "image-placeholders/potions-placeholder-image-200.webp";

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
        const listItem = document.createElement("li");
        listItem.classList.add(CSS.PREVIEW_ITEM);

        const article = document.createElement("article");
        article.classList.add(CSS.PREVIEW_CARD);
        article.dataset.potionId = this.id;

        const titleId = `potion-title-${this.id}`;
        article.setAttribute("aria-labelledby", titleId);

        const link = document.createElement("a");
        link.href = `/potions/${this.id}`;
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
        article.appendChild(this.#potionImageSmall());

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
        container.dataset.potionId = this.id;

        // Header row
        const headerRow = document.createElement("div");
        headerRow.classList.add(CSS.DETAILS_HEADER);

        const title = document.createElement("h3");
        title.classList.add(CSS.DETAILS_NAME);
        title.textContent = this.name;
        const backButton = document.createElement("button");
        backButton.classList.add(CSS.DETAILS_BACK_BUTTON_CLASS);
        backButton.setAttribute("aria-label", "Back to potions list");
        backButton.textContent = "← Back";
        headerRow.appendChild(backButton);

        const header = document.createElement("h2");
        header.classList.add(CSS.DETAILS_NAME);
        header.textContent = this.name;

        headerRow.appendChild(title);
        headerRow.appendChild(favoriteIcon(this.id, this.isFavorite));

        container.appendChild(headerRow);
        container.appendChild(this.#potionsImageLarge());

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
            emptyMsg.classList.add("details-empty");
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
            overlay.textContent = "Missing image for this potion!";
            container.appendChild(overlay);
        }

        return container;
    }
}

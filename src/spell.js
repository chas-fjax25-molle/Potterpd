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
//const DETAILS_IMAGE_WIDTH = 300;

/**
 * @typedef {Object} SpellAttributes
 * @property {string} name - Name of the spell
 * @property {string} incantation - Incantation of the spell
 * @property {string} effect - Effect of the spell
 * @property {string} [image] - Optional image URL for the spell
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
        spell.image = attributes.image || "";

        return spell;
    }

    previewHTML() {
        const container = document.createElement("section");
        container.classList.add(CSS.PREVIEW_CARD_CLASS);
        container.dataset.spellId = this.id;
        const header = document.createElement("h3");
        header.classList.add(CSS.PREVIEW_NAME_CLASS);
        header.textContent = this.name;
        container.appendChild(header);
        container.appendChild(favoriteIcon(this.id));
        container.appendChild(this.#spellImageSmall());
        const effectElem = document.createElement("p");
        effectElem.classList.add(CSS.PREIVEW_EFFECT_CLASS);
        effectElem.textContent = this.effect;
        container.appendChild(effectElem);
        return container;
    }

    /**
     * Generates the HTML container for a small character image.
     *
     * @returns {HTMLElement} - The HTML container for the small character image.
     */
    #spellImageSmall() {
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
}

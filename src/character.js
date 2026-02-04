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
     * Creates a Character instance from a JSON structure.
     * @param {CharacterJSON} jsonStruct - The JSON structure representing a character.
     * @returns {Character} - The created Character instance.
     */
    static fromJson(jsonStruct) {
        const character = new Character();
        character.id = jsonStruct.id;
        character.type = jsonStruct.type;
        character.slug = jsonStruct.attributes.slug;
        character.alias_names = jsonStruct.attributes.alias_names;
        character.animagus = jsonStruct.attributes.animagus;
        character.blood_status = jsonStruct.attributes.blood_status;
        character.boggart = jsonStruct.attributes.boggart;
        character.born = jsonStruct.attributes.born;
        character.died = jsonStruct.attributes.died;
        character.eye_color = jsonStruct.attributes.eye_color;
        character.family_members = jsonStruct.attributes.family_members;
        character.gender = jsonStruct.attributes.gender;
        character.hair_color = jsonStruct.attributes.hair_color;
        character.height = jsonStruct.attributes.height;
        character.house = jsonStruct.attributes.house;
        character.image = jsonStruct.attributes.image;
        character.jobs = jsonStruct.attributes.jobs;
        character.marital_status = jsonStruct.attributes.marital_status;
        character.name = jsonStruct.attributes.name;
        character.nationality = jsonStruct.attributes.nationality;
        character.patronus = jsonStruct.attributes.patronus;
        character.romances = jsonStruct.attributes.romances;
        character.skin_color = jsonStruct.attributes.skin_color;
        character.species = jsonStruct.attributes.species;
        character.titles = jsonStruct.attributes.titles;
        character.wands = jsonStruct.attributes.wands;
        character.weight = jsonStruct.attributes.weight;
        character.wiki = jsonStruct.attributes.wiki;
        return character;
    }

    /**
     * Create a preview card HTML element for the character.
     *
     * @returns {HTMLElement} - The HTML representation of the character.
     */
    previewHTML() {
        const container = document.createElement("section");
        container.classList.add("character-preview-card");
        container.id = this.id;
        const header = document.createElement("h3");
        header.classList.add("character-preview-name");
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
        container.classList.add("character-details-card");
        container.id = this.id;
        const header = document.createElement("h2");
        header.classList.add("character-details-name");
        header.textContent = this.name;
        container.appendChild(header);
        container.appendChild(this.#favoriteIcon());
        container.appendChild(this.#characterImageLarge());
        container.appendChild(this.#characterAliasNames());
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
        favoriteIcon.classList.add("character-favorite-icon");
        favoriteIcon.id = this.id;
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
        container.classList.add("character-preview-image-container");
        if (this.image) {
            const imageElem = document.createElement("img");
            imageElem.classList.add("character-preview-image");
            imageElem.src = this.image;
            imageElem.alt = `${this.name} image`;
            imageElem.width = 200;
            container.appendChild(imageElem);
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add("character-preview-placeholder");
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
        container.classList.add("character-details-image-container");
        if (this.image) {
            const imageElem = document.createElement("img");
            imageElem.classList.add("character-details-image");
            imageElem.src = this.image;
            imageElem.alt = `${this.name} image`;
            imageElem.width = 300;
            container.appendChild(imageElem);
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add("character-details-placeholder");
            placeholder.textContent = "No Image";
            container.appendChild(placeholder);
        }
        return container;
    }

    /**
     * Generate HTML for the character's alias names.
     *
     * @returns {HTMLElement} - The HTML representation of the character's alias names.
     */
    #characterAliasNames() {
        const aliasNames = document.createElement("ul");
        aliasNames.classList.add("character-details-alias-names");
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
        factsContainer.classList.add("character-details-facts");
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
        const houseFact = document.createElement("p");
        houseFact.classList.add("character-details-fact");
        houseFact.classList.add("character-details-fact-house");
        if (this.house) {
            houseFact.textContent = `House: ${this.house}`;
        } else {
            houseFact.textContent = "House: Unknown";
        }
        return houseFact;
    }

    /**
     * Generate HTML for the character's family members.
     *
     * @returns {HTMLElement} - The HTML representation of the character's family members.
     */
    #familyMembersHTML() {
        const familyFact = document.createElement("div");
        familyFact.classList.add("character-details-fact");
        familyFact.classList.add("character-details-fact-family-members");
        const familyHeader = document.createElement("h4");
        familyHeader.textContent = "Family Members:";
        familyFact.appendChild(familyHeader);
        if (this.family_members.length === 0) {
            const noFamily = document.createElement("p");
            noFamily.textContent = "No known family members.";
            familyFact.appendChild(noFamily);
        } else {
            const familyList = document.createElement("ul");
            this.family_members.forEach((member) => {
                const li = document.createElement("li");
                li.textContent = member;
                familyList.appendChild(li);
            });
            familyFact.appendChild(familyList);
        }
        return familyFact;
    }

    /**
     * Generate HTML for the character's jobs.
     *
     * @returns {HTMLElement} - The HTML representation of the character's jobs.
     */
    #jobsHTML() {
        const jobsFact = document.createElement("div");
        jobsFact.classList.add("character-details-fact");
        jobsFact.classList.add("character-details-fact-jobs");
        const jobsHeader = document.createElement("h4");
        jobsHeader.textContent = "Jobs:";
        jobsFact.appendChild(jobsHeader);
        if (this.jobs.length === 0) {
            const noJobs = document.createElement("p");
            noJobs.textContent = "No known jobs.";
            jobsFact.appendChild(noJobs);
        } else {
            const jobsList = document.createElement("ul");
            this.jobs.forEach((job) => {
                const li = document.createElement("li");
                li.textContent = job;
                jobsList.appendChild(li);
            });
            jobsFact.appendChild(jobsList);
        }
        return jobsFact;
    }

    /**
     * Generate HTML for the character's wands.
     *
     * @returns {HTMLElement} - The HTML representation of the character's wands.
     */
    #wandsHTML() {
        const wandFact = document.createElement("div");
        wandFact.classList.add("character-details-fact");
        wandFact.classList.add("character-details-fact-wands");
        const wandHeader = document.createElement("h4");
        wandHeader.textContent = "Wands:";
        wandFact.appendChild(wandHeader);
        if (this.wands.length === 0) {
            const noWands = document.createElement("p");
            noWands.textContent = "No known wands.";
            wandFact.appendChild(noWands);
        } else {
            const wandList = document.createElement("ul");
            this.wands.forEach((wand) => {
                const li = document.createElement("li");
                li.textContent = wand;
                wandList.appendChild(li);
            });
            wandFact.appendChild(wandList);
        }
        return wandFact;
    }

    /**
     * Generate HTML for the character's patronus.
     *
     * @returns {HTMLElement} - The HTML representation of the character's patronus.
     */
    #patronusHTML() {
        const patronusFact = document.createElement("p");
        patronusFact.classList.add("character-details-fact");
        patronusFact.classList.add("character-details-fact-patronus");
        if (this.patronus) {
            patronusFact.textContent = "Patronus: " + this.patronus;
        } else {
            patronusFact.textContent = "Unknown";
        }
        return patronusFact;
    }

    /**
     * Generate HTML for the character's boggart.
     *
     * @returns {HTMLElement} - The HTML representation of the character's boggart.
     */
    #boggartHTML() {
        const boggartFact = document.createElement("p");
        boggartFact.classList.add("character-details-fact");
        boggartFact.classList.add("character-details-fact-boggart");
        if (this.boggart) {
            boggartFact.textContent = "Boggart: " + this.boggart;
        } else {
            boggartFact.textContent = "Unknown";
        }
        return boggartFact;
    }

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
}

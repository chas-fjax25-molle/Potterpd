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

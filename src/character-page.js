import { Character } from "./character.js";
import "./character/style.css";


const API_BASE = "https://api.potterdb.com/v1";

/**
 * Get character ID from URL query parameters
 */

function getCharacterIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/**
 * Fetch single character by ID from PotterDB API
 * @param {string} id - Character ID
 * @returns {Promise<Character>}
 */

async function fetchCharacterById(id) {
    const response = await fetch(`${API_BASE}/characters/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch character: ${response.statusText}`);
    }
    const json = await response.json();
    return Character.fromJson(json.data);
}

/**
 * Render character details on the page
 */

async function renderCharacterDetails() {
    const container = document.getElementById("character-details");
    const characterId = getCharacterIdFromUrl();
    if (!characterId) {
        container.innerHTML = "<p>No character ID provided in URL.</p>";
        return;
    }

    try {
        const character = await fetchCharacterById(characterId);
        document.title = `${character.name} - Potterpd`;
        container.innerHTML = "";
        container.appendChild(character.previewHTML());
        
        if(character.detailsHTML){
        container.appendChild(character.detailsHTML());
    } else {
        const fallback = document.createElement("p");
        fallback.textContent = `Character:  ${character.name} (ID: ${character.id})`;'
        container.appendChild(fallback);
    }

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Failed to load character details. Please try again later.</p>";
    }
}


// Run when DOM is fully loaded
document.addEventListener("DOMContentLoaded", renderCharacterDetails);
    
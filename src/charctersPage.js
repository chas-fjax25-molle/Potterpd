import { Character } from "./character.js";

import "./characters/style.css";

const API_BASE = "https://api.potterdb.com/v1/.json";

/**
 * fetch all charecters from api
 * @returns{Promise <Character[]>}
 */ /* denna sync funktionen är till för att hämta karatkärena från databasen*/

async function fetchAllCharacters() {
    const response = await fetch(`${API_BASE}/characters`);
    if (!response.ok) {
        throw new Error(`Failed to fetch characters: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data.map(Character.fromJson);
}

/**
 * render all characters as preview cards
 */ /* denna funktione är till för att göra alla caractärna till kort*/

async function renderAllCharacters() {
    const container = document.getElementById("character-previews");
    if (!container) return;
    try {
        const characters = await fetchAllCharacters();

        container.innerHTML = "";

        characters.forEach((character) => {
            const link = document.createElement("a");
            link.href = `character.html?id=${character.id}`;
            link.appendChild(character.previewHTML());
            container.appendChild(link);
        });
        // error meddelande om det ej går at ladda upp bilderna
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p> failed to load characters. PLEAS try agin later</p>";
    }
}
document.addEventListener("DOMContentLoaded", renderAllCharacters);

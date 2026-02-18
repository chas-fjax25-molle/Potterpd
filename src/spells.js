// @ts-ignore
import "./style.css";
import "./spell_layout.css";

//import { Favorites } from "./favorites";
//import { getCategory } from "./RequestsFromAPI";
import { registerFavoriteIconClick } from "./favorite_icon";
import { SpellService } from "./spell_service";

document.addEventListener("DOMContentLoaded", async () => {
    const spellsContainer = document.getElementById("spells-container");
    if (!spellsContainer) {
        console.error("Spells container element not found.");
        return;
    }
    const service = new SpellService();

    /**
     * This function is called when a favorite icon is clicked, and it toggles the favorite status of the corresponding spell in the SpellService.
     * @param {string} id - The entity ID associated with the favorite icon that was clicked.
     */
    function onFavoriteIconClick(id) {
        console.log(`Favorite icon clicked for entity ID: ${id}`);
        service.toggleFavorite(id);
    }

    registerFavoriteIconClick(spellsContainer, onFavoriteIconClick);

    service
        .loadSpells(1)
        .then((spells) => {
            if (spells) {
                spells.forEach((/** @type {import("./spell").Spell} */ spell) => {
                    const preview = spell.previewHTML();
                    spellsContainer.appendChild(preview);
                });
            } else {
                console.error("No spells data found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching spells:", error);
        });
});

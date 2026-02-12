// @ts-ignore
import "./style.css";

import { Spell } from "./spell";
//import { Favorites } from "./favorites";
import { getCategory } from "./RequestsFromAPI";

document.addEventListener("DOMContentLoaded", () => {
    const spellsContainer = document.getElementById("spells-container");
    if (!spellsContainer) {
        console.error("Spells container element not found.");
        return;
    }

    getCategory("spells", "1")
        .then((result) => {
            if (result && result.data) {
                /** @type {Spell[]} */
                const spells = result.data.map(Spell.fromJson);
                spells.forEach((spell) => {
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

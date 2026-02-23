function searchSection() {
    const container = document.getElementsByClassName("nav-search-container");

    const searchSection = document.createElement("search-filter");

    searchSection.innerHTML = `
    <section class="search-filter">
        <form id="searchForm">
            <div class="search-container">
                <input type="text" placeholder="Search..." />
                <button class="btn-search" type="submit">
                    Search
                </button>
            </div>
            <div class="filter-container">
                <select id="filter" type="text">
                    <option selected hidden>
                        Filter
                    </option>
                    <option value="books">Books</option>
                    <option value="characters">Characters</option>
                    <option value="spells">Spells</option>
                    <option value="movies">Movies</option>
                    <option value="potions">Potions</option>
                </select>
            </div>
        </form>
    </section>;
    `;

    container[0].appendChild(searchSection);
}
searchSection();

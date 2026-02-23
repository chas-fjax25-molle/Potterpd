/**
 * Generic router factory for entity pages.
 *
 * Usage:
 * const router = createEntityRouter({
 *   basePath: '/potions',
 *   basePath: '/spells',
 *   renderList: () => listView(),
 *   renderDetail: (id) => detailView(id),
 *   renderSearch: (q) => searchView(q)
 * });
 * router.init();
 */

/**
 * @typedef {Object} EntityRouterOptions
 * @property {string} [basePath]
 * @property {() => any} renderList
 * @property {(id: string) => any} renderDetail
 * @property {(q: string) => any} renderSearch
 */

/**
 * @param {EntityRouterOptions} options
 */
export function createEntityRouter(options) {
    const { basePath = "/", renderList, renderDetail, renderSearch } = options;
    if (
        typeof renderList !== "function" ||
        typeof renderDetail !== "function" ||
        typeof renderSearch !== "function"
    ) {
        throw new Error(
            "createEntityRouter requires renderList, renderDetail and renderSearch callbacks"
        );
    }

    function navigateToList() {
        history.pushState({}, "", basePath);
        Promise.resolve(renderList()).catch((e) => console.error("renderList failed", e));
    }

    /**
     * @param {string} id
     */
    function navigateToDetail(id) {
        history.pushState({ id }, "", basePath + "?id=" + encodeURIComponent(id));
        Promise.resolve(renderDetail(id)).catch((e) => console.error("renderDetail failed", e));
    }

    /**
     * @param {string} q
     */
    function navigateToSearch(q) {
        history.pushState({ s: q }, "", basePath + "?s=" + encodeURIComponent(q));
        Promise.resolve(renderSearch(q)).catch((e) => console.error("renderSearch failed", e));
    }

    function initRouter() {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get("id");
        const sParam = params.get("s");

        if (idParam) {
            Promise.resolve(renderDetail(idParam)).catch((e) =>
                console.error("renderDetail failed", e)
            );
        } else if (sParam) {
            Promise.resolve(renderSearch(sParam)).catch((e) =>
                console.error("renderSearch failed", e)
            );
        } else {
            Promise.resolve(renderList()).catch((e) => console.error("renderList failed", e));
        }
    }

    function setupPopstateListener() {
        window.addEventListener("popstate", () => {
            initRouter();
        });
    }

    return {
        init() {
            initRouter();
            setupPopstateListener();
        },
        navigateToList,
        navigateToDetail,
        navigateToSearch,
        initRouter,
    };
}

export default createEntityRouter;

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-change button");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const theme = button.dataset.theme;
            document.body.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        });
    });
});

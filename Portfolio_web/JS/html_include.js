// HTML Include - Carga nav-foot
document.querySelectorAll("[data-html-include]").forEach(el => {
    fetch(el.getAttribute("data-html-include"))
        .then(r => r.text())
        .then(html => el.innerHTML = html);
});
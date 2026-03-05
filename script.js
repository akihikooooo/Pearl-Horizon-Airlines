//Menu

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector("#links ul")

menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("toggled");
    navMenu.classList.toggle("showed");
})
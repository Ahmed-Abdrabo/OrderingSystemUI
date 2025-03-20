import { renderNavbar } from "./Components/Header/navbar.js"

window.addEventListener("load", async () => {
    const navbarPlaceholderElement = document.getElementById("navbar");

    try {
        const navbarHTML = await renderNavbar();
        navbarPlaceholderElement.innerHTML = navbarHTML;

        console.log("Navbar loaded successfully!");

        // Run the authentication check after navbar is inserted
        setupNavbarAuth();
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
});
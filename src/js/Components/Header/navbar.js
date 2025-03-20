export const renderNavbar = async () => {
    try {
        const response = await fetch("src/js/Components/Header/navbar.html");
        return await response.text();
    } catch (error) {
        console.error("Error loading navbar:", error);
        return "";
    }
};

window.setupNavbarAuth = () => {
    const token = localStorage.getItem("token");
    const displayName = localStorage.getItem("displayName");
    const userRole = localStorage.getItem("userRole"); // Assuming role is stored on login

    console.log("Token found:", token);
    console.log("User Name:", displayName);
    console.log("User Role:", userRole);

    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutLink = document.getElementById("logoutLink");
    const userGreeting = document.getElementById("userGreeting");
    const orderManagementLink = document.getElementById("orderManagementLink");
    const MyOrders = document.getElementById("MyOrders");

    if (token) {
        console.log("User is logged in. Updating navbar...");
        if (loginLink) loginLink.classList.add("hidden");
        if (registerLink) registerLink.classList.add("hidden");
        if (logoutLink) logoutLink.classList.remove("hidden");
        if (MyOrders) MyOrders.classList.remove("hidden");

        if (displayName && userGreeting) {
            userGreeting.textContent = `Hello, ${displayName}`;
            userGreeting.classList.remove("hidden");
        }
        console.log(userRole);
        
        
         // If user is an admin, show the "Order Management" link
         if (userRole === "Admin" && orderManagementLink) {
            orderManagementLink.classList.remove("hidden");
        }

        if (logoutLink) {
            logoutLink.addEventListener("click", function () {
                localStorage.removeItem("token");
                localStorage.removeItem("displayName");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userRole");
                window.location.href = "login.html";
            });
        }
    } else {
        console.log("No token found. Showing login/register links.");
    }
};

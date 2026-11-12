
document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://localhost:5000/api";

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    let currentUser = null;

    try {
        currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        currentUser = null;
    }

    const userNameElements = document.querySelectorAll(
        "#userName, #welcomeName, .user-name"
    );

    userNameElements.forEach((element) => {
        element.textContent = currentUser?.name || "Welcome!";
    });

  
    const userEmailElements = document.querySelectorAll(
        "#userEmail, .user-email"
    );

    userEmailElements.forEach((element) => {
        element.textContent = currentUser?.email || "";
    });

   
    const logoutButtons = document.querySelectorAll(
        "#logoutButton, .logout-button"
    );

    logoutButtons.forEach((button) => {
        button.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "login.html";
        });
    });

    
    async function apiRequest(endpoint, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || "Request failed.");
        }

        return data;
    }

    async function loadDashboardStats() {
        const statsElement = document.getElementById("projectCount");

        if (!statsElement || !token) {
            return;
        }

        try {
            const data = await apiRequest("/projects");

            const projects = Array.isArray(data)
                ? data
                : data.projects || [];

            statsElement.textContent = projects.length;
        } catch (error) {
            console.error("Could not load project statistics:", error.message);
        }
    }

    loadDashboardStats();
});

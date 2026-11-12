document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);
    const message = $("profileMessage");

    async function loadProfile() {
        const token = localStorage.getItem("token") ||
                      sessionStorage.getItem("token");

        if (!token) {
            message.textContent = "Please log in to view your profile.";
            $("profileName").textContent = "Not logged in";
            $("profileEmail").textContent = "—";

            const link = document.createElement("a");
            link.href = "login.html";
            link.textContent = " Go to Login";
            message.appendChild(link);
            return;
        }

        message.textContent = "Loading profile...";

        try {
            const response = await fetch("/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || result.error || "Unable to load profile.");
            }

            const user = result.user || result.data || result;
            const name = user.name || user.fullName || user.username || "User";
            const email = user.email || "Not provided";

            $("profileName").textContent = name;
            $("profileEmail").textContent = email;
            $("profileUsername").textContent = user.username || "—";
            $("profileId").textContent = user._id || user.id || "—";
            $("profileAvatar").textContent = name.charAt(0).toUpperCase();
            message.textContent = "Profile loaded successfully.";
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            message.textContent = error.message;

            if (error.message.toLowerCase().includes("token") ||
                error.message.toLowerCase().includes("unauthorized")) {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
            }
        }
    }

    $("refreshProfile").addEventListener("click", loadProfile);

    $("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "login.html";
    });

    loadProfile();
});

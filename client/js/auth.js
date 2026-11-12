const API_URL = "http://localhost:5000/api/auth";


function showMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = `form-message ${type}`;
}


function setButtonLoading(button, isLoading, originalText) {
    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading ? "Please wait..." : originalText;
}


async function readResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms");
        const messageElement = document.getElementById("message");
        const registerButton = document.getElementById("registerButton");

        if (!name || !email || !password || !confirmPassword) {
            showMessage(messageElement, "Please fill in all required fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(messageElement, "Passwords do not match.", "error");
            return;
        }

        if (terms && !terms.checked) {
            showMessage(messageElement, "Please accept the terms and conditions.", "error");
            return;
        }

        const originalText = registerButton
            ? registerButton.textContent
            : "Create Account";

        setButtonLoading(registerButton, true, originalText);
        showMessage(messageElement, "", "");

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await readResponse(response);

            showMessage(
                messageElement,
                data.message || "Registration successful! You can now sign in.",
                "success"
            );

            registerForm.reset();

            // Go to the login page after a short delay.
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            showMessage(
                messageElement,
                error.message || "Unable to register. Please try again.",
                "error"
            );
        } finally {
            setButtonLoading(registerButton, false, originalText);
        }
    });
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("rememberMe");
        const messageElement = document.getElementById("message");
        const loginButton = document.getElementById("loginButton");

        if (!email || !password) {
            showMessage(messageElement, "Please enter your email and password.", "error");
            return;
        }

        const originalText = loginButton
            ? loginButton.textContent
            : "Sign In";

        setButtonLoading(loginButton, true, originalText);
        showMessage(messageElement, "", "");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await readResponse(response);

            // Expect the backend to return a token.
            if (!data.token) {
                throw new Error("Login response did not include an authentication token.");
            }

            // Store the token for authenticated API requests.
            // localStorage persists across browser restarts; sessionStorage
            // is cleared when the browser tab session ends.
            const storage = rememberMe && rememberMe.checked
                ? localStorage
                : sessionStorage;

            localStorage.setItem("token", data.token);

            // Store basic user details if the server returns them.
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            showMessage(
                messageElement,
                data.message || "Login successful! Redirecting...",
                "success"
            );

            // Temporary destination until we create the dashboard.
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            showMessage(
                messageElement,
                error.message || "Unable to sign in. Please try again.",
                "error"
            );
        } finally {
            setButtonLoading(loginButton, false, originalText);
        }
    });
}

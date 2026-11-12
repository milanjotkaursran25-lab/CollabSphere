// CollabSphere - API Helper

const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.body && !(options.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const contentType = response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            const message =
                typeof data === "object" && data !== null
                    ? data.message || data.error
                    : data;

            throw new Error(message || `Request failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("CollabSphere API error:", error.message);
        throw error;
    }
}

async function getData(endpoint) {
    return apiRequest(endpoint);
}

async function postData(endpoint, data) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

async function updateData(endpoint, data) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

async function deleteData(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE"
    });
}
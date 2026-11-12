document.addEventListener("DOMContentLoaded", () => {
    const API = "/api/projects";
    const token = localStorage.getItem("token");
    const form = document.getElementById("projectForm");
    const list = document.getElementById("projectsList");
    const message = document.getElementById("formMessage");
    const nameInput = document.getElementById("projectName");
    const descriptionInput = document.getElementById("projectDescription");
    const statusInput = document.getElementById("projectStatus");
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form || !list) return;

    if (!token) {
        message.textContent = "Please log in to manage projects.";
        list.textContent = "Log in to view your projects.";
        return;
    }

    let editingId = null;

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    async function request(endpoint = "", options = {}) {
        const headers = {
            Authorization: `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {})
        };

        const response = await fetch(`${API}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
            throw new Error("Your session expired. Please log in again.");
        }

        if (!response.ok) {
            throw new Error(data.message || "Request failed.");
        }

        return data;
    }

    function displayStatus(status) {
        return ({
            pending: "Not Started",
            active: "In Progress",
            completed: "Completed"
        })[status] || status || "Pending";
    }

    async function loadProjects() {
        list.textContent = "Loading projects...";

        try {
            const data = await request();
            const projects = Array.isArray(data) ? data : data.projects || [];

            if (!projects.length) {
                list.innerHTML = '<p class="projects-empty">No projects yet. Create your first project above.</p>';
                return;
            }

            list.innerHTML = projects.map(project => `
                <article class="project-card" data-status="${escapeHTML(project.status)}">
                    <h3>${escapeHTML(project.name)}</h3>
                    <p>${escapeHTML(project.description || "No description provided.")}</p>
                    <span class="status-badge ${escapeHTML(project.status)}">
                        ${escapeHTML(displayStatus(project.status))}
                    </span>
                    <div class="project-actions">
                        <button type="button" data-action="edit" data-id="${escapeHTML(project._id)}">Edit</button>
                        <button type="button" data-action="delete" data-id="${escapeHTML(project._id)}">Delete</button>
                    </div>
                </article>
            `).join("");
        } catch (error) {
            list.textContent = error.message;
        }
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const project = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            status: statusInput.value
        };

        if (!project.name || !project.description) {
            message.textContent = "Please enter a project name and description.";
            return;
        }

        submitButton.disabled = true;
        message.textContent = editingId ? "Updating project..." : "Creating project...";

        try {
            if (editingId) {
                await request(`/${encodeURIComponent(editingId)}`, {
                    method: "PUT",
                    body: JSON.stringify(project)
                });
                message.textContent = "Project updated successfully.";
            } else {
                await request("", {
                    method: "POST",
                    body: JSON.stringify(project)
                });
                message.textContent = "Project created successfully.";
            }

            form.reset();
            editingId = null;
            submitButton.textContent = "Create Project";
            await loadProjects();
        } catch (error) {
            message.textContent = error.message;
        } finally {
            submitButton.disabled = false;
        }
    });

    list.addEventListener("click", async event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        try {
            if (action === "edit") {
                const data = await request();
                const projects = Array.isArray(data) ? data : data.projects || [];
                const project = projects.find(item => item._id === id);

                if (!project) {
                    message.textContent = "Project not found. Refresh the list.";
                    return;
                }

                editingId = id;
                nameInput.value = project.name || "";
                descriptionInput.value = project.description || "";
                statusInput.value = project.status || "pending";
                submitButton.textContent = "Save Changes";
                message.textContent = "Editing project. Update the fields and save.";
                form.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            if (action === "delete") {
                if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) {
                    return;
                }

                button.disabled = true;
                await request(`/${encodeURIComponent(id)}`, {
                    method: "DELETE"
                });

                if (editingId === id) {
                    editingId = null;
                    form.reset();
                    submitButton.textContent = "Create Project";
                }

                message.textContent = "Project deleted successfully.";
                await loadProjects();
            }
        } catch (error) {
            message.textContent = error.message;
            button.disabled = false;
        }
    });

    document.getElementById("refreshBtn")?.addEventListener("click", loadProjects);

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "login.html";
    });

    loadProjects();
});

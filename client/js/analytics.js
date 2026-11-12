
document.addEventListener("DOMContentLoaded", () => {
    const projectsKey = "collabsphereProjects";
    const tasksKey = "collabsphereTasks";

    const getStoredArray = (key) => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    };

    const projects = getStoredArray(projectsKey);
    const tasks = getStoredArray(tasksKey);

    const completedTasks = tasks.filter((task) =>
        ["done", "completed"].includes(
            String(task.status || "").toLowerCase()
        )
    );

    const pendingTasks = tasks.filter((task) =>
        !["done", "completed"].includes(
            String(task.status || "").toLowerCase()
        )
    );

    const completionRate = tasks.length
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    // Update existing analytics elements only.
    const updateElement = (selectors, value) => {
        const element = document.querySelector(selectors);
        if (element) element.textContent = value;
    };

    updateElement("#totalProjects, [data-stat='projects']", projects.length);
    updateElement("#totalTasks, [data-stat='tasks']", tasks.length);
    updateElement(
        "#completedTasks, [data-stat='completed']",
        completedTasks.length
    );
    updateElement(
        "#pendingTasks, [data-stat='pending']",
        pendingTasks.length
    );
    updateElement(
        "#completionRate, [data-stat='completion-rate']",
        `${completionRate}%`
    );

    // Render a task progress bar if your analytics page has one.
    const progressBar = document.querySelector(
        "#taskProgress, [data-chart='task-progress']"
    );

    if (progressBar) {
        progressBar.style.width = `${completionRate}%`;
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("aria-valuemin", "0");
        progressBar.setAttribute("aria-valuemax", "100");
        progressBar.setAttribute("aria-valuenow", String(completionRate));
    }

    // Show task counts by status if a breakdown container exists.
    const breakdown = document.getElementById("taskBreakdown");

    if (breakdown) {
        const statuses = [
            { label: "To do", values: ["todo", "to do"] },
            { label: "In progress", values: ["in-progress", "in progress"] },
            { label: "Completed", values: ["done", "completed"] }
        ];

        breakdown.replaceChildren();

        statuses.forEach(({ label, values }) => {
            const count = tasks.filter((task) =>
                values.includes(String(task.status || "").toLowerCase())
            ).length;

            const row = document.createElement("p");
            row.textContent = `${label}: ${count}`;
            breakdown.appendChild(row);
        });
    }
});

// CollabSphere - File Management

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const fileList = document.getElementById("fileList");

    if (!fileInput || !uploadButton || !fileList) {
        console.log("File management elements are not present on this page.");
        return;
    }

    uploadButton.addEventListener("click", () => {
        const files = fileInput.files;

        if (!files || files.length === 0) {
            alert("Please select a file first.");
            return;
        }

        Array.from(files).forEach((file) => {
            const item = document.createElement("div");
            item.className = "file-item";

            const name = document.createElement("span");
            name.textContent = file.name;

            const size = document.createElement("span");
            size.textContent = `${(file.size / 1024).toFixed(2)} KB`;

            item.appendChild(name);
            item.appendChild(size);
            fileList.appendChild(item);
        });

        fileInput.value = "";
    });
});
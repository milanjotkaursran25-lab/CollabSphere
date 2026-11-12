
document.addEventListener("DOMContentLoaded", () => {
    const noteInput = document.getElementById("noteInput");
    const addNoteButton = document.getElementById("addNoteButton");
    const notesList = document.getElementById("notesList");

    if (!noteInput || !addNoteButton || !notesList) {
        console.log("Notes elements are not present on this page.");
        return;
    }

    addNoteButton.addEventListener("click", () => {
        const text = noteInput.value.trim();

        if (!text) {
            alert("Please enter a note.");
            return;
        }

        const note = document.createElement("div");
        note.className = "note-item";

        const content = document.createElement("p");
        content.textContent = text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            note.remove();
        });

        note.appendChild(content);
        note.appendChild(deleteButton);
        notesList.appendChild(note);

        noteInput.value = "";
    });
});
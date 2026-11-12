document.addEventListener("DOMContentLoaded", () => {
    const aiInput = document.getElementById("aiQuestion");
    const aiButton = document.getElementById("aiSend");
    const aiMessages = document.getElementById("aiMessages");
    const aiStatus = document.getElementById("aiStatus");
    const aiForm = document.getElementById("aiForm");

    if (!aiInput || !aiButton || !aiMessages || !aiForm) {
        console.error("AI Assistant elements are missing from ai.html.");
        return;
    }

    function addMessage(text, type) {
        const message = document.createElement("div");
        message.className = `ai-message ${type}`;
        message.textContent = text;
        aiMessages.appendChild(message);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return message;
    }

    async function askAI(event) {
        if (event) event.preventDefault();

        const prompt = aiInput.value.trim();

        if (!prompt) {
            aiStatus.textContent = "Please enter a question first.";
            return;
        }

        aiButton.disabled = true;
        aiInput.disabled = true;
        aiStatus.textContent = "Gemini is thinking...";

        addMessage(prompt, "ai-user");
        aiInput.value = "";

        const thinkingMessage = addMessage("Thinking...", "ai-bot");

        try {
            if (typeof apiRequest !== "function") {
                throw new Error("API helper is not loaded. Check js/api.js.");
            }

            const result = await apiRequest("/gemini", {
                method: "POST",
                body: JSON.stringify({ prompt })
            });

            thinkingMessage.textContent =
                result.response ||
                result.reply ||
                result.message ||
                "Gemini returned an empty response.";

            aiStatus.textContent = result.success === false
                ? "The AI request was unsuccessful."
                : "Response received.";
        } catch (error) {
            thinkingMessage.textContent = `Error: ${error.message}`;
            aiStatus.textContent =
                "Could not get a response. Check your login and backend.";
            console.error("AI Assistant error:", error);
        } finally {
            aiButton.disabled = false;
            aiInput.disabled = false;
            aiInput.focus();
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }
    }

    aiForm.addEventListener("submit", askAI);

    aiInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            aiForm.requestSubmit();
        }
    });
});


/* =============================================
   PYSTRIX - MAIN JAVASCRIPT
   Code. Compete. Conquer.
   ============================================= */


/* =============================================
   1. SWEETALERT2 NOTIFICATION SYSTEM
   ============================================= */

const PyStrixToast = typeof Swal !== "undefined"
    ? Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,

        customClass: {
            popup: "pystrix-toast",
            title: "pystrix-toast-title"
        }
    })
    : null;


// Common notification
function showToast(icon, message) {

    if (!PyStrixToast) {
        console.error("SweetAlert2 unavailable:", message);
        return;
    }

    PyStrixToast.fire({
        icon: icon,
        title: message
    });

}


// Notification helpers
function showSuccess(message) {
    showToast("success", message);
}

function showError(message) {
    showToast("error", message);
}

function showInfo(message) {
    showToast("info", message);
}

function showWarning(message) {
    showToast("warning", message);
}


// Confirmation dialog
function showConfirmation(title, message) {

    if (typeof Swal === "undefined") {
        console.error("SweetAlert2 unavailable.");
        return Promise.resolve({ isConfirmed: false });
    }

    return Swal.fire({
        title: title,
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
        cancelButtonText: "Cancel",
        reverseButtons: true,

        customClass: {
            popup: "pystrix-modal"
        }
    });

}


if (typeof Swal !== "undefined") {
    console.log("SweetAlert2 loaded successfully.");
} else {
    console.error("SweetAlert2 CDN failed to load.");
}


/* =============================================
   2. INITIALIZE CODE EDITOR
   ============================================= */

const editorElement = document.getElementById("codeEditor");

let editor = null;

if (editorElement && typeof CodeMirror !== "undefined") {

    editor = CodeMirror.fromTextArea(editorElement, {

        mode: "python",
        theme: "material-darker",

        lineNumbers: true,
        styleActiveLine: true,
        lineWrapping: false,

        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,

        autofocus: true,
        matchBrackets: true

    });

} else {

    console.error("CodeMirror failed to initialize.");

}


/* =============================================
   3. WELCOME POPUP
   ============================================= */

const welcomeToast = document.getElementById("welcomeToast");
const closeWelcome = document.getElementById("closeWelcome");


function hideWelcome() {

    if (!welcomeToast) return;

    welcomeToast.classList.add("hide");

    setTimeout(() => {
        welcomeToast.style.display = "none";
    }, 400);

}


// Manual close
if (closeWelcome) {
    closeWelcome.addEventListener("click", hideWelcome);
}


// Automatically close after 4 seconds
if (welcomeToast) {
    setTimeout(hideWelcome, 4000);
}


/* =============================================
   4. CURSOR POSITION
   ============================================= */

const cursorPosition = document.getElementById("cursorPosition");


function updateCursorPosition() {

    if (!editor || !cursorPosition) return;

    const cursor = editor.getCursor();

    cursorPosition.textContent =
        `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;

}


if (editor) {

    editor.on("cursorActivity", updateCursorPosition);

    updateCursorPosition();

}


/* =============================================
   5. EDITOR APPEARANCE SETTINGS
   ============================================= */

// DOM Elements

const appearanceToggle =
    document.getElementById("appearanceToggle");

const appearanceMenu =
    document.getElementById("appearanceMenu");

const editorTheme =
    document.getElementById("editorTheme");

const fontSize =
    document.getElementById("fontSize");

const textStyle =
    document.getElementById("textStyle");

const resetAppearance =
    document.getElementById("resetAppearance");


// Open / Close appearance menu

if (appearanceToggle && appearanceMenu) {

    appearanceToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        appearanceMenu.classList.toggle("show");

    });


    // Close menu on outside click

    document.addEventListener("click", (event) => {

        if (
            !appearanceMenu.contains(event.target) &&
            !appearanceToggle.contains(event.target)
        ) {

            appearanceMenu.classList.remove("show");

        }

    });

}


/* Theme Rendering */

function applyEditorTheme(theme, notify = true) {

    if (!editor) return;

    const isLight = theme === "light";

    // Apply actual CodeMirror theme
    editor.setOption(
        "theme",
        isLight ? "default" : "material-darker"
    );

    // Refresh editor
    editor.refresh();

    console.log("Current editor theme:", theme);

    if (notify) {

        showSuccess(
            isLight
                ? "Light theme activated!"
                : "Dark theme activated!"
        );

    }

}


// Theme dropdown
if (editorTheme && editor) {

    editorTheme.addEventListener("change", function () {

        applyEditorTheme(this.value);

    });

}


// Default theme
if (editor) {

    editorTheme.value = "dark";
    applyEditorTheme("dark", false);

}




/* Font Size */

if (fontSize && editor) {

    fontSize.addEventListener("change", () => {

        const wrapper = editor.getWrapperElement();

        wrapper.style.fontSize = `${fontSize.value}px`;

        editor.refresh();

        showSuccess(`Font size changed to ${fontSize.value}px`);

    });

}


/* =============================================
   8. TEXT STYLE CUSTOMIZATION
   ============================================= */

if (textStyle && editor) {

    textStyle.addEventListener("change", () => {

        const style = textStyle.value;

        const wrapper = editor.getWrapperElement();

        wrapper.style.fontWeight =
            style.includes("bold") ? "700" : "400";

        wrapper.style.fontStyle =
            style.includes("italic") ? "italic" : "normal";

        editor.refresh();

        showSuccess("Text style updated!");

    });

}


/* =============================================
   9. RESET EDITOR APPEARANCE
   ============================================= */

if (resetAppearance && editor) {

    resetAppearance.addEventListener("click", () => {

        // Reset dropdowns
        if (editorTheme) {
            editorTheme.value = "dark";
        }

        if (fontSize) {
            fontSize.value = "14";
        }

        if (textStyle) {
            textStyle.value = "normal";
        }


        // Reset editor theme
        applyEditorTheme("dark", false);


        // Reset font settings
        const wrapper = editor.getWrapperElement();

        wrapper.style.fontSize = "14px";
        wrapper.style.fontWeight = "400";
        wrapper.style.fontStyle = "normal";


        editor.refresh();

        showSuccess("Editor settings reset!");

    });

}


/* =============================================
   10. OUTPUT ELEMENTS
   ============================================= */

const runBtn = document.getElementById("runBtn");

const outputText = document.getElementById("outputText");

const outputPlaceholder =
    document.getElementById("outputPlaceholder");

const outputStatus =
    document.getElementById("outputStatus");

const executionTime =
    document.getElementById("executionTime");

const executionStatus =
    document.getElementById("executionStatus");


/* =============================================
   11. DISPLAY OUTPUT
   ============================================= */

function displayOutput(output, type = "normal") {

    if (!outputText || !outputPlaceholder) return;

    outputPlaceholder.style.display = "none";

    outputText.style.display = "block";

    outputText.textContent = output;

    outputText.style.color =
        type === "error" ? "#f87171" : "#e5e7eb";

}


/* =============================================
   12. PYTHON CODE EXECUTION
   ============================================= */

if (runBtn && editor) {

    runBtn.addEventListener("click", async () => {

        const code = editor.getValue();


        // Empty code validation
        if (!code.trim()) {

            showWarning("Please write some Python code first.");

            return;

        }


        // Disable Run button
        runBtn.disabled = true;

        runBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Running
        `;


        if (outputStatus) {
            outputStatus.textContent = "Running";
        }

        if (executionStatus) {

            executionStatus.innerHTML = `
                <i class="fa-solid fa-circle"></i>
                Executing
            `;

        }

        if (outputPlaceholder) {
            outputPlaceholder.style.display = "none";
        }

        if (outputText) {
            outputText.style.display = "none";
        }


        const startTime = performance.now();


        try {

            /*
             * Flask API
             * POST /api/execute
             *
             * Request:
             * { "code": "print('Hello')" }
             *
             * Expected response:
             * { "output": "Hello" }
             */


            const response = await fetch("http://127.0.0.1:5000/api/execute", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    code: code
                })

            });


            // Parse response safely
            const responseText = await response.text();

let result;

try {
    result = JSON.parse(responseText);
} catch (error) {
    console.error("Invalid server response:", responseText);

    throw new Error(
        "Invalid response from Flask. Check the API URL and backend."
    );
}


            const endTime = performance.now();

            const elapsedTime =
                ((endTime - startTime) / 1000).toFixed(3);


            if (!response.ok) {

                throw new Error(
                    result.error || "Code execution failed."
                );

            }


            // Display program output
            const programOutput =
                result.output ?? result.stdout ?? "";

            displayOutput(programOutput);


            if (outputStatus) {
                outputStatus.textContent = "Completed";
            }


            if (executionTime) {

                executionTime.innerHTML = `
                    <i class="fa-regular fa-clock"></i>
                    Execution Time:
                    ${result.execution_time ?? elapsedTime + "s"}
                `;

            }


            if (executionStatus) {

                executionStatus.innerHTML = `
                    <i class="fa-solid fa-circle-check"
                       style="color:#22c55e"></i>
                    Success
                `;

            }


            showSuccess("Code executed successfully!");

        }


        catch (error) {

            displayOutput(
                error.message || "Unable to connect to the server.",
                "error"
            );


            if (outputStatus) {
                outputStatus.textContent = "Error";
            }


            if (executionTime) {

                executionTime.innerHTML = `
                    <i class="fa-regular fa-clock"></i>
                    Execution Time: --
                `;

            }


            if (executionStatus) {

                executionStatus.innerHTML = `
                    <i class="fa-solid fa-circle-xmark"
                       style="color:#ef4444"></i>
                    Failed
                `;

            }


            showError(error.message || "Code execution failed.");

        }


        finally {

            runBtn.disabled = false;

            runBtn.innerHTML = `
                <i class="fa-solid fa-play"></i>
                Run
            `;

        }

    });

}


/* =============================================
   13. CLEAR OUTPUT
   ============================================= */

const clearOutputBtn =
    document.getElementById("clearOutput");


if (clearOutputBtn) {

    clearOutputBtn.addEventListener("click", () => {

        if (outputText) {

            outputText.textContent = "";

            outputText.style.display = "none";

        }


        if (outputPlaceholder) {
            outputPlaceholder.style.display = "flex";
        }


        if (outputStatus) {
            outputStatus.textContent = "Ready";
        }


        if (executionTime) {

            executionTime.innerHTML = `
                <i class="fa-regular fa-clock"></i>
                Execution Time: --
            `;

        }


        if (executionStatus) {

            executionStatus.innerHTML = `
                <i class="fa-solid fa-circle"></i>
                Waiting
            `;

        }


        showInfo("Output cleared.");

    });

}


/* =============================================
   14. COPY OUTPUT
   ============================================= */

const copyOutputBtn =
    document.getElementById("copyOutput");


if (copyOutputBtn) {

    copyOutputBtn.addEventListener("click", async () => {

        if (!outputText || outputText.style.display === "none") {

            showWarning("No output available to copy.");

            return;

        }


        try {

            await navigator.clipboard.writeText(
                outputText.textContent
            );

            showSuccess("Output copied successfully!");

        }


        catch (error) {

            showError("Unable to copy output.");

        }

    });

}


/* =============================================
   15. SHARE CODE
   ============================================= */

const shareBtn = document.getElementById("shareBtn");


if (shareBtn && editor) {

    shareBtn.addEventListener("click", async () => {

        const code = editor.getValue();


        if (!code.trim()) {

            showWarning("Nothing to share!");

            return;

        }


        try {

            if (navigator.share) {

                await navigator.share({

                    title: "PyStrix Code",

                    text: code

                });

            }

            else {

                await navigator.clipboard.writeText(code);

                showSuccess("Code copied! Ready to share.");

            }

        }


        catch (error) {

            if (error.name !== "AbortError") {

                showError("Unable to share code.");

            }

        }

    });

}


/* =============================================
   16. VISUALIZE BUTTON
   ============================================= */

const visualizeBtn =
    document.getElementById("visualizeBtn");


if (visualizeBtn) {

    visualizeBtn.addEventListener("click", () => {

        showInfo("Code visualization is coming soon!");

    });

}


/* =============================================
   17. AI ASSISTANT
   ============================================= */

const aiBtn = document.getElementById("aiBtn");


if (aiBtn) {

    aiBtn.addEventListener("click", () => {

        showInfo("AI Assistant is coming soon!");

    });

}


/* =============================================
   18. DEBUGGING
   ============================================= */

const debugBtn = document.getElementById("debugBtn");


if (debugBtn) {

    debugBtn.addEventListener("click", () => {

        showInfo("Debugging tools are coming soon!");

    });

}


/* =============================================
   19. SETTINGS BUTTONS
   ============================================= */

function openAppearanceSettings() {

    if (!appearanceMenu) return;

    appearanceMenu.classList.add("show");

}


const settingsBtn = document.getElementById("settingsBtn");

const editorSettingsBtn =
    document.getElementById("editorSettingsBtn");


if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        openAppearanceSettings
    );

}


if (editorSettingsBtn) {

    editorSettingsBtn.addEventListener(
        "click",
        openAppearanceSettings
    );

}


/* =============================================
   20. RESIZABLE EDITOR AND OUTPUT
   ============================================= */

const resizer = document.getElementById("resizer");

const editorPanel = document.getElementById("editorPanel");

const outputPanel = document.getElementById("outputPanel");

const workspace = document.querySelector(".workspace");


let isResizing = false;


if (resizer && editorPanel && outputPanel && workspace) {

    resizer.addEventListener("pointerdown", (event) => {

        if (window.innerWidth <= 768) return;

        isResizing = true;

        resizer.classList.add("dragging");

        resizer.setPointerCapture(event.pointerId);

    });


    resizer.addEventListener("pointermove", (event) => {

        if (!isResizing) return;


        const workspaceRect = workspace.getBoundingClientRect();

        const availableWidth =
            workspaceRect.width -
            resizer.offsetWidth -
            editorPanel.offsetLeft;


        const newWidth =
            event.clientX -
            workspaceRect.left -
            editorPanel.offsetLeft;


        const percentage =
            (newWidth / availableWidth) * 100;


        if (percentage < 20 || percentage > 80) return;


        editorPanel.style.width = `${percentage}%`;

        editorPanel.style.flex = "none";

        outputPanel.style.flex = "1";

    });


    function stopResizing() {

        isResizing = false;

        resizer.classList.remove("dragging");

        if (editor) {
            editor.refresh();
        }

    }


    resizer.addEventListener("pointerup", stopResizing);

    resizer.addEventListener("pointercancel", stopResizing);

}


/* =============================================
   21. WINDOW RESIZE
   ============================================= */

window.addEventListener("resize", () => {

    if (editor) {
        editor.refresh();
    }

});


/* =============================================
   22. INITIALIZATION COMPLETE
   ============================================= */

console.log("PyStrix initialized successfully!");

if (typeof Swal !== "undefined") {

    console.log("SweetAlert2 is ready!");

} else {

    console.error("SweetAlert2 is not available.");

}

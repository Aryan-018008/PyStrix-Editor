
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


function showToast(icon, message) {
    if (!PyStrixToast) {
        console.error(message);
        return;
    }

    PyStrixToast.fire({
        icon,
        title: message
    });
}

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


function showConfirmation(title, message) {
    if (typeof Swal === "undefined") {
        return Promise.resolve({ isConfirmed: false });
    }

    return Swal.fire({
        title,
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

if (closeWelcome) {
    closeWelcome.addEventListener("click", hideWelcome);
}

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


if (appearanceToggle && appearanceMenu) {
    appearanceToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        appearanceMenu.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (
            !appearanceMenu.contains(event.target) &&
            !appearanceToggle.contains(event.target)
        ) {
            appearanceMenu.classList.remove("show");
        }
    });
}


/* =============================================
   6. THEME RENDERING
   ============================================= */

function applyEditorTheme(theme, notify = true) {
    if (!editor) return;

    const isLight = theme === "light";

    editor.setOption(
        "theme",
        isLight ? "default" : "material-darker"
    );

    editor.refresh();

    if (notify) {
        showSuccess(
            isLight
                ? "Light theme activated!"
                : "Dark theme activated!"
        );
    }
}


if (editorTheme && editor) {
    editorTheme.addEventListener("change", function () {
        applyEditorTheme(this.value);
    });

    editorTheme.value = "dark";
    applyEditorTheme("dark", false);
}


/* =============================================
   7. FONT SIZE
   ============================================= */

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

        showSuccess("Editor text style updated!");
    });
}


/* =============================================
   9. RESET EDITOR APPEARANCE
   ============================================= */

if (resetAppearance && editor) {
    resetAppearance.addEventListener("click", () => {
        if (editorTheme) editorTheme.value = "dark";
        if (fontSize) fontSize.value = "14";
        if (textStyle) textStyle.value = "normal";

        applyEditorTheme("dark", false);

        const wrapper = editor.getWrapperElement();

        wrapper.style.fontSize = "14px";
        wrapper.style.fontWeight = "400";
        wrapper.style.fontStyle = "normal";

        editor.refresh();

        showSuccess("Editor settings reset!");
    });
}


/* =============================================
   10. TERMINAL ELEMENTS
   ============================================= */

const runBtn = document.getElementById("runBtn");
const stopExecutionBtn = document.getElementById("stopExecution");

const outputText = document.getElementById("outputText");
const outputPlaceholder = document.getElementById("outputPlaceholder");
const outputStatus = document.getElementById("outputStatus");

const executionTime = document.getElementById("executionTime");
const executionStatus = document.getElementById("executionStatus");

const terminal = document.getElementById("terminal");
const terminalInputForm = document.getElementById("terminalInputForm");
const terminalPrompt = document.getElementById("terminalPrompt");
const terminalInput = document.getElementById("terminalInput");

const outputContent = document.getElementById("outputContent");

const API_BASE_URL = "http://127.0.0.1:5000";

let activeSessionId = null;
let terminalBuffer = "";
let inputPending = false;
let executionFinished = true;
let inputSubmitting = false;


/* =============================================
   11. TERMINAL DISPLAY
   ============================================= */

function displayTerminal() {
    if (outputPlaceholder) {
        outputPlaceholder.style.display = "none";
    }

    if (terminal) {
        terminal.style.display = "block";
    }

    renderTerminal();
}


function renderTerminal() {
    if (!outputText || !terminalInputForm || !terminalPrompt) return;

    const hasPendingPrompt =
        !executionFinished &&
        terminalBuffer.length > 0 &&
        !terminalBuffer.endsWith("\n");

    if (hasPendingPrompt) {
        const lastNewline = terminalBuffer.lastIndexOf("\n");

        const completedOutput =
            terminalBuffer.substring(0, lastNewline + 1);

        const currentPrompt =
            terminalBuffer.substring(lastNewline + 1);

        outputText.textContent = completedOutput;
        terminalPrompt.textContent = currentPrompt;

        terminalInputForm.style.display = "flex";
        inputPending = true;

    } else {
        outputText.textContent = terminalBuffer;

        terminalInputForm.style.display = "none";
        inputPending = false;
    }

    if (outputContent) {
        outputContent.scrollTop = outputContent.scrollHeight;
    }
}


/* =============================================
   12. MOBILE CODE / OUTPUT NAVIGATION
   ============================================= */

const workspace = document.querySelector(".workspace");

const showEditorView =
    document.getElementById("showEditorView");

const showOutputView =
    document.getElementById("showOutputView");


function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
}


function switchMobileView(view) {
    if (!workspace) return;

    const showOutput = view === "output";

    workspace.classList.toggle("show-output", showOutput);

    if (showEditorView) {
        showEditorView.classList.toggle("active", !showOutput);

        showEditorView.setAttribute(
            "aria-selected",
            String(!showOutput)
        );
    }

    if (showOutputView) {
        showOutputView.classList.toggle("active", showOutput);

        showOutputView.setAttribute(
            "aria-selected",
            String(showOutput)
        );
    }

    if (!showOutput && editor) {
        requestAnimationFrame(() => editor.refresh());
    }

    if (showOutput && inputPending && terminalInput) {
        requestAnimationFrame(() => terminalInput.focus());
    }
}


if (showEditorView) {
    showEditorView.addEventListener("click", () => {
        switchMobileView("editor");
    });
}

if (showOutputView) {
    showOutputView.addEventListener("click", () => {
        switchMobileView("output");
    });
}


/* =============================================
   13. EXECUTION UI HELPERS
   ============================================= */

function updateExecutionTime(milliseconds) {
    if (!executionTime) return;

    executionTime.innerHTML = `
        <i class="fa-regular fa-clock"></i>
        Execution Time: ${milliseconds ?? "--"} ms
    `;
}


function updateExecutionStatus(success) {
    if (!executionStatus) return;

    executionStatus.innerHTML = success
        ? `
            <i class="fa-solid fa-circle-check"
               style="color:#22c55e"></i>
            Success
        `
        : `
            <i class="fa-solid fa-circle-xmark"
               style="color:#ef4444"></i>
            Failed
        `;
}


function setRunButtonRunning(running) {
    if (runBtn) {
        runBtn.disabled = running;

        runBtn.innerHTML = running
            ? `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Running
            `
            : `
                <i class="fa-solid fa-play"></i>
                Run
            `;
    }

    if (stopExecutionBtn) {
        stopExecutionBtn.style.display =
            running ? "grid" : "none";
    }
}


function resetTerminal() {
    terminalBuffer = "";
    inputPending = false;
    inputSubmitting = false;
    executionFinished = false;

    if (terminalInput) {
        terminalInput.value = "";
        terminalInput.disabled = false;
    }

    if (outputText) {
        outputText.textContent = "";
    }

    displayTerminal();
}


/* =============================================
   14. LIVE OUTPUT POLLING
   ============================================= */

async function pollTerminalOutput(sessionId) {
    while (activeSessionId === sessionId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/output/${sessionId}`
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to fetch program output."
                );
            }

            if (result.output) {
                terminalBuffer += result.output;
                displayTerminal();
            }

            updateExecutionTime(result.execution_time);

            if (result.finished) {
                executionFinished = true;
                inputPending = false;
                activeSessionId = null;

                if (terminalInputForm) {
                    terminalInputForm.style.display = "none";
                }

                if (terminalInput) {
                    terminalInput.disabled = true;
                }

                renderTerminal();
                setRunButtonRunning(false);

                const success = result.exit_code === 0;

                if (outputStatus) {
                    outputStatus.textContent =
                        success ? "Completed" : "Failed";
                }

                updateExecutionStatus(success);

                if (success) {
                    showSuccess("Code executed successfully!");
                } else {
                    showError("Python execution failed!");
                }

                break;
            }

            if (inputPending && terminalInput && !inputSubmitting) {
                if (document.activeElement !== terminalInput) {
                    terminalInput.focus();
                }
            }

            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error("Terminal polling error:", error);

            if (activeSessionId === sessionId) {
                activeSessionId = null;
                executionFinished = true;
                inputPending = false;

                terminalBuffer +=
                    "\nTerminal connection error: " + error.message;

                if (terminalInputForm) {
                    terminalInputForm.style.display = "none";
                }

                displayTerminal();
                setRunButtonRunning(false);

                if (outputStatus) {
                    outputStatus.textContent = "Connection Error";
                }

                updateExecutionStatus(false);
                showError(error.message);
            }

            break;
        }
    }
}


/* =============================================
   15. START PYTHON EXECUTION
   ============================================= */

if (runBtn && editor) {
    runBtn.addEventListener("click", async () => {
        const code = editor.getValue();

        if (!code.trim()) {
            showWarning("Please write some Python code first.");
            return;
        }

        if (activeSessionId) {
            showWarning("A program is already running.");
            return;
        }

        resetTerminal();
        setRunButtonRunning(true);

        if (outputStatus) {
            outputStatus.textContent = "Running";
        }

        if (executionStatus) {
            executionStatus.textContent = "Executing";
        }

        updateExecutionTime("--");

        if (isMobileView()) {
            switchMobileView("output");
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/start`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        code: code
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.output ||
                    result.message ||
                    "Unable to start Python execution."
                );
            }

            activeSessionId = result.session_id;

            pollTerminalOutput(activeSessionId);

        } catch (error) {
            executionFinished = true;

            terminalBuffer +=
                "Execution error: " + error.message;

            displayTerminal();
            setRunButtonRunning(false);

            if (outputStatus) {
                outputStatus.textContent = "Error";
            }

            updateExecutionStatus(false);
            showError(error.message);
        }
    });
}


/* =============================================
   16. TERMINAL INPUT
   ============================================= */

if (terminalInputForm && terminalInput) {
    terminalInputForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (
            !activeSessionId ||
            !inputPending ||
            inputSubmitting
        ) {
            return;
        }

        const userInput = terminalInput.value;
        const sessionId = activeSessionId;

        inputSubmitting = true;
        terminalInput.disabled = true;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/input/${sessionId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        input: userInput
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to send input."
                );
            }

            // Display the entered answer in the terminal.
            terminalBuffer += userInput + "\n";

            terminalInput.value = "";
            inputPending = false;

            renderTerminal();

        } catch (error) {
            showError(error.message);

        } finally {
            inputSubmitting = false;

            if (activeSessionId && terminalInput) {
                terminalInput.disabled = false;

                if (inputPending) {
                    terminalInput.focus();
                }
            }
        }
    });
}


/* =============================================
   17. STOP EXECUTION
   ============================================= */

if (stopExecutionBtn) {
    stopExecutionBtn.addEventListener("click", async () => {
        if (!activeSessionId) return;

        const sessionId = activeSessionId;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/stop/${sessionId}`,
                {
                    method: "POST"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to stop execution."
                );
            }

            terminalBuffer +=
                "\n\nExecution stopped by user.\n";

            executionFinished = true;
            inputPending = false;
            activeSessionId = null;

            if (terminalInputForm) {
                terminalInputForm.style.display = "none";
            }

            if (terminalInput) {
                terminalInput.disabled = true;
            }

            renderTerminal();
            setRunButtonRunning(false);

            if (outputStatus) {
                outputStatus.textContent = "Stopped";
            }

            updateExecutionStatus(false);
            showInfo("Execution stopped.");

        } catch (error) {
            showError(error.message);
        }
    });
}


/* =============================================
   18. CLEAR OUTPUT
   ============================================= */

const clearOutputBtn =
    document.getElementById("clearOutput");


if (clearOutputBtn) {
    clearOutputBtn.addEventListener("click", () => {
        if (activeSessionId) {
            showWarning(
                "Stop the running program before clearing output."
            );
            return;
        }

        terminalBuffer = "";
        inputPending = false;
        executionFinished = true;

        if (terminal) {
            terminal.style.display = "none";
        }

        if (terminalInput) {
            terminalInput.value = "";
            terminalInput.disabled = false;
        }

        if (terminalInputForm) {
            terminalInputForm.style.display = "none";
        }

        if (outputText) {
            outputText.textContent = "";
        }

        if (outputPlaceholder) {
            outputPlaceholder.style.display = "flex";
        }

        if (outputStatus) {
            outputStatus.textContent = "Ready";
        }

        updateExecutionTime("--");

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
   19. COPY OUTPUT
   ============================================= */

const copyOutputBtn =
    document.getElementById("copyOutput");


if (copyOutputBtn) {
    copyOutputBtn.addEventListener("click", async () => {
        if (!terminalBuffer) {
            showWarning("No output available to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(terminalBuffer);

            showSuccess("Output copied successfully!");

        } catch (error) {
            showError("Unable to copy output.");
        }
    });
}


/* =============================================
   20. SHARE CODE
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

            } else {
                await navigator.clipboard.writeText(code);

                showSuccess("Code copied! Ready to share.");
            }

        } catch (error) {
            if (error.name !== "AbortError") {
                showError("Unable to share code.");
            }
        }
    });
}


/* =============================================
   21. VISUALIZE BUTTON
   ============================================= */

const visualizeBtn =
    document.getElementById("visualizeBtn");


if (visualizeBtn) {
    visualizeBtn.addEventListener("click", () => {
        showInfo("Code visualization is coming soon!");
    });
}


/* =============================================
   22. AI ASSISTANT
   ============================================= */

const aiBtn = document.getElementById("aiBtn");


if (aiBtn) {
    aiBtn.addEventListener("click", () => {
        showInfo("AI Assistant is coming soon!");
    });
}


/* =============================================
   23. DEBUGGING
   ============================================= */

const debugBtn = document.getElementById("debugBtn");


if (debugBtn) {
    debugBtn.addEventListener("click", () => {
        showInfo("Debugging tools are coming soon!");
    });
}


/* =============================================
   24. SETTINGS BUTTONS
   ============================================= */

function openAppearanceSettings() {
    if (!appearanceMenu) return;

    appearanceMenu.classList.add("show");
}


const settingsBtn =
    document.getElementById("settingsBtn");

const editorSettingsBtn =
    document.getElementById("editorSettingsBtn");


if (settingsBtn) {
    settingsBtn.addEventListener("click", openAppearanceSettings);
}

if (editorSettingsBtn) {
    editorSettingsBtn.addEventListener("click", openAppearanceSettings);
}


/* =============================================
   25. RESIZABLE EDITOR AND OUTPUT
   ============================================= */

const resizer = document.getElementById("resizer");

const editorPanel = document.getElementById("editorPanel");

const outputPanel = document.getElementById("outputPanel");

let isResizing = false;


if (resizer && editorPanel && outputPanel && workspace) {
    resizer.addEventListener("pointerdown", (event) => {
        if (isMobileView()) return;

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
   26. WINDOW RESIZE
   ============================================= */

window.addEventListener("resize", () => {
    if (editor) {
        editor.refresh();
    }
});


/* =============================================
   27. KEYBOARD SHORTCUT
   ============================================= */

if (editor) {
    editor.setOption("extraKeys", {
        "Ctrl-Enter": () => {
            if (runBtn && !runBtn.disabled) {
                runBtn.click();
            }
        },

        "Cmd-Enter": () => {
            if (runBtn && !runBtn.disabled) {
                runBtn.click();
            }
        }
    });
}


/* =============================================
   28. INITIALIZATION COMPLETE
   ============================================= */

console.log("PyStrix initialized successfully!");

if (typeof Swal !== "undefined") {
    console.log("SweetAlert2 is ready!");
} else {
    console.error("SweetAlert2 is not available.");
}

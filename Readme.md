# PyStrix — Online Python Coding Environment

<p align="center">
  <strong>Code. Compete. Conquer.</strong><br/>
  A lightweight, browser-based Python editor with an integrated AI coding assistant.
</p>

<p align="center">
  <a href="https://pystrix-editor-008.onrender.com">Live</a> ·
  <a href="https://github.com/Aryan-018008/PyStrix-Editor">Source Code</a>
</p>

---

## Overview

**PyStrix** is a browser-based Python coding environment designed to make writing, executing, debugging, and understanding Python code accessible through a clean, responsive interface.

The platform combines a focused code editor and interactive execution console with an AI-assisted workflow. Users can write Python programs, run code, provide standard input, inspect execution results, and ask an AI assistant to explain code or help diagnose and improve it.

The project is built using a lightweight web stack and is deployed as separate frontend and backend services.

## Key Capabilities

### Python Editor & Execution
- Code editing powered by **CodeMirror**
- Execute Python code directly from the browser
- Stop running execution when needed
- Interactive standard input (`stdin`) support
- Terminal-style output and error display
- Execution status and elapsed-time feedback
- Editor and output panel resizing
- Keyboard shortcuts for common actions

### Editor Experience
- Editor themes and configurable settings
- Responsive layout for desktop and mobile
- Mobile editor/output navigation
- Clean workspace focused on coding
- Code sharing support

### AI Coding Assistant
The integrated AI assistant provides contextual coding support through four modes:

| Mode | Purpose |
|---|---|
| **Ask** | Ask programming questions and get contextual answers |
| **Explain Code** | Understand the logic, structure, and behavior of code |
| **Fix Error** | Get assistance analyzing runtime errors and tracebacks |
| **Fix Code** | Request suggestions to improve or correct code |

Additional assistant capabilities:
- Context-aware prompts using editor code
- Error and traceback context where applicable
- Streaming responses for progressive output
- Markdown-formatted responses
- Sanitized Markdown rendering
- Copy code snippets directly from AI responses

---

## Architecture

PyStrix uses a frontend–backend architecture with independently deployed services.

```text
┌─────────────────────────────────────┐
│             Web Client              │
│                                     │
│ HTML · CSS · JavaScript             │
│ CodeMirror · Markdown UI             │
└──────────────────┬──────────────────┘
                   │ HTTP / SSE
                   ▼
┌─────────────────────────────────────┐
│           Flask Backend             │
│                                     │
│ Python Execution · AI API           │
│ Request Processing · CORS            │
└──────────────────┬──────────────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
┌──────────────────┐ ┌──────────────────┐
│ Python Execution │ │  Groq AI Service │
│     Service      │ │  AI Responses    │
└──────────────────┘ └──────────────────┘
```

## Technology Stack

### Frontend
- **HTML5** — application structure
- **CSS3** — responsive UI and styling
- **JavaScript** — client-side logic and API communication
- **CodeMirror** — code editor
- **Marked** — Markdown rendering
- **DOMPurify** — sanitization of rendered HTML
- **SweetAlert2** — user-facing dialogs
- **Font Awesome** — icons

### Backend
- **Python**
- **Flask** — web framework and API
- **Flask-CORS** — cross-origin communication
- **Groq API** — AI-assisted programming features
- **Server-Sent Events (SSE)** — streamed AI responses
- **Gunicorn** — production application server

### Deployment
- **Render** — deployment and hosting
- **GitHub** — Version Control

---

## Project Structure

```text
PyStrixx/
│
├── user/                         # Frontend application
│   ├── assets/neon PyStrix Python Emblem.png
│   ├── css/style.css
│   └── js/script.js
│   ├── index.html
│   ├── documentation.html
│   ├── feedback.html
│
├── server/                       # Backend application
│   ├── database/db.py
│   ├── pystrix.db
│   ├── routes/ai.py
│   ├── routes/execution.py
│   ├── routes/feedback.py
│   ├── service/ai_service.py
│   ├── service/execution_service.py
│   ├── testing/testCases_v1.txt
│   ├── testing/testCases_v2.txt
│   ├── app.py
│   └── config.py                       
│   ├── requirements.txt
│ 
│
└── Readme.md
```

> The structure above represents the primary project layout; supporting backend files may vary as the implementation evolves.

## Application Workflow

1. The user writes Python code in the browser-based editor.
2. The frontend sends execution requests to the backend.
3. The backend processes the request and executes the Python code.
4. Output, errors, and input prompts are returned to the frontend.
5. For AI assistance, the client sends the selected mode, prompt, and relevant code context.
6. The backend communicates with the Groq API.
7. AI responses are streamed to the client and rendered in the assistant panel.

---

## Live Deployment

| Component | URL |
|---|---|
| **Frontend** | https://pystrix-editor-008.onrender.com |
| **Backend** | https://pystrix-editor-018.onrender.com |
| **GitHub Repository** | https://github.com/Aryan-018008/PyStrix-Editor |

---

## Local Development

### Prerequisites

- Python 3.x
- Git
- A Groq API key for AI features

### 1. Clone the repository

```bash
git clone https://github.com/Aryan-018008/PyStrix-Editor.git
cd PyStrixx
```

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd server
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory and configure your API key:

```env
GROQ_API_KEY=your_groq_api_key
AI_MODEL=openai/gpt-oss-20b
```

> Keep secrets in environment variables. Never commit your `.env` file or expose API keys in frontend code.

### 3. Run the backend

Start the Flask application using the project's configured entry point. For example, if the application entry point is `app.py`:

```bash
python app.py
```

### 4. Run the frontend

Open the frontend `index.html` in a browser or use a local static web server, depending on the configured API URL and browser requirements.

> For local development, ensure the frontend API configuration points to your local backend instance rather than the production endpoint.

---

## Deployment Notes

PyStrix is deployed using separate frontend and backend services.

- Configure the backend environment variables in the hosting dashboard.
- Set the frontend API base URL to the deployed backend URL.
- Configure CORS to allow the deployed frontend origin.
- Use the production application server configured for the backend deployment.
- Do not place API secrets in the frontend or public repository.

---

## Testing & Validation

The project has been tested across core editor and AI workflows, including:

- Python code execution
- Interactive input handling
- Run and stop controls
- AI Ask workflow
- Code explanation
- Error assistance
- Code improvement requests
- Streaming response behavior
- Empty prompt handling
- API and network error handling
- Long code input
- Repeated AI requests
- Responsive/mobile interaction

Testing reflects the development validation performed on the project; it is not a formal third-party QA or security certification.
- All the test cases are mentioned on testCases_v1.txt and testCases_v2.txt

---

## Security Considerations

- AI API credentials are maintained on the backend.
- Markdown output is sanitized before rendering.
- Frontend and backend communication is configured through API endpoints.
- CORS is configured to permit the intended client origin.

> **Note:** Python execution environments require additional isolation and resource controls before being used for untrusted code at production scale. PyStrix is a learning and portfolio project and should not be considered a hardened multi-tenant execution platform.

---

## Roadmap

Potential future improvements include:

- Improved execution isolation and resource limits
- Expanded test coverage and automated testing
- Additional editor customization
- More AI-assisted learning workflows
- Enhanced code-sharing and collaboration features

---

## Project Purpose

PyStrix was developed to explore the practical integration of a browser-based coding interface, backend code execution, interactive input/output, and AI-assisted programming workflows using a lightweight full-stack architecture.

## Author

**Aryan Bharadwaj**

- GitHub: https://github.com/Aryan-018008

---

<p align="center">
  <sub>PyStrix — Code. Compete. Conquer.</sub>
</p>

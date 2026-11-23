# PyStrix — Online Python Playground

> **Code. Compete. Conquer.**

PyStrix is a lightweight, web-based Python coding playground designed to let users write, execute, and test Python code directly in their browser. With a clean developer-focused interface, interactive terminal, customizable editor, and responsive design, PyStrix provides a simple environment for practicing Python without installing anything locally.

---

## 🚀 Live Demo

- **Frontend:** https://pystrix-editor-008.onrender.com
- **Backend API:** https://pystrix-editor-018.onrender.com

---

## ✨ Features

### 🧑‍💻 Python Code Editor
- Write Python code directly in the browser.
- Syntax highlighting powered by CodeMirror.
- Line numbers and bracket matching.
- Customizable editor font size.
- Text style customization.
- Dark and light editor themes.

### ▶️ Code Execution
- Execute Python code using the Run button.
- Live terminal output.
- Interactive input support for programs using `input()`.
- Execution time display.
- Execution status indicator.
- Stop running programs.
- Clear and copy output.

### 🎨 Editor Customization
- Dark and light editor themes.
- Font size adjustment.
- Text style customization.
- Resizable editor and output panels.

### 📱 Responsive Interface
- Mobile-responsive layout.
- Separate editor and output views on mobile.
- Responsive navigation and workspace.

### ⚡ Productivity Features
- Keyboard shortcut to run code: `Ctrl + Enter` / `Cmd + Enter`.
- Share code using native sharing capabilities where supported.
- Toast notifications using SweetAlert2.
- Editor settings reset.

### 📚 Python Handbook
An integrated Python learning handbook covering Python concepts and programming fundamentals.

### 💬 Feedback System
A feedback interface that allows users to submit suggestions, ratings, and feedback about PyStrix.

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Tailwind CSS (where integrated)
- CodeMirror
- SweetAlert2
- Font Awesome

### Backend
- Python
- Flask
- Flask-CORS
- Gunicorn

### Database
- SQLite

### Deployment
- Render

---

## 📁 Project Structure

```text
PyStrix/
│
├── user/
│   ├── index.html
│   ├── documentation.html
│   ├── feedback.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── assets/
│
├── server/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   │
│   ├── routes/
│   │   ├── execution.py
│   │   └── feedback.py
│   │
│   ├── service/
│   │   └── execution_service.py
│   │
│   └── database/
│       ├── db.py
│       └── pystrix.db
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run PyStrix locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Aryan-018008/PyStrix-Editor.git
cd PyStrix-Editor
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**Windows:**

```powershell
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Configure the Backend

Navigate to the backend folder:

```bash
cd server
```

Ensure your configuration is properly set in `config.py` and any required environment variables are configured.

### 6. Start the Flask Backend

```bash
python app.py
```

The backend will run at:

```text
http://127.0.0.1:5000
```

### 7. Launch the Frontend

Open the frontend's `index.html` using a local development server, such as the Live Server extension in Visual Studio Code.

The frontend and backend must be accessible to each other, and the backend CORS configuration must allow the frontend origin.

---

## 🔌 API Endpoints

### Code Execution

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/start` | Start Python code execution |
| GET | `/api/output/<session_id>` | Retrieve execution output |
| POST | `/api/input/<session_id>` | Send input to a running program |
| POST | `/api/stop/<session_id>` | Stop an active execution session |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend availability |

### Feedback

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/feedback` | Submit user feedback |

---

## 🎯 Project Goals

PyStrix aims to make Python programming accessible and convenient by providing:

- A simple coding environment.
- Quick Python execution.
- Interactive terminal functionality.
- A beginner-friendly interface.
- Responsive usability across devices.
- A foundation for future AI-powered programming assistance.

---

## 🔮 Future Enhancements

- AI-powered coding assistant.
- AI error detection and debugging.
- AI code explanations.
- AI-generated code fixes.
- Code optimization suggestions.
- Automated test-case generation.
- Enhanced coding productivity tools.

---

## ⚠️ Security Notice

PyStrix executes user-submitted Python code on its backend. Running arbitrary code on a publicly accessible server requires appropriate sandboxing and security protections.

The current version is a project-level implementation and should not be considered a hardened production execution environment for untrusted code.

---

## 👨‍💻 Developer

**Aryan Bharadwaj**

GitHub: (https://github.com/Aryan-018008)

---

## 📄 License

This project is currently available as a personal project. A formal license may be added in the future.

---

> **PyStrix — Code. Compete. Conquer.**

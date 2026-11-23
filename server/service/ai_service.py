
from groq import Groq
from config import Config


class AIService:

    @staticmethod
    def get_client():
        if not Config.GROQ_API_KEY:
            raise ValueError("Groq API key is not configured.")

        return Groq(api_key=Config.GROQ_API_KEY)

    @staticmethod
    def generate_response(
        user_message,
        code="",
        error="",
        mode="ask"
    ):

        client = AIService.get_client()

        system_prompt = """
You are PyStrix AI Assistant, an expert Python programming tutor.

Your goal is to help Python programmers understand code, solve errors,
improve code and learn programming concepts.

Guidelines:
- Explain concepts in simple, beginner-friendly language.
- Be accurate and practical.
- When debugging, identify the actual cause of the error.
- When suggesting a fix, provide corrected code.
- Preserve the user's original intent when correcting code.
- Avoid unnecessary complexity.
- Use Markdown formatting for readability.
- Never pretend code has been executed or tested.
"""

        mode_instructions = {

            "ask": """
Answer the user's programming question clearly.
Use the provided code as context when relevant.
""",

            "explain": """
Explain the provided Python code step by step.
Describe what the code does, how it works and important concepts.
Use simple examples where helpful.
""",

            "debug": """
Analyze the provided Python code and execution error.

Explain:
1. What the error means.
2. Why the error occurred in this code.
3. How to fix it.
4. Provide corrected code when possible.
""",

            "fix": """
Fix the provided Python code.

Requirements:
1. Identify the problem briefly.
2. Provide the corrected code in a Python code block.
3. Explain the important changes.
4. Preserve the original functionality wherever possible.
"""
        }

        selected_instruction = mode_instructions.get(
            mode,
            mode_instructions["ask"]
        )

        user_prompt = f"""
{selected_instruction}

USER QUESTION:
{user_message}

PYTHON CODE:
{code if code else "No code provided."}

EXECUTION ERROR:
{error if error else "No execution error provided."}
"""

        response = client.chat.completions.create(
            model=Config.AI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.3,
            max_tokens=2048
        )

        return response.choices[0].message.content
    
    @staticmethod
    def stream_response(user_message, code="", error="", mode="ask"):

        client = AIService.get_client()

        system_prompt = """
You are PyStrix AI, a concise Python programming assistant.

Rules:
- Give short, direct and useful answers.
- Prefer 3-6 concise bullet points when appropriate.
- Use simple language suitable for beginners.
- For coding questions, provide small examples only when necessary.
- For debugging, explain the cause and the fix briefly.
- Avoid lengthy introductions, unnecessary conclusions and repetition.
- Keep answers focused on the user's actual question.
- Never claim code was executed or tested unless it actually was.
"""

        mode_instructions = {
            "ask": "Answer the Python programming question concisely.",
            "explain": "Explain the provided Python code briefly, step by step.",
            "debug": "Briefly explain the error, its cause and the fix. Provide corrected code when useful.",
            "fix": "Correct the code, preserve its original intent and briefly explain the changes."
        }

        selected_instruction = mode_instructions.get(
            mode,
            mode_instructions["ask"]
        )

        user_prompt = f"""
{selected_instruction}

USER QUESTION:
{user_message}

PYTHON CODE:
{code if code else "No code provided."}

EXECUTION ERROR:
{error if error else "No execution error provided."}
"""

        stream = client.chat.completions.create(
            model=Config.AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_completion_tokens=1024,
            reasoning_effort="low",
            stream=True
        )

        for chunk in stream:

            if not chunk.choices:
                continue

            content = chunk.choices[0].delta.content

            if content:
                yield content


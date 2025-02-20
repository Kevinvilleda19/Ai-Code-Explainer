import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/explain", methods=["POST"])
def explain_code():
    data = request.json
    code_input = data.get("code")

    if not code_input:
        return jsonify({"error": "No code provided"}), 400

    try:
        model = os.getenv("OLLAMA_MODEL", "mistral")  # Default to mistral
        response = ollama.chat(model=model, messages=[
            {"role": "system", "content": "You are an AI assistant that explains code simply."},
            {"role": "user", "content": f"Explain the following code:\n\n{code_input}"}
        ])

        return jsonify({"explanation": response['message']['content']})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
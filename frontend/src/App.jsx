import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

// Local Backend API URL
const API_URL = "http://127.0.0.1:5000/explain";

// Simulated Background Code for Scrolling Effect
const generateDummyCode = () => {
  return `
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");

const fetchData = async () => {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
fetchData();
  `.repeat(10);
};

function App() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [dummyCode, setDummyCode] = useState(generateDummyCode());
  const [language, setLanguage] = useState("auto");

  // Language mappings for CodeMirror extensions
  const languageExtensions = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp(),
    auto: EditorView.lineWrapping,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDummyCode(generateDummyCode());
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleExplain = async () => {
    if (!code.trim()) {
      alert("Please enter some code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language: language === "auto" ? "unknown" : language }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate explanation.");
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error(error);
      alert("Failed to generate explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center transition-all relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-800 text-white">
      {/* Moving Background Code */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
        <div className="code-background animate-scroll bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 text-green-400 font-mono">
          <pre>{dummyCode}</pre>
        </div>
        <div className="code-background animate-scroll-delayed bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 text-green-400 font-mono">
          <pre>{dummyCode}</pre>
        </div>
      </div>

      {/* Main UI */}
      <div className="w-full max-w-6xl p-6 bg-opacity-95 rounded-lg shadow-lg z-10 relative transition-all duration-300 ease-in-out border border-indigo-500/50 bg-gray-900/95 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg w-full text-center animate-gradient">
            AlgoAura
          </h1>
        </div>

        {/* Language Selector */}
        <div className="mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded-md border border-indigo-600/50"
          >
            <option value="auto">Auto-Detect</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="unknown">Other (No Highlighting)</option>
          </select>
        </div>

        {/* Code Editor */}
        <CodeMirror
          value={code}
          height="250px"
          theme={oneDark}
          extensions={[javascript(), EditorView.lineWrapping]}
          onChange={(value) => setCode(value)}
          className="border border-indigo-600/50 rounded-md w-full shadow-inner bg-gray-800/50"
        />

        {/* Explain Button */}
        <button
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-400 hover:to-blue-500 flex items-center justify-center mt-4 transition-all shadow-xl hover:shadow-2xl disabled:opacity-60"
          onClick={handleExplain}
          disabled={loading}
        >
          {loading ? <ClipLoader size={24} color="#ffffff" /> : "Explain"}
        </button>

        {/* Explanation Section */}
        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-gray-800/80 rounded-lg shadow-xl w-full border border-indigo-500/30"
            >
              <h2 className="text-xl font-semibold mb-2 text-green-400">Explanation:</h2>
              <p className="text-gray-100">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

// Local Backend API URL
const API_URL = "http://127.0.0.1:5000/explain"; // Updated to local backend

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
  `.repeat(10); // Adjust repetition for screen coverage
};

function App() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [dummyCode, setDummyCode] = useState(generateDummyCode());

  // Refresh the background code every 25 seconds
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
        body: JSON.stringify({ code }),
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
    <div
      className={`h-screen w-screen flex flex-col justify-center items-center transition-all relative ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Moving Background Code */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
        <div className="code-background">
          <pre>{dummyCode}</pre>
        </div>
        <div className="code-background">
          <pre>{dummyCode}</pre>
        </div>
      </div>

      {/* Main UI */}
      <div className="w-full max-w-3xl p-6 bg-opacity-95 rounded-lg shadow-lg z-10 relative transition-all duration-300 ease-in-out border border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-2xl text-center animate-pulse w-full">
            AlgoAura
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-700 text-white text-lg rounded-md hover:bg-gray-600 transition-all shadow-lg"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Code Editor */}
        <CodeMirror
          value={code}
          height="250px"
          theme={oneDark}
          extensions={[javascript()]}
          onChange={(value) => setCode(value)}
          className="border border-gray-700 rounded-md"
        />

        {/* Explain Button */}
        <button
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 flex items-center justify-center mt-4 transition-all shadow-xl"
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
              className="mt-6 p-4 bg-gray-700 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
              <p className="text-gray-200">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

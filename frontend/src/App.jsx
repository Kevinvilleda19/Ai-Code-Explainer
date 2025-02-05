import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

// Simulated background code (Repeat this for effect)
const dummyCode = `
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
`.repeat(50); // Increased repetition to fill the screen

function App() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleExplain = async () => {
    if (!code.trim()) {
      alert("Please enter some code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/explain", {
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
    <div className={`h-screen w-screen flex flex-col justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} transition-all relative`}>

      {/* Moving Background Code */}
      <div className="code-background">
        <pre>{dummyCode}</pre>
      </div>

      {/* Main UI */}
      <div className="w-full max-w-3xl p-6 bg-gray-800 shadow-2xl rounded-lg z-10 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">AI-Powered Code Explainer</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <CodeMirror
          value={code}
          height="250px"
          theme={oneDark}
          extensions={[javascript()]}
          onChange={(value) => setCode(value)}
          className="border border-gray-700 rounded-md"
        />

        <button
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center mt-4 transition-all"
          onClick={handleExplain}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Explain"}
        </button>

        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-gray-700 rounded-lg"
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

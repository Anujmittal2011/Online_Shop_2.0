import { useState, useRef, useEffect } from "react";
import SummaryApi from "../common";

const AiAssistant = ({ productId }) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(SummaryApi.aiChat.url, {
        method: SummaryApi.aiChat.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: question, productId }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch AI response");
      }

      setHistory((prev) => [
        ...prev,
        { from: "user", text: question },
        { from: "assistant", text: data.answer },
      ]);
      setQuestion("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!messagesRef.current) return;
    const el = messagesRef.current;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [history]);

  return (
    <div className="mt-8 rounded-xl border border-slate-200 p-4 shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-3">Product assistant</h3>
      <p className="text-sm text-slate-500 mb-4">
        Ask about this product and get an instant response.
      </p>

      <div ref={messagesRef} className="space-y-3 mb-4 max-h-72 overflow-y-auto">
        {history.length === 0 && (
          <p className="text-sm text-slate-400">Type a question to get started.</p>
        )}
        {history.map((entry, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 ${entry.from === "assistant" ? "bg-slate-100 text-slate-800" : "bg-red-50 text-red-700"}`}
          >
            <div className="text-xs font-semibold uppercase tracking-wide mb-1">
              {entry.from === "assistant" ? "Assistant" : "You"}
            </div>
            <div>{entry.text}</div>
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full rounded border border-slate-300 p-3 focus:border-red-500 focus:outline-none"
          placeholder="Ask about delivery, size, warranty, or compatibility..."
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Sending..." : "Send question"}
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;

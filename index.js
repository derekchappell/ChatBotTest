import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, data.reply]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error: Unable to get a response." }]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-4 space-y-4">
        <div className="text-xl font-semibold">💬 GPT Chatbot</div>
        <div className="h-96 overflow-y-auto space-y-2 border p-2 rounded">
          {messages.filter(m => m.role !== "system").map((msg, i) => (
            <div key={i} className={\`p-2 rounded-lg \${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}\`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-sm text-gray-400">Typing...</div>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-xl px-4 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

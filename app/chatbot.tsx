"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa";
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Hello! How can I assist you today?" },
      ]);
    }, 500);
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Send welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { from: "bot", text: "👋 Welcome to EduPortal! How can I help you today?" },
      ]);
    }
  }, [isOpen]);

  return (
    <div>
      {/* Floating Chat Icon */}
      <div
  className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer shadow-2xl hover:scale-110 hover:animate-pulse transition-transform duration-300 z-50"
  onClick={toggleChat}
>
  <FaCommentDots />
</div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-[400px] h-[580px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col z-50 transform transition-transform duration-300 animate-slideUp">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex justify-between items-center p-4 rounded-t-3xl">
            Chat with us
            <button
              onClick={toggleChat}
              className="text-white text-lg hover:text-gray-200 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Chat Body */}
          <div
            className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200"
            ref={bodyRef}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[75%] break-words shadow-md ${
                  msg.from === "user"
                    ? "bg-gradient-to-r from-blue-200 to-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex border-t border-gray-300 p-2 bg-gray-50 rounded-b-3xl">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border border-gray-300 rounded-l-2xl p-3 outline-none  focus:none"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 rounded-r-2xl hover:brightness-110 transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;

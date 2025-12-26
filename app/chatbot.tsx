"use client";
import React, { useState, useRef, useEffect, Ref } from "react";
import { FaCommentDots } from "react-icons/fa";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import instance from "@/helper/axios";
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const stompRef = useRef<Client | null>(null);


  const toggleChat = () => setIsOpen(!isOpen);

  // useEffect(() => {
  //   if (!isOpen) return
  //   console.log('Creating STOMP client...');
  //   // const stompClient = new Client({
  //   //   brokerURL: "https://localhost:8080/api/ws",
  //   // });

  //   const stompClient = new Client({
  //     webSocketFactory: () => new SockJS("https://localhost:8080/api/ws"),
  //   });

  //   stompClient.onConnect = () => {
  //     const subscription = stompClient.subscribe("/topic/chat/response", (greeting) => {

  //       const message = JSON.parse(greeting.body)

  //       setMessages((prev) => [
  //         ...prev,
  //         { from: "bot", text: message?.message },
  //       ]);
  //     })

  //     //to prevent memory leak
  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }


  //   stompClient.onWebSocketError = (error) => {
  //     console.error('Error with websocket', error);
  //   };

  //   console.log('Activating STOMP connection...');

  //   stompClient.debug = (e) => console.log("Debug: " + e);

  //   stompClient.connectHeaders = {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   };
  //   stompClient.activate();


  //   stompRef.current = stompClient;

  //   return () => {
  //     console.log('Deactivating STOMP connection...');
  //     stompClient.deactivate();
  //   }
  // }, [isOpen]);

  // const stompRef = useRef(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 🔒 Prevent multiple clients
    if (stompRef.current) {
      console.log("STOMP already exists, skipping init");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("https://localhost:8080/api/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      debug: (msg) => console.log("STOMP:", msg),
      reconnectDelay: 0, // IMPORTANT
    });

    client.onConnect = () => {
      console.log("STOMP connected");

      // 🔒 Prevent duplicate subscriptions
      if (subscriptionRef.current) {
        console.log("Already subscribed");
        return;
      }

      subscriptionRef.current = client.subscribe(
        "/topic/chat/response",
        (greeting) => {
          const message = JSON.parse(greeting.body);
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: message?.message },
          ]);
        }
      );
    };

    client.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
    };

    client.activate();
    stompRef.current = client;

    return () => {
      console.log("Cleanup STOMP");

      if (subscriptionRef.current) {
        subscriptionRef!.current!.unsubscribe();
        subscriptionRef.current = null;
      }

      client.deactivate();
      stompRef.current = null;
    };
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) return

    async function fetchChats() {
      try {
        const res = await instance.get(`/chat`);
        const chats = res?.data

        chats?.forEach((chatItem: { prompt: string; response: string }) => {

          if (chatItem.prompt) {
            setMessages((prev) => [
              ...prev,
              { from: "user", text: chatItem.prompt },
            ])
          }

          if (chatItem.response) {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: chatItem.response },
            ])
          }
        });
      }
      catch (e) {
        console.log("e", e)
      }
    }

    fetchChats()
  }, [isOpen])


  const handleSend = () => {
    if (!input.trim()) return;
    if (!stompRef.current) return

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    stompRef?.current?.publish({
      destination: "/app/chat",
      body: JSON.stringify({ 'message': input })
    });
    // setTimeout(() => {
    //   setMessages((prev) => [
    //     ...prev,
    //     { from: "bot", text: "Hello! How can I assist you today?" },
    //   ]);
    // }, 500);
  };

  // useEffect(() => {
  //   stompRef?.current?.subscribe("/topic/chat/response", (greeting) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { from: "bot", text: greeting.body },
  //     ]);
  //   })
  // }, [stompRef])


  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef!.current!.scrollTop = bodyRef!.current!.scrollHeight;
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
            Ask questions and get clear answers.
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
                className={`p-3 rounded-2xl max-w-[75%] break-words shadow-md ${msg.from === "user"
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

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  WELCOME_MESSAGE,
  FALLBACK_MESSAGE,
  QUICK_REPLIES,
  findAnswer,
  getQuickReplyAnswer,
} from "./chatbotData";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const history = useHistory();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const addBotReply = useCallback((entry) => {
    const text = entry ? entry.answer : FALLBACK_MESSAGE;
    const link = entry?.link || null;
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text, link }]);
    }, 400);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    const entry = findAnswer(trimmed);
    addBotReply(entry);
  }, [input, addBotReply]);

  const handleQuickReply = useCallback(
    (key) => {
      const label = QUICK_REPLIES.find((q) => q.key === key)?.label || key;
      setMessages((prev) => [...prev, { from: "user", text: label }]);
      const entry = getQuickReplyAnswer(key);
      addBotReply(entry);
    },
    [addBotReply]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSend();
    },
    [handleSend]
  );

  const handleLinkClick = useCallback(
    (link) => {
      setOpen(false);
      history.push(link);
    },
    [history]
  );

  return (
    <>
      {/* Floating toggle */}
      <button
        className={`chatbot-toggle ${open ? "chatbot-toggle--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "\u2715" : "\uD83D\uDCAC"}
        {!open && hasUnread && <span className="chatbot-badge">1</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">
              <span role="img" aria-label="bot">🤖</span>
            </div>
            <div className="chatbot-header-info">
              <div className="chatbot-header-title">Learn TEK In Assistant</div>
              <div className="chatbot-header-subtitle">Ask me anything!</div>
            </div>
            <button
              className="chatbot-header-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-msg chatbot-msg--${msg.from}`}
              >
                {msg.text}
                {msg.link && (
                  <>
                    <br />
                    <button
                      className="chatbot-msg-link"
                      onClick={() => handleLinkClick(msg.link)}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      Go to page &rarr;
                    </button>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="chatbot-quick-replies">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.key}
                className="chatbot-quick-btn"
                onClick={() => handleQuickReply(qr.key)}
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbot-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              &#9654;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

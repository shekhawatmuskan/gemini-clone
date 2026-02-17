import React, { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Main = ({ onOpenSidebar = () => { } }) => {
  const {
    onSent,
    loading,
    messages,
    setInput,
    input,
    clearChat,
    regenerateLast,
  } = useContext(Context);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const fillPromptFromCard = (text) => {
    setInput(text);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  return (
    <div className="main">
      <div className="nav">
        <div className="nav-left">
          <img
            className="nav-menu"
            src={assets.menu_icon}
            alt="Open sidebar"
            onClick={onOpenSidebar}
          />
          <p>Gemini</p>
        </div>
        <img className="user-icon" src={assets.user_icon} alt="User Icon" />
      </div>
      <div className="main-container">
        {messages.length === 0 ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How Can I help you today?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  fillPromptFromCard(
                    "Suggest beautiful places to see on an upcoming road trip",
                  )
                }
              >
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  fillPromptFromCard(
                    "Briefly summarize this concept: urban planning",
                  )
                }
              >
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  fillPromptFromCard(
                    "Brainstorm team bonding activities for our work retreat",
                  )
                }
              >
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  fillPromptFromCard("Tell me about React js and React native")
                }
              >
                <p>Tell me about React js and React native</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={`${m.createdAt}-${idx}`}
                  className={`message ${isUser ? "message-user" : "message-assistant"}`}
                >
                  <img
                    src={isUser ? assets.user_icon : assets.gemini_icon}
                    alt={isUser ? "You" : "Gemini"}
                  />
                  <div className="message-content">
                    {isUser ? (
                      <p className="user-text">{m.content}</p>
                    ) : (
                      <>
                        <div className="assistant-actions">
                          <button
                            className="text-btn"
                            type="button"
                            onClick={async (e) => {
                              try {
                                await navigator.clipboard.writeText(m.content || "");
                                const originalText = e.target.innerText;
                                e.target.innerText = "Copied!";
                                setTimeout(() => {
                                  if (e.target) e.target.innerText = originalText;
                                }, 2000);
                              } catch {
                                // ignore
                              }
                            }}
                          >
                            Copy
                          </button>
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {loading ? (
              <div className="message message-assistant">
                <img src={assets.gemini_icon} alt="Gemini" />
                <div className="message-content">
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        )}

        <div className="main-bottom">
          <div className="chat-actions">
            <button className="text-btn" type="button" onClick={clearChat} disabled={loading}>
              Clear
            </button>
            <button className="text-btn" type="button" onClick={regenerateLast} disabled={loading || messages.length === 0}>
              Regenerate
            </button>
          </div>
          <div className="search-box">
            <textarea
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && input?.trim()) {
                  e.preventDefault();
                  onSent();
                }
              }}
              value={input}
              placeholder="Enter a prompt here"
              rows={1}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                className={`send ${input?.trim() && !loading ? "active" : ""}`}
                onClick={() => {
                  if (!loading && input?.trim()) onSent();
                }}
                src={assets.send_icon}
                alt="Send"
              />
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;

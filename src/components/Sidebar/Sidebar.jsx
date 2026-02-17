import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";

const Sidebar = ({ isOpen = false, onClose = () => { } }) => {
  const [extended, setExtended] = useState(false);
  const { chats, activeChatId, setActiveChatId, newChat } = useContext(Context);

  const handleNewChat = () => {
    newChat();
    onClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="top">
          <img
            onClick={() => {
              if (isOpen) {
                onClose();
              } else {
                setExtended((prev) => !prev);
              }
            }}
            className="menu"
            src={assets.menu_icon}
            alt="Toggle sidebar"
          />
          <div onClick={handleNewChat} className="new-chat">
            <img src={assets.plus_icon} alt="" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {extended ? (
            <div className="recent">
              <p className="recent-title">Chats</p>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    onClose();
                  }}
                  className={`recent-entry ${chat.id === activeChatId ? "active" : ""}`}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{(chat.title || "New chat").slice(0, 22)}...</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended ? <p>Help</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" />
            {extended ? <p>Activity</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {extended ? <p>Settings</p> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

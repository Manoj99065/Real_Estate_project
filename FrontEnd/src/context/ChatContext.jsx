

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "./AuthContext";
import { io } from 'socket.io-client';

// ✅ Add this line – same as you have in ChatMessages
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const activeChatRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    setActiveChat(null);
    setNotifications([]);
  }, [user]);

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL);  // ✅ now API_URL is defined
      setSocket(newSocket);

      newSocket.on("receiveMessage", (data) => {
        setNotifications((prev) => {
          if (activeChatRef.current?._id !== data.chatId) {
            return [...prev, data];
          }
          return prev;
        });
      });

      return () => newSocket.close();
    }
  }, [user]);

  const joinChat = ({ chatId }) => {
    if (socket) {
      socket.emit("JoinChat", chatId);
    }
  };

  const sendMessage = (
    chatId,
    text,
    messageId = null,
    createdAt = new Date(),
    image = null,
  ) => {
    if (socket && user) {
      const messageData = {
        chatId,
        sender: user._id,
        text,
        image,
        createdAt,
        _id: messageId,
      };

      socket.emit("sendMessage", messageData);
      return messageData;
    }
    return null;
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        activeChat,
        setActiveChat,
        joinChat,
        sendMessage,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user_info")) || null;
    console.log(navigate, userInfo);
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

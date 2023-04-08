import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, theme } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      background={theme === "DARK" ? "#2C3333" : "white"}
      borderColor={theme === "DARK" && "#2E4F4F"}
      color={theme === "DARK" && "#0E8388"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;

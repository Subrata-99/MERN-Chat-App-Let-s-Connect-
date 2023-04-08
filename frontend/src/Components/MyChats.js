import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import axios from "axios";
import API from "../shared/axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { theme } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats, user } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await API.get(`/api/chat`);

      setChats(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user_info")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      background={theme === "DARK" ? "#2C3333" : "white"}
      borderColor={theme === "DARK" && "#2E4F4F"}
      color={theme === "DARK" && "#0E8388"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            background={theme === "DARK" ? "#2E4F4F" : "#EDF2F7"}
            _hover={{ background: theme === "DARK" ? "#0c6e72" : "#E2E8F0" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        background={theme === "DARK" ? "#2E4F4F" : "#F8F8F8"}
      >
        {loading ? (
          <ChatLoading />
        ) : chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={
                  selectedChat === chat
                    ? "#38B2AC"
                    : theme === "DARK"
                    ? "#146353"
                    : "#E8E8E8"
                }
                color={
                  selectedChat === chat || theme === "DARK" ? "white" : "black"
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSender(loggedUser, chat?.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <div>No Chat available</div>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

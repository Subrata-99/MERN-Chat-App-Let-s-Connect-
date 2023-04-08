import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  const { theme } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg={theme === "DARK" ? "#62B6B7" : "#E8E8E8"}
      _hover={{
        background: "#0E8388",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color={theme === "DARK" && "white"}
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

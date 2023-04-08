import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router";
import axios from "axios";
import API from "../../shared/axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../User/UserListItem";
import { getSender } from "../../Config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    theme,
    setTheme,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("user_info");
    navigate("/");
  };

  const handleSearch = async (search) => {
    console.log("searching...", search);
    if (!search) {
      // toast({
      //   title: "Please Enter something in search",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top-left",
      // });
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };

      // const { data } = await axios.get(`/api/user?search=${search}`, config);
      const { data } = await API.get(`/api/user?search=${search}`);

      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };

      // const { data } = await axios.post(`/api/chat`, { userId }, config);
      const { data } = await API.post(`/api/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (err) {
      toast({
        title: "Error Fetching the Chat!",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      // setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderColor={theme === "DARK" && "#2E4F4F"}
        color={theme === "DARK" && "#0E8388"}
        background={theme === "DARK" ? "#2C3333" : "white"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            _hover={{ background: theme === "DARK" ? "#2E4F4F" : "#EDF2F7" }}
          >
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Lets-Connect
        </Text>
        <div>
          <Tooltip label="Change the" hasArrow placement="bottom-end">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "LIGHT" ? "DARK" : "LIGHT")}
              _hover={{ background: theme === "DARK" ? "#4F4557" : "#EDF2F7" }}
            >
              {theme === "LIGHT" ? (
                <MoonIcon fontSize="xl" m={1} />
              ) : (
                <SunIcon fontSize="2xl" m={1} color="yellow.500" />
              )}
            </Button>
          </Tooltip>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList
              pl={2}
              background={theme === "DARK" ? "#2C3333" : "white"}
              borderColor={theme === "DARK" && "#0E8388"}
            >
              {!notification.length && "No new Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              background={theme === "DARK" ? "#2E4F4F" : "#EDF2F7"}
              _hover={{ background: theme === "DARK" ? "#0c6e72" : "#E2E8F0" }}
              // background={theme === "DARK" ? "#2C3333" : "#EDF2F7"}
              // // colorTheme="red"
              // _hover={{ background: theme === "DARK" ? "#0E8388" : "#E2E8F0" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList
              background={theme === "DARK" ? "#2C3333" : "white"}
              borderColor={theme === "DARK" && "#0E8388"}
            >
              <ProfileModal user={user}>
                <MenuItem background={theme === "DARK" ? "#2C3333" : "white"}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                background={theme === "DARK" ? "#2C3333" : "white"}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            background={theme === "DARK" ? "#2C3333" : "white"}
            borderColor={theme === "DARK" && "#2E4F4F"}
            color={theme === "DARK" && "#0E8388"}
            borderBottomWidth="1px"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody
            background={theme === "DARK" ? "#2E4F4F" : "white"}
            display="flex"
            flexDir="column"
          >
            <Box pb={2}>
              <Input
                color={theme === "DARK" && "#0E8388"}
                placeholder="Search by name or email"
                mr={2}
                value={search}
                // onChange={(e) => setSearch(e.target.value)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                // searchResult?.length > 0 ?
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )
              //  : (
              //   <Text align="center">No Data Found</Text>
              // )
            }
            {/* {loadingChat && (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                position="fixed"
                top="50%"
                left="40%"
                transform={"auto"}
                margin="0 auto"
              />
            )} */}
            {/* <Spinner
              // size="xl"
              // w={20}
              // h={20}
              alignSelf="center"
              position="fixed"
              top="50%"
              left="50%"
              transform={"auto"}
              // margin="auto"
            /> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

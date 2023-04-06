const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://mern-chat-app-backend-0oq9.onrender.com",
  ];
  const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use("/get", () => {
  console.log("Server running...");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//----------------------------------Deployment-----------------------------------//

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Running successfully");
//   });
// }

//----------------------------------Deployment-----------------------------------//
// Creating two error handler middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running on PORT ${PORT}`.yellow.bold)
);

//Setting up Socket.io//
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io at");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData.name, userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (userData, room) => {
    socket.join(room);
    // console.log(userData.name + " Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      // console.log("messeage----", newMessageRecieved.content);
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

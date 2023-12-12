const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
const isDev = app.settings.env === "development";
const url = isDev
  ? "http://localhost:3000/"
  : "https://google-meet-clone-lac.vercel.app/";
const io = new Server(server, { cors: url });
console.log({ url });
app.use(cors({ origin: url }));
io.on("connection", (socket) => {
  console.log("socket server connected");
  socket?.on("join_room", (roomId, id) => {
    console.log("a new user with user id joined room", { roomId, id });
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user_connected", id);
  });
  socket.on("user_toggle_audio", (roomId, userId) => {
    socket.join(roomId);

    socket.broadcast.to(roomId).emit("user_toggle_audio", userId);
  });
  socket.on("user_toggle_video", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user_toggle_video", userId);
  });
  socket.on("user_leave", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user_leave", userId);
  });
});
server.listen(5334, () => {
  console.log("listening on *:5334");
});

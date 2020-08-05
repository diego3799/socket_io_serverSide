const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors=require('cors')
app.use(cors())
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("goodbye", ({room,user}) => {
    socket.to(room).emit("msg", `${user} has left!`, "goodbye");
  });
  socket.on("join-room", (room, user) => {
    socket.join(room);
    socket
      .to(room)
      .broadcast.emit("msg", `${user} has entered to the room`, "enter");
  });
  socket.on("msg", (user, msg,room) => {
    socket.to(room).broadcast.emit("msg", `${user}:${msg}`, "msg");
  });
});

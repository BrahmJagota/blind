import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

// import { executeMongo } from './database.js'
const app = express();
const server = http.createServer(app);
// await executeMongo();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["POST", "GET"],
  credentials: true,
};
app.use(cors(corsOptions));

// app.use('/', require(path.join(__dirname, '/routes/router.js')));
import { app as router } from './routes/router.js';
import { chatModel } from './models/models.js';
app.use('/', router);

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
});
  io.on("connection", (socket)=> {
    console.log("connected to socket io");

    socket.on('send-chat-to-room',async (data)=> {
      console.log("caht data",data);
      const toSend = {
        chat: data.message,
        sendTo: data.roomId,
        sendBy: data.sendBy
      }
      const result = await chatModel.create(
        toSend)
      if(!result) {
        // emit a function to notify them that chat is not being saved 
      }
      io.to(data.roomId).emit("receive-chat", toSend);
    })
    socket.on("room-joined", (room) => {
      socket.leaveAll();
      socket.join(room);
      console.log("room joined", room);
    })
  })
const PORT =5000;
server.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});

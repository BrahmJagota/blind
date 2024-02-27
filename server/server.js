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
      console.log(data);
        io.to(data.slug).emit("receive-chat", data);
    })
    socket.on("room-joined", (room) => {
      socket.leaveAll();
      socket.join(room);
      console.log("room joined" + room);
    })
  })
const PORT =5000;
server.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});

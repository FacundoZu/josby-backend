import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { corsConfig } from "./config/cors.js";
import passport from 'passport';
import './services/google.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();

const httpServer = createServer(app)
connectDB();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }
})

app.set('socketio', io);

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    socket.join(userId) //el usuario se une a una sala con su porpio id

    console.log(`Usuario ${userId} conectado a su sala personal`)
    socket.emit("connected")
  })

  // Evento para unirse a un chat especifico
  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId) // se conecta a esa room

    console.log(`Usuario ${socket.id} se unió a la sala: ${conversationId}`);
  })

  socket.on("disconnect", () => {
    console.log("Usuario desconectado", socket.id);
  })
})

app.use(cookieParser());

app.use(corsConfig());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/skill', skillRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/chat', conversationRoutes)
app.use('/api/order', orderRoutes)

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

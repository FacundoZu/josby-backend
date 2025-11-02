import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { corsConfig } from "./config/cors.js";
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './services/google.js';

dotenv.config();
const app = express();

connectDB();

app.use(cookieParser());

app.use(corsConfig());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

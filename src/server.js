import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { corsConfig } from "./config/cors.js";
import passport from 'passport';
import './services/google.js';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js'

dotenv.config();
const app = express();

connectDB();

app.use(cookieParser());

app.use(corsConfig());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/skill', skillRoutes)
app.use('/api/service', serviceRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { corsConfig } from "./config/cors.js";

dotenv.config();
const app = express();

connectDB();

app.use(corsConfig());
app.use(express.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

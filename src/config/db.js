import mongoose from 'mongoose';
import { loadCategories } from '../db/categoryDB.js';
import { loadSkills } from '../db/skillDB.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas conectado: ${conn.connection.host}`);

    await loadCategories()
    await loadSkills()
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

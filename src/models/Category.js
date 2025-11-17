import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    logo: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default model("Category", categorySchema);

import { Schema, model } from "mongoose";

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    color: {
      type: String,
      default: "#BDBDBD"
    }
  },
  {
    timestamps: true
  }
);

export default model("Skill", skillSchema);

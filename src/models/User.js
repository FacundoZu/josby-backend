import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    birthdate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "freelancer"],
      default: "user",
    },
    image: {
      type: String,
    },
    providerId: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true
  }
);

export default model("User", userSchema);

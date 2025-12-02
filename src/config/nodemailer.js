import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "josbypescar@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  }
})
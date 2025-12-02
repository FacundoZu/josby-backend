import { transporter } from "../config/nodemailer.js"

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: 'Josby <josbypescar@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Correo enviado: ", info.messageId)
    return info

  } catch (error) {
    console.error("Error enviando email:", error)
    throw new Error("No se pudo enviar el correo")
  }
}

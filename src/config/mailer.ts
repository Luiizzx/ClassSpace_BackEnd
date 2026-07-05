// config/mailer.js
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "luizfelipesousacordeiro@gmail.com",
    pass: "qmbj snit kgnn jjkf",
  },
});
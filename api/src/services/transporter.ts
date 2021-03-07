import * as nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

export default transporter;

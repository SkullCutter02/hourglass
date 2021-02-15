import * as nodemailer from "nodemailer";
import * as AWS from "aws-sdk";

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: "2010-12-01",
  }),
});

export default transporter;

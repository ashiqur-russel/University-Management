import nodemailer from 'nodemailer'
import config from '../config';


export const sendEmail = async(to: string, template: string) =>{

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: config.environment === "production", // true for port 465, false for other ports
  auth: {
    user: config.email_sender, // Dynamic sender email from .env
    pass: config.email_pass,   // Dynamic app password from .env
  },
});


await transporter.sendMail({
    from: `"Ph-University" <${config.email_sender}>`, // sender address
    to,
    subject: "Password Reset Link", // Subject line
    text: "Please reset password? You wil have 2 minutes for resetting the password", // plain text body
    html: template, // html body
  })

}
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';
import runMiddleware from '../../util/runmiddleware';

//Defines the result type
type ResultData = {
  success: boolean;
  error?: string;
}

//Defines the validation Schema using JOI
const JoiValidationSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false }}).required(),
  name: Joi.string().required(),
  message: Joi.string().max(9048).required()
});

class MailSingletons {
  static _transporter: nodemailer.Transporter;

  public static get Transporter() {
    if(MailSingletons._transporter == undefined) {
      let port = Number(process.env.EMAIL_PORT);
      MailSingletons._transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port,
        secure: port === 465 ? true : false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, 
        }
      });
    }
    return MailSingletons._transporter;
  }

}


//Generates the contact HTML Email body
const ContactEmailBody = (text: string, senderName: string) => {
  return `
  <body style="color: #000;">
    <div style="margin: 10px auto;padding: 10px;background-color: #ffffff;border-radius: 5px;width:100%;max-width: 520px;">
      <h2>Message from ${senderName}</h2>
      <p>${text}</p>
    </div>
  </body>`;
};

//Generates the response HTML Email body
const ResponseEmailBody = (text: string) => {
  return `
  <body style="color: #000;">
    <div style="margin: 10px auto;padding: 10px;background-color: #ffffff;border-radius: 5px;width:100%;max-width: 520px;">
      <h2>Contact Confirmation</h2>
      <p>We're sending this email to confirm we've successfully received your contact form submission!<br />We'll try to get back to you as soon as possible!</p>
      <h3>You sent a message saying:</h3>
      <p>${text}</p>
    </div>
  </body>`;
};

//Sends the contact submission to our E-Mail account
async function SendContactMail(email: string, name: string, message: string) {
  return await (await MailSingletons.Transporter).sendMail({
    from: `"${name}" <contact@miaisadeveloper.com>`,
    to: process.env.FORWARD_EMAIL_ADDRESS,
    subject: `New Contact Form Entry from (${name}, ${email})`,
    text: message,
    html: ContactEmailBody(message, name)
  });
}

//Sends the confirmation that we've received the mail
async function SendConfirmationResponseMail(email: string, name: string, message: string) {
  return await (await MailSingletons.Transporter).sendMail({
    from: `"Mia Bouman" <contact@miaisadeveloper.com>`,
    to: email,
    subject: "Contact Form Confirmation", 
    text: message,
    html: ResponseEmailBody(message)
  });
}


//Create a rate limit for this endpoint
const limiter = rateLimit({
  windowMs: Number(process.env.CONTACT_RATELIMIT_WINDOW),
	max: Number(process.env.CONTACT_RATELIMIT_MAXREQUESTS),
	standardHeaders: true,
	legacyHeaders: true,
  keyGenerator: (req) => req.socket.remoteAddress
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultData>
) {
  //RateLimit The Request
  await runMiddleware(req, res, limiter);

  if(req.method === 'POST') {

    //Validate the submission
    var validationResult = JoiValidationSchema.validate(req.body);

    //Reject invalid requests
    if(validationResult.error) {
      res.status(400).json({ success: false, error: validationResult.error.message});
      return;
    }
    
    const {email,name,message} = validationResult.value;

    //Send over the email to our mail address
    SendContactMail(email,name,message).then(() => {

      //If successful respond with a confirmation mail if this fails it's still considered a successful request
      //So just log the error for later fixing if one occurs
      SendConfirmationResponseMail(email,name,message).catch(console.error);

      res.status(200).json({ success: true });

    }).catch((error) => {

      //Handle errors in sending the Contact Email
      console.error(error);
      res.status(500).json({ success: false, error: "An error occured during your submission, please try again later!" })
    });
  }

}

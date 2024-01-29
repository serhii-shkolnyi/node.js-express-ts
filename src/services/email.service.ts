import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { apiConfig } from "../configs";
import { emailTemplatesConstant } from "../constants";
import { EEmailAction } from "../enums";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: "No reply",
      auth: {
        user: apiConfig.SMTP_USER,
        pass: apiConfig.SMTP_PASSWORD,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts",
        ),
        partialsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials",
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }

  public async sendMail(
    email: string | string[],
    emailAction: EEmailAction,
    context: Record<string, string | number> = {},
  ) {
    const { subject, templateName } = emailTemplatesConstant[emailAction];

    context.frontUrl = apiConfig.FRONT_URL;
    const mailOptions = {
      to: email,
      subject,
      template: templateName,
      context,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();

import { EEmailAction } from "../enums";

export const emailTemplatesConstant = {
  [EEmailAction.ACTIVATE]: {
    templateName: "activate-user",
    subject: "User activation is required!",
  },
  [EEmailAction.WELCOME]: {
    templateName: "welcome",
    subject: "Welcome on our platform!",
  },
};
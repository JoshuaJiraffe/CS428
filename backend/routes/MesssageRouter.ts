import express from "express";
import { db } from "../database/Database";
import { MessageService } from "../service/messageService";
import { Conversation } from "@shared/Conversation";

const messageService = new MessageService(db);
const messageRouter = express.Router();

messageRouter.post("/message", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).send("No message sent");
    return;
  }

  try {
    const messageSent: boolean = await messageService.addMessage(message);
    if (messageSent) res.status(200).send({ messageSent });
    else res.status(500).send("Server error while sending message");
  } catch (error) {
    res
      .status(500)
      .send(`Server error while trying to send message: ${message}`);
  }
});

messageRouter.get("/conversation", async (req, res) => {
  const userEmail = req.userEmail;
  const matchEmail = req.matchEmail;
  if (!userEmail) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (!matchEmail) {
    res.status(400).send("Missing match email");
    return;
  }
  try {
    const conversation: Conversation = await messageService.getConversation(
      userEmail,
      matchEmail
    );
    if (conversation) {
      res.send(conversation);
    } else {
      res.status(400).send("Failed to get conversation");
    }
  } catch (error) {
    res.status(500).send(`Server error while trying to add like: ${error}`);
  }
});

export default messageRouter;

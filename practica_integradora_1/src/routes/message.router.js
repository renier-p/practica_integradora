import { Router } from "express";
import messageModel from "../dao/models/message.model.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from message router");
});
router.post("/", (req, res) => {
  res.send("Post request to the homepage");
});
router.put("/", (req, res) => {
  res.send("Put request to the homepage");
});
router.delete("/", (req, res) => {
  res.send("Delete request to the homepage");
});

export default router;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SHEGUARD AI Server is running 🚀",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    res.json({
      success: true,
      reply:
        "SHEGUARD AI received your message: " + message,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SHEGUARD AI Server running on port ${PORT}`);
});
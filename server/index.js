const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ==========================================
// TWILIO CONFIGURATION
// ==========================================

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;

if (
  TWILIO_ACCOUNT_SID &&
  TWILIO_AUTH_TOKEN &&
  TWILIO_PHONE_NUMBER
) {
  twilioClient = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  );

  console.log("Twilio configuration loaded.");
} else {
  console.log("Twilio configuration is missing.");
}

// ==========================================
// HOME / HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SHEGUARD AI Server is running",
    twilioConfigured: Boolean(twilioClient),
  });
});

// ==========================================
// CHAT API
// ==========================================

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
      reply: "SHEGUARD AI received your message: " + message,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

// ==========================================
// SOS API
// ==========================================

app.post("/api/sos", async (req, res) => {
  try {
    const {
      contacts,
      userName,
      latitude,
      longitude,
      message,
    } = req.body;

    // CHECK TWILIO
    if (!twilioClient) {
      return res.status(500).json({
        success: false,
        error:
          "Twilio is not configured. Check your server/.env file.",
      });
    }

    // VALIDATE CONTACTS
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one emergency contact is required.",
      });
    }

    // MAXIMUM 5 CONTACTS
    const emergencyContacts = contacts
      .slice(0, 5)
      .map((contact) => ({
        id: contact.id || "",
        name: contact.name || "Emergency Contact",
        phone: String(contact.phone || "").trim(),
      }))
      .filter((contact) => contact.phone.length > 0);

    if (emergencyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid emergency phone numbers found.",
      });
    }

    // LOCATION
    let location = null;

    if (
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      location = {
        latitude,
        longitude,
        mapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      };
    }

    // CREATE SOS MESSAGE
    let sosMessage =
      message ||
      "SHEGUARD AI Emergency Alert. Please check on me immediately.";

    if (location) {
      sosMessage +=
        `\n\nMy current location:\n${location.mapLink}`;
    }

    if (userName) {
      sosMessage =
        `SHEGUARD AI EMERGENCY ALERT\n\n` +
        `${userName} may need help.\n\n` +
        `${sosMessage}`;
    } else {
      sosMessage =
        `SHEGUARD AI EMERGENCY ALERT\n\n` +
        `${sosMessage}`;
    }

    // SEND SMS
    const results = [];

    for (const contact of emergencyContacts) {
      try {
        const sms = await twilioClient.messages.create({
          body: sosMessage,
          from: TWILIO_PHONE_NUMBER,
          to: contact.phone,
        });

        results.push({
          name: contact.name,
          phone: contact.phone,
          success: true,
          messageSid: sms.sid,
          status: sms.status,
        });

        console.log(
          `SOS SMS sent to ${contact.name} (${contact.phone})`
        );
      } catch (smsError) {
        console.error(
          `Failed to send SOS SMS to ${contact.name}:`,
          smsError.message
        );

        results.push({
          name: contact.name,
          phone: contact.phone,
          success: false,
          error: smsError.message,
        });
      }
    }

    const successCount = results.filter(
      (result) => result.success
    ).length;

    res.json({
      success: successCount > 0,
      message:
        successCount > 0
          ? `SOS alert sent to ${successCount} contact(s).`
          : "SOS alert could not be sent.",
      results,
    });
  } catch (error) {
    console.error("SOS Error:", error);

    res.status(500).json({
      success: false,
      error: "Something went wrong while sending SOS.",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `SHEGUARD AI Server running on http://localhost:${PORT}`
  );
});
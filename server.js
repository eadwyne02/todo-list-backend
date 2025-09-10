const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// ✅ Enable CORS for your frontend (127.0.0.1:5500)
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(bodyParser.json());

app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).send({ success: false, error: "Missing FCM token" });
  }

  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000; // use the Render-assigned port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

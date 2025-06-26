const express = require("express");
const admin = require("firebase-admin");
const app = express();
app.use(express.json());

const serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/notify", async (req, res) => {
  const { token, title, body } = req.body;
  if (!token || !title || !body) return res.status(400).json({ error: "Missing data" });

  try {
    const message = {
      token,
      notification: { title, body },
    };
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("🚀 Server running"));

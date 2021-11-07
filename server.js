const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT || 5000;

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));


app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.post("/api/google-login", async (req, res) => {
  const token = req.body.token;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();
    res.status(201).json({ name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port %s", PORT);
});

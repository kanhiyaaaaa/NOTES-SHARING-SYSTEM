require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const notesRoutes = require("./routes/notesRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = 5001;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/notesApp")
  .then(() => {
    console.log("MongoDB Connected 🚀");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌");
    console.log(err);
  });

app.use("/api/notes", notesRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
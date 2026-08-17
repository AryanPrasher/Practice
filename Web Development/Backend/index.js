// ==============================
// HTTP Module (My Notes)
// ==============================

// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });

// ==============================
// Express + MongoDB
// ==============================

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// ==============================
// MongoDB Connection
// ==============================

// Replace "mydb" with your database name
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

// ==============================
// Routes (My Notes)
// ==============================

// nodemon index.js

app.get("/", (req, res) => {
  res.send("Server started successfully");
});
// http://localhost:4000/

app.get("/status", (req, res) => {
  res.send({
    status: "ok",
    message: "Endpoint is working",
  });
});
// http://localhost:4000/status

app.get("/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}, server started successfully`);
});
// http://localhost:4000/aryan

// ==============================
// User Routes
// ==============================

app.use("/api/users", require("./routes/userRoutes"));

// ==============================
// Start Server
// ==============================

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});

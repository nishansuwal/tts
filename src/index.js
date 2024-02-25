const express = require("express");
const { PORT } = require("./configs/configuration");
const { json } = require("body-parser");
const expressSession = require("express-session");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const socketio = require("socket.io");
const databaseConnection = require("./db_connection/db_connection");

const http = require("http");

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

databaseConnection();

require("dotenv").config();

app.set("trust proxy", true);
app.use(json());
app.use(cors());
app.use(
  expressSession({
    secret: "somethingsecretgoeshere",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());


// const adminRouter = require("./routes/adminauth_route");

// app.use("/api/admin", adminRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


server.listen(PORT, console.log(`server running in node on port ${PORT}`));

app.all("*", async (req, res) => {
  return res.status(201).send({ message: "invalid routes" });
});

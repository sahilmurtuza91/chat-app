require("dotenv").config()

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connection");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

const { initSocket } = require("./socket/socket");

// Middlewares
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Routes
const userRoutes = require("./router/user.routes");
const conversationRoutes = require("./router/conversation.routes");
const messageRoutes = require("./router/message.routes");
const friendRequestRoutes = require("./router/friendRequest.routes");

const PORT = process.env.PORT || 8000;
const app = express();

const server = http.createServer(app);


initSocket(server);

connectDB();

// middlewares
app.use(cors({
    origin: [
        process.env.FORMTEND_URL,
        "http://localhost:5173",
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/api/user", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friend-request", friendRequestRoutes);

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`);
});
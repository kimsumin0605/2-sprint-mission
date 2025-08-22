import { io } from "socket.io-client";
import axios from "axios";

async function main() {
  const res = await axios.post("http://localhost:3000/auth/login", {
    email: "test1@example.com",
    password: "123456789",
  });
  console.log(res.data);

  const { accessToken: token, user } = res.data;
  const userId = user.id;

  const socket = io("http://localhost:3000", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected", socket.id);
    socket.emit("join", userId);
  });

  socket.on("notification", (data) => {
    console.log("🔔 Notification received:", data);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
}

main();

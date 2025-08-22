import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export let io: Server;

export function SocketIo(server: any) {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("인증 실패"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verify error:", err);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.user?.sub;
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room`);
    }

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
}

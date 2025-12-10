// websocket.service.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class WebSocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join stream room
      socket.on("join-stream", (streamId) => {
        socket.join(streamId);
        socket.to(streamId).emit("viewer-joined", { viewerId: socket.id });
      });

      // Leave stream room
      socket.on("leave-stream", (streamId) => {
        socket.leave(streamId);
        socket.to(streamId).emit("viewer-left", { viewerId: socket.id });
      });

      // Handle chat messages
      socket.on("send-message", (data) => {
        socket.to(data.streamId).emit("new-message", {
          userId: data.userId,
          text: data.text,
          username: data.username,
          timestamp: new Date(),
        });
      });

      // Handle likes
      socket.on("send-like", (streamId) => {
        socket.to(streamId).emit("new-like", {
          viewerId: socket.id,
          timestamp: new Date(),
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  public emitStreamStarted(streamId: string, streamData: any) {
    this.io.emit("stream-started", { streamId, streamData });
  }

  public emitStreamEnded(streamId: string) {
    this.io.emit("stream-ended", { streamId });
  }

  public getIO() {
    return this.io;
  }
}

export default WebSocketService;

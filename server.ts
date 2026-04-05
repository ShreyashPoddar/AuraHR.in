import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, specify the Next.js app URL
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  // Join a specific assessment/interview room
  socket.on("join-room", (applicationId: string) => {
    socket.join(applicationId)
    console.log(`User ${socket.id} joined room: ${applicationId}`)
  })

  // Candidate sends a violation alert
  socket.on("violation-alert", (data: { applicationId: string; reason: string; timestamp: string }) => {
    console.log(`[ALERT] ${data.applicationId}: ${data.reason}`)
    
    // Broadcast to the admin in the same room
    io.to(data.applicationId).emit("admin-alert", {
      reason: data.reason,
      timestamp: data.timestamp,
      applicationId: data.applicationId
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.SOCKET_PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`)
})

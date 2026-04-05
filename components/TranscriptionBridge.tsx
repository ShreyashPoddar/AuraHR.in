"use client"

import { useEffect, useState } from "react"

interface TranscriptionBridgeProps {
  applicationId: string
  socket: any
  isActive: boolean
}

export default function TranscriptionBridge({ applicationId, socket, isActive }: TranscriptionBridgeProps) {
  const [transcript, setTranscript] = useState("")

  useEffect(() => {
    if (!isActive || !("webkitSpeechRecognition" in window)) return

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let currentResult = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript
          currentResult += text
          // Emit final transcript to admin
          if (socket) {
            socket.emit("speech-update", {
              applicationId,
              text,
              timestamp: new Date().toLocaleTimeString(),
              final: true
            })
          }
        }
      }
      setTranscript(prev => prev + " " + currentResult)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error)
    }

    recognition.start()

    return () => recognition.stop()
  }, [isActive, socket, applicationId])

  return null // Invisible bridge
}

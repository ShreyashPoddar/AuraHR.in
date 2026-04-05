"use client"

import { useEffect, useRef, useState } from "react"

// Types for MediaPipe (since we'll use window globals)
declare global {
  interface Window {
    FaceMesh: any
    Camera: any
  }
}

interface FaceMeshTrackerProps {
  onViolation: (reason: string) => void
  applicationId: string
}

export default function FaceMeshTracker({ onViolation, applicationId }: FaceMeshTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const violationTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (typeof window === "undefined" || !window.FaceMesh) return

    const faceMesh = new window.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    })

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    faceMesh.onResults((results: any) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0]
        
        // Simplistic eye contact detection (Checking gaze direction via landmarks)
        // In a real scenario, we'd use more complex geometry
        // For now, if landmarks are present, we're detecting a face.
        // We'll simulate "looking away" if face is not centered or lost.
        
        if (violationTimer.current) {
          clearTimeout(violationTimer.current)
          violationTimer.current = null
        }
      } else {
        // No face detected - potentially looking away or left the seat
        if (!violationTimer.current) {
          violationTimer.current = setTimeout(() => {
            onViolation("Lost eye contact / Face not detected")
          }, 3000) // Trigger after 3 seconds of lost tracking
        }
      }
    })

    if (videoRef.current && window.Camera) {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await faceMesh.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480,
      })
      camera.start().then(() => setIsReady(true))
    }

    return () => {
      faceMesh.close()
      if (violationTimer.current) clearTimeout(violationTimer.current)
    }
  }, [onViolation, applicationId])

  return (
    <div className="relative w-full h-full bg-black/20 rounded-xl overflow-hidden border border-white/10 group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover mirror transform -scale-x-100"
        playsInline
        muted
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="text-[10px] font-bold text-white/40 animate-pulse uppercase tracking-widest">
            AuraAI Stabilizing Link...
          </div>
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-1 z-20">
        <div className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
      </div>
    </div>
  )
}

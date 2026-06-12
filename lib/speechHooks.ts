'use client'

import { useState, useRef, useCallback } from 'react'

// ─── Speech Recognition ───────────────────────────────────────────────────────

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
}

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const ref = useRef<SpeechRecognitionInstance | null>(null)
  const finalTranscriptRef = useRef('')

  const start = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    finalTranscriptRef.current = '' // reset on new start

    const rec: SpeechRecognitionInstance = new SpeechRecognitionAPI()
    rec.lang = 'en-US' // supports both Arabic and English
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.continuous = true

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = ''
      console.log("||||", e.results)
      for (let i = 0; i < e.results.length; i++) {
        console.log('&&&', e.results[i][0].transcript)
        transcript += e.results[i][0].transcript
      }
      console.log("***", transcript)
      finalTranscriptRef.current = transcript // just store, don't send
    }
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)

    ref.current = rec
    rec.start()
    setIsListening(true)
  }, [])

  const stop = useCallback(() => {
    ref.current?.stop()
    setIsListening(false)
    setTimeout(() => onResult(finalTranscriptRef.current), 500)
  }, [onResult])

  return { isListening, start, stop }
}

// ─── Speech Synthesis ─────────────────────────────────────────────────────────

export function useSpeechSynthesis() {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    // Detect Arabic characters
    const isArabic = /[\u0600-\u06FF]/.test(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = isArabic ? 'ar-SA' : 'en-US'
    utterance.rate = 0.95
    utterance.pitch = 1.1

    const voices = window.speechSynthesis.getVoices()
    const lang = isArabic ? 'ar' : 'en'
    const match = voices.find((v) => v.lang.startsWith(lang))
    if (match) utterance.voice = match

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => window.speechSynthesis?.cancel(), [])

  return { speak, stop }
}

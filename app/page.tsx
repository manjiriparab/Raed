'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Avatar } from '@/components/Avatar'
import { ChatBubble, Message } from '@/components/ChatBubble'
import { useSpeechRecognition, useSpeechSynthesis } from '@/lib/speechHooks'

type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking'

export default function Home() {
  const [showFooter, setShowFooter] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [dialect, setDialect] = useState('Modern Standard (Formal)')
  const [micLang, setMicLang] = useState<'en-US' | 'ar-SA'>('en-US')
  const [remaining, setRemaining] = useState<number | null>(null)
  const { speak } = useSpeechSynthesis()

  const dialectList = [
    { name: 'Modern Standard (Formal)', flag: '' },
    { name: 'Saudi (Najdi)', flag: '🇸🇦' },
    { name: 'Emirati', flag: '🇦🇪' },
    { name: 'Kuwaiti', flag: '🇰🇼' },
    { name: 'Bahraini', flag: '🇧🇭' },
    { name: 'Qatari', flag: '🇶🇦' },
    { name: 'Omani', flag: '🇴🇲' },
  ]

  const micButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setAvatarState('thinking')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dialect,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error || "You've reached today's limit. Please come back tomorrow! 😊" },
        ])
        setRemaining(0)
        setAvatarState('idle')
        return
      }

      const reply = data.reply || 'Sorry, I could not respond.'
      if (typeof data.remaining === 'number') setRemaining(data.remaining)


      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setAvatarState('talking')

      // Speak the reply
      speak(reply)

      // Return to idle after estimated speech duration
      const duration = Math.max(2000, reply.length * 60)
      setTimeout(() => setAvatarState('idle'), duration)
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
      setAvatarState('idle')
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, speak, dialect])

  const { isListening, start: startListening, stop: stopListening } = useSpeechRecognition(
    (transcript) => {
      console.log("transcript", transcript)
      sendMessage(transcript)
    }
  )

  useEffect(() => {
    const btn = micButtonRef.current
    if (!btn) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      if (!isLoading) startListening()
    }
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      stopListening()
    }

    btn.addEventListener('touchstart', handleTouchStart, { passive: false })
    btn.addEventListener('touchend', handleTouchEnd, { passive: false })
    btn.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    return () => {
      btn.removeEventListener('touchstart', handleTouchStart)
      btn.removeEventListener('touchend', handleTouchEnd)
      btn.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [isLoading, startListening, stopListening])

  useEffect(() => {
    setAvatarState(isListening ? 'listening' : isLoading ? 'thinking' : 'idle')
  }, [isListening, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Greeting on first load
  useEffect(() => {
    const greeting = "Hi! I'm Raed 👋 Your bilingual companion for English & Arabic. Before you speak, select your language 🇺🇸 EN or 🇸🇦 AR using the toggle next to the mic. Then pick your preferred Gulf dialect below. Let's talk!"
    setTimeout(() => {
      setMessages([{ role: 'assistant', content: greeting }])
      setAvatarState('talking')
      speak(greeting)
      setTimeout(() => setAvatarState('idle'), 4000)
    }, 800)
  }, []) // eslint-disable-line

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f0c29 0%, #1a0533 50%, #0d1b4b 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '20px 24px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>
            Raed
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
            Bilingual AI Companion
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '20px',
          padding: '4px 12px',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#10b981',
            animation: 'micPulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>Online</span>
        </div>
        {remaining !== null && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            {remaining}/10 messages left today
          </span>
        )}
      </div>

      {/* Avatar */}
      <div style={{ padding: '16px 0 8px', position: 'relative' }}>
        <Avatar state={avatarState} />
        {/* State label */}
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '13px',
          color: avatarState === 'listening' ? '#a78bfa'
            : avatarState === 'thinking' ? '#fbbf24'
              : avatarState === 'talking' ? '#10b981'
                : 'rgba(255,255,255,0.3)',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>
          {avatarState === 'listening' ? '🎙 Listening...'
            : avatarState === 'thinking' ? '💭 Thinking...'
              : avatarState === 'talking' ? '💬 Speaking...'
                : '· · ·'}
        </div>
      </div>

      {/* Chat messages */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '480px',
        overflowY: 'auto',
        padding: '8px 20px',
        minHeight: '180px',
        maxHeight: 'calc(100vh - 460px)',
      }}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Dialect Options */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '0 16px 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }}
        >

          {dialectList.map((dialect_item) => {
            const selected = dialect === dialect_item.name

            return (
              <button
                key={dialect_item.name}
                type="button"
                onClick={() => setDialect(dialect_item.name)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: selected
                    ? '1px solid rgba(139,92,246,0.8)'
                    : '1px solid rgba(255,255,255,0.12)',
                  background: selected
                    ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                    : 'rgba(255,255,255,0.06)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: selected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(12px)',
                  boxShadow: selected
                    ? '0 0 20px rgba(139,92,246,0.35)'
                    : 'none',
                }}
              >
                {selected && '✓ '}
                {dialect_item.name} {dialect_item.flag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '12px 16px 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          padding: '10px 12px 10px 16px',
          backdropFilter: 'blur(20px)',
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in English or Arabic..."
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '15px',
              resize: 'none',
              maxHeight: '100px',
              lineHeight: '1.5',
              padding: '2px 0',
              fontFamily: 'inherit',
            }}
          />

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: 'none',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #7c3aed, #4c1d95)'
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ➤
          </button>

          {/* Mic button */}
          <button
            ref={micButtonRef}
            onMouseDown={() => startListening(micLang)}
            onTouchStart={(e) => { e.preventDefault(); startListening(micLang) }}
            onMouseUp={stopListening}
            disabled={isLoading}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: 'none',
              background: isListening
                ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: isLoading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              animation: isListening ? 'micPulse 1s ease-in-out infinite' : 'none',
              transition: 'background 0.2s',
              WebkitTouchCallout: 'none',
              userSelect: 'none'
            } as React.CSSProperties}
          >
            🎤
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setMicLang(micLang === 'en-US' ? 'ar-SA' : 'en-US')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {micLang === 'en-US' ? '🇺🇸' : '🇸🇦'}
          </button>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: '#bbb' }}>
          {/* Footer */}
          {showFooter && <footer style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '32px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>
              Made with <span style={{ color: '#e74c3c' }}>♥</span> by{' '}
              <span style={{
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontSize: '22px',
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}>
                Manjiri Parab
              </span>
            </p>
          </footer>}

          {!showFooter && <div
            onClick={() => setShowFooter(!showFooter)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span style={{ fontSize: '28px' }}>♡</span>
          </div>}
        </div>
      </div>
    </main>
  )
}

'use client'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isArabic = /[\u0600-\u06FF]/.test(message.content)

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      animation: 'fadeSlideIn 0.3s ease',
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #6d28d9, #4c1d95)'
          : 'rgba(255,255,255,0.08)',
        color: 'white',
        fontSize: '15px',
        lineHeight: '1.6',
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
        backdropFilter: isUser ? 'none' : 'blur(10px)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isUser
          ? '0 4px 15px rgba(109,40,217,0.4)'
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        {message.content}
      </div>
    </div>
  )
}

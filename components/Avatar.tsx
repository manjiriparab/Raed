'use client'

interface AvatarProps {
  state: 'idle' | 'listening' | 'thinking' | 'talking'
}

export function Avatar({ state }: AvatarProps) {
  const isListening = state === 'listening'
  const isThinking = state === 'thinking'
  const isTalking = state === 'talking'

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: isListening
          ? 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)'
          : isTalking
          ? 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        transition: 'background 0.5s ease',
        animation: isListening || isTalking ? 'glowPulse 2s ease-in-out infinite' : 'none',
      }} />

      {/* Avatar SVG */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Background circle */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6d28d9" />
          </radialGradient>
          <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fde8d0" />
            <stop offset="100%" stopColor="#f5c89a" />
          </radialGradient>
          <clipPath id="faceClip">
            <ellipse cx="90" cy="82" rx="38" ry="42" />
          </clipPath>
        </defs>

        {/* Circle background */}
        <circle cx="90" cy="90" r="88" fill="url(#bgGrad)" />
        <circle cx="90" cy="90" r="88" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

        {/* Hair */}
        <ellipse cx="90" cy="55" rx="40" ry="30" fill="#1a1a2e" />
        <ellipse cx="90" cy="48" rx="36" ry="22" fill="#16213e" />
        {/* Hair sides */}
        <ellipse cx="54" cy="78" rx="10" ry="18" fill="#1a1a2e" />
        <ellipse cx="126" cy="78" rx="10" ry="18" fill="#1a1a2e" />

        {/* Face */}
        <ellipse cx="90" cy="85" rx="38" ry="42" fill="url(#skinGrad)" />

        {/* Ears */}
        <ellipse cx="52" cy="85" rx="7" ry="9" fill="#f5c89a" />
        <ellipse cx="128" cy="85" rx="7" ry="9" fill="#f5c89a" />

        {/* Eyebrows */}
        <path d="M 68 66 Q 76 62 84 65" stroke="#5c3d1e" strokeWidth="2.5" fill="none" strokeLinecap="round"
          style={{ transform: isThinking ? 'translateY(-2px)' : 'none', transition: 'transform 0.3s' }}
        />
        <path d="M 96 65 Q 104 62 112 66" stroke="#5c3d1e" strokeWidth="2.5" fill="none" strokeLinecap="round"
          style={{ transform: isThinking ? 'translateY(-2px)' : 'none', transition: 'transform 0.3s' }}
        />

        {/* Eyes */}
        {isThinking ? (
          // Thinking: eyes looking up
          <>
            <ellipse cx="76" cy="76" rx="8" ry="9" fill="white" />
            <ellipse cx="104" cy="76" rx="8" ry="9" fill="white" />
            <ellipse cx="76" cy="73" rx="5" ry="5.5" fill="#3b1f8c" />
            <ellipse cx="104" cy="73" rx="5" ry="5.5" fill="#3b1f8c" />
            <ellipse cx="77" cy="72" rx="2" ry="2" fill="white" />
            <ellipse cx="105" cy="72" rx="2" ry="2" fill="white" />
          </>
        ) : isListening ? (
          // Listening: wide eyes
          <>
            <ellipse cx="76" cy="77" rx="9" ry="10" fill="white" />
            <ellipse cx="104" cy="77" rx="9" ry="10" fill="white" />
            <ellipse cx="76" cy="77" rx="6" ry="6" fill="#3b1f8c" />
            <ellipse cx="104" cy="77" rx="6" ry="6" fill="#3b1f8c" />
            <ellipse cx="77" cy="75" rx="2" ry="2" fill="white" />
            <ellipse cx="105" cy="75" rx="2" ry="2" fill="white" />
          </>
        ) : (
          // Idle/talking: normal eyes
          <>
            <ellipse cx="76" cy="77" rx="8" ry="9" fill="white" />
            <ellipse cx="104" cy="77" rx="8" ry="9" fill="white" />
            <ellipse cx="76" cy="78" rx="5" ry="5.5" fill="#3b1f8c" />
            <ellipse cx="104" cy="78" rx="5" ry="5.5" fill="#3b1f8c" />
            <ellipse cx="77" cy="76" rx="2" ry="2" fill="white" />
            <ellipse cx="105" cy="76" rx="2" ry="2" fill="white" />
          </>
        )}

        {/* Eyelashes */}
        <path d="M 68 70 L 66 67" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 72 68 L 71 65" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 76 67 L 76 64" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 96 68 L 97 65" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 100 67 L 101 64" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 108 70 L 110 67" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 90 84 Q 86 92 88 95 Q 90 97 92 95 Q 94 92 90 84" fill="#e8a87c" />

        {/* Mouth */}
        {isTalking ? (
          // Talking: open mouth animated
          <>
            <path d="M 78 106 Q 90 112 102 106" stroke="#c0392b" strokeWidth="2" fill="#c0392b" />
            <ellipse cx="90" cy="108" rx="10" ry="5" fill="#8b0000" />
            <path d="M 80 106 Q 90 104 100 106" stroke="#ff8a80" strokeWidth="1.5" fill="none" />
          </>
        ) : isListening ? (
          // Listening: slight smile
          <>
            <path d="M 78 105 Q 90 113 102 105" stroke="#e07b6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          // Idle: warm smile
          <>
            <path d="M 78 104 Q 90 114 102 104" stroke="#e07b6e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Dimples */}
            <circle cx="73" cy="102" r="2" fill="#e8a87c" opacity="0.6" />
            <circle cx="107" cy="102" r="2" fill="#e8a87c" opacity="0.6" />
          </>
        )}

        {/* Hijab / headscarf */}
        <path d="M 50 78 Q 44 110 48 135 Q 60 155 90 158 Q 120 155 132 135 Q 136 110 130 78"
          fill="#4c1d95" opacity="0.9" />
        <path d="M 50 78 Q 52 95 54 115 Q 58 140 90 148 Q 122 140 126 115 Q 128 95 130 78"
          fill="#5b21b6" />

        {/* Hijab highlight */}
        <path d="M 56 82 Q 58 100 60 118" stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Neck */}
        <rect x="80" y="120" width="20" height="15" rx="4" fill="#f5c89a" />

        {/* Shoulders / top */}
        <path d="M 10 180 Q 30 155 60 148 Q 90 158 90 158 Q 90 158 120 148 Q 150 155 170 180 Z"
          fill="#4c1d95" />

        {/* Thinking dots */}
        {isThinking && (
          <g>
            <circle cx="115" cy="60" r="4" fill="rgba(255,255,255,0.8)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="127" cy="52" r="5" fill="rgba(255,255,255,0.8)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            <circle cx="141" cy="43" r="6" fill="rgba(255,255,255,0.8)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.6s" />
            </circle>
          </g>
        )}

        {/* Listening sound waves */}
        {isListening && (
          <g opacity="0.7">
            <path d="M 138 75 Q 145 85 138 95" stroke="#a78bfa" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
            </path>
            <path d="M 144 68 Q 154 85 144 102" stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
            </path>
          </g>
        )}
      </svg>

    </div>
  )
}

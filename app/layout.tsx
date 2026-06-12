import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Raed — Bilingual AI Companion',
  description: 'Talk to Raed in English or Arabic. He understands and replies in both.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%238b5cf6'/%3E%3Cstop offset='1' stop-color='%23a855f7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='48' fill='white'/%3E%3Cpath fill='url(%23g)' d='M65 15A35 35 0 1 0 65 85A28 28 0 1 1 65 15z'/%3E%3Cpath fill='url(%23g)' d='M42 38h24a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H54l-8 8v-8h-4a8 8 0 0 1-8-8V46a8 8 0 0 1 8-8z'/%3E%3Ctext x='53' y='56' font-size='14' text-anchor='middle' fill='white' font-family='Arial'%3EA%7Cل%3C/text%3E%3Cpath fill='url(%23g)' d='M78 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'/%3E%3C/svg%3E"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

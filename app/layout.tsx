// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Wine Connect',
  description:
    'Matchmaking cantine ↔ buyer con logistica e compliance integrate.',
  icons: {
    icon: [
      // .ico come fallback “any”
      { url: '/favicon.ico', sizes: 'any' },
      // .svg super nitido dove supportato
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    // icona iOS (facoltativa)
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

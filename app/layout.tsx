// app/layout.tsx
import './globals.css';


export const metadata = {
  title: 'Wine Connect',
  description: 'Matchmaking cantine ↔ buyer con logistica e compliance integrate.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },        // fallback classico
      { url: '/favicon.svg', type: 'image/svg+xml' } // nitido su schermi moderni
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest', // opzionale
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // importa i CSS globali di Tailwind
  return (
    <html lang="it">
      <body className="bg-black">{children}</body>
    </html>
  );
}

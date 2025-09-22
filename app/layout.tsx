// app/layout.tsx
import './globals.css';


export const metadata = {
  title: 'Wine Connect',
  description: 'Matchmaking cantine ↔ buyer · by SPST',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // importa i CSS globali di Tailwind
  return (
    <html lang="it">
      <body className="bg-black">{children}</body>
    </html>
  );
}

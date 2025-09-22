export const metadata = {
  title: 'Wine Connect',
  description: 'Matchmaking cantine ↔ buyer · by SPST',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-black">{children}</body>
    </html>
  );
}

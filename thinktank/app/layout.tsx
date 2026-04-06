import './globals.css';
import { ProfileProvider } from '@/context/ProfileContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'ThinkTank | Train Your Brain',
  description: 'Gamified Skill Assessment Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <ProfileProvider>
          <Navbar />
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
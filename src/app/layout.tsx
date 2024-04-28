import './globals.css';
import type { Metadata } from 'next';
import { Inter, Aleo } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const aleo = Aleo({ subsets: ['latin'], variable: '--font-aleo' });

export const metadata: Metadata = {
  title: 'To do list',
  description: 'To do list created with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${aleo.variable}`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}

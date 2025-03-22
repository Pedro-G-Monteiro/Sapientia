import { ThemeProvider } from '@/contexts/ThemeContext';
import '@ant-design/v5-patch-for-react-19';
import { Metadata } from 'next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import './globals.css';

// Configuração da fonte Inter
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadados da aplicação
export const metadata: Metadata = {
  title: 'Plataforma Educacional',
  description: 'Sistema de aprendizado e gestão de conhecimento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
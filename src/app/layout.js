import {AppProvider} from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Outfit } from 'next/font/google'
import './globals.css'
import {Toaster} from "react-hot-toast";

const outfit = Outfit({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-outfit',
})

export const metadata = {
  title: 'The Grill Bambú',
  description: 'Premium Restaurant & Grill',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} font-sans bg-background text-foreground`}>
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t p-12 text-center text-gray-400 mt-24">
              &copy; 2026 The Grill Bambú | Todos los derechos reservados
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  )
}

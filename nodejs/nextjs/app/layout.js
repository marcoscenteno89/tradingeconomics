import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trading Economics",
  description: "Trading Economics App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} data-bs-theme="dark">
        <header className="container-fluid sticky-md-top bg border-bottom">
          <nav className="navbar navbar-expand-md bg-dark container">
            <Link className="navbar-brand text-primary" href="/">Marccent</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarSupportedContent" 
              aria-controls="navbarSupportedContent" 
              aria-expanded="false" 
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            </div>
          </nav>
        </header>
        {children}
        <footer className="container-fluid bg" id="footer">
          <div className="container-md">
            <div className="text-center p-3">
              Copyright ©{new Date().getFullYear()} Marccent. All rights reserved
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

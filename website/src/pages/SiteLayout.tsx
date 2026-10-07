import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Menu, Shield, X } from "lucide-react";
import "../App.css";
import "./SiteLayout.css";

interface SiteLayoutProps {
  children: ReactNode;
}

const links = [
  ["/", "Home"],
  ["/features", "Features"],
  ["/how-it-works", "How It Works"],
  ["/technology", "Technology"],
  ["/safety", "Safety"],
  ["/about", "About"],
  ["/faq", "FAQ"],
];

export default function SiteLayout({ children }: SiteLayoutProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-container">
          <Link className="brand" to="/" onClick={closeMenu}>
            <div className="brand-icon">
              <Shield size={22} />
            </div>
            <div>
              <span className="brand-name">SHEGUARD</span>
              <span className="brand-ai">AI</span>
            </div>
          </Link>

          <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={location.pathname === to ? "nav-active" : ""}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}

            <Link className="nav-download" to="/download" onClick={closeMenu}>
              <Download size={16} />
              Download
            </Link>
          </nav>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-icon">
                <Shield size={21} />
              </div>
              <div>
                <span className="brand-name">SHEGUARD</span>
                <span className="brand-ai">AI</span>
              </div>
            </div>

            <p>
              Personal safety technology designed to help you stay connected,
              prepared and safer.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/dashboard">Safety Dashboard</Link>
            <Link to="/help-center">Help Center</Link>
            <Link to="/download">Download</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SHEGUARD AI. All rights reserved.</span>
          <span>Built for safer journeys.</span>
        </div>
      </footer>
    </div>
  );
}

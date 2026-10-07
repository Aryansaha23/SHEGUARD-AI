import { ArrowRight, Download, MapPin, Shield, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../App.css";

const features = [
  { icon: <ShieldCheck size={24} />, title: "Emergency SOS", text: "Quick access to emergency assistance when you need it most." },
  { icon: <MapPin size={24} />, title: "Live Location", text: "Get your current location and open it directly in Google Maps." },
  { icon: <Users size={24} />, title: "Trusted Contacts", text: "Keep important contacts ready for emergency situations." },
  { icon: <MapPin size={24} />, title: "Safe Places", text: "Find nearby police stations, hospitals and pharmacies." },
];

export default function Home() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-container">
          <Link className="brand" to="/">
            <div className="brand-icon"><Shield size={22} /></div>
            <div><span className="brand-name">SHEGUARD</span><span className="brand-ai">AI</span></div>
          </Link>
          <nav className="nav-links">
            <Link className="nav-active" to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/technology">Technology</Link>
            <Link to="/safety">Safety</Link>
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
            <Link className="nav-download" to="/download">Download</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="hero-grid">
            <motion.div className="hero-content" initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="ai-badge"><Sparkles size={16} /><span>PERSONAL SAFETY PLATFORM</span></div>
              <h1>Your Safety.<br /><span>Our Intelligence.</span></h1>
              <p>SHEGUARD AI brings essential personal safety tools together in one platform — emergency SOS, location assistance, trusted contacts and nearby safety services.</p>
              <div className="hero-buttons">
                <Link className="primary-button" to="/download"><Download size={19} />Download App<ArrowRight size={18} /></Link>
                <Link className="secondary-button" to="/features">Explore Features</Link>
              </div>
              <div className="trust-row">
                <div><ShieldCheck size={18} /><span>Emergency Ready</span></div>
                <div><MapPin size={18} /><span>Location Assistance</span></div>
                <div><Users size={18} /><span>Trusted Contacts</span></div>
              </div>
            </motion.div>

            <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <div className="phone-glow" />
              <div className="phone">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="phone-header"><div><small>Welcome</small><strong>SHEGUARD AI</strong></div><div className="mini-shield"><Shield size={17} /></div></div>
                  <div className="protection-card"><div className="protection-icon"><ShieldCheck size={23} /></div><div><span>Protection Status</span><strong>ACTIVE</strong></div><div className="active-dot" /></div>
                  <div className="sos-area"><div className="sos-ring ring-one" /><div className="sos-ring ring-two" /><button className="sos-button"><span>SOS</span><small>EMERGENCY</small></button></div>
                  <div className="phone-actions"><div className="phone-action"><MapPin size={20} /><span>Live Location</span></div><div className="phone-action"><Users size={20} /><span>Contacts</span></div></div>
                  <div className="safe-status"><div className="status-check"><ShieldCheck size={17} /></div><div><strong>You are protected</strong><span>SHEGUARD is ready when you need it.</span></div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="section-heading"><div className="section-badge"><ShieldCheck size={15} />BUILT FOR SAFETY</div><h2>Everything important,<br /><span>within reach.</span></h2><p>Designed around fast access, clear actions and practical safety assistance.</p></div>
          <div className="features-grid">
            {features.map((feature, index) => <motion.div className="feature-card" key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}><div className="feature-icon">{feature.icon}</div><div className="feature-number">{String(index + 1).padStart(2, "0")}</div><h3>{feature.title}</h3><p>{feature.text}</p><div className="feature-arrow"><ArrowRight size={17} /></div></motion.div>)}
          </div>
        </section>

        <section className="section download-section">
          <div className="download-card">
            <div className="download-content"><div className="section-badge"><Download size={15} />GET STARTED</div><h2>Safety should be<br /><span>within reach.</span></h2><p>Explore the Safety Dashboard in your browser or download the SHEGUARD AI Android application.</p><div className="hero-buttons"><Link className="primary-button" to="/dashboard">Open Safety Dashboard<ArrowRight size={18} /></Link><Link className="secondary-button" to="/download">Download App</Link></div></div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="footer-container"><div className="footer-brand"><div className="brand"><div className="brand-icon"><Shield size={21} /></div><div><span className="brand-name">SHEGUARD</span><span className="brand-ai">AI</span></div></div><p>Personal safety technology designed to help you stay connected, prepared and safer.</p></div><div className="footer-links"><Link to="/features">Features</Link><Link to="/dashboard">Safety Dashboard</Link><Link to="/help-center">Help Center</Link><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link></div></div><div className="footer-bottom"><span>© 2026 SHEGUARD AI. All rights reserved.</span><span>Built for safer journeys.</span></div></footer>
    </div>
  );
}

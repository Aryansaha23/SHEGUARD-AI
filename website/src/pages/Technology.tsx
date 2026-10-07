import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SiteLayout from "./SiteLayout";

const cards = [
  ["React + TypeScript", "Component-based web interfaces with maintainable frontend code."],
  ["React Native + Expo", "The mobile application uses Expo modules for device capabilities such as location and SMS workflows."],
  ["Google Maps", "Location links and nearby safety-service discovery are supported through Google Maps."],
  ["Vite", "Fast development and production builds for the web platform."],
];

export default function Technology() {
  return (
    <SiteLayout>
      <main>
        <section className="section">
          <div className="section-container">
            <motion.div
              className="section-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="section-badge">MODERN TECHNOLOGY</div>
              <h1>Technology behind your safety.</h1>
              <p>A practical technology foundation for a responsive mobile and web experience.</p>
            </motion.div>

            <div className="features-grid" style={{ marginTop: "55px" }}>
              {cards.map(([title, description], index) => (
                <motion.article
                  className="feature-card"
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="feature-icon">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section download-section">
          <div className="download-card">
            <div className="download-content">
              <div className="section-badge">SHEGUARD AI</div>
              <h2>Safety should be<br /><span>within reach.</span></h2>
              <p>Open the browser Safety Dashboard or download the Android application.</p>
              <div className="hero-buttons">
                <Link className="primary-button" to="/dashboard">
                  Safety Dashboard <ArrowRight size={18} />
                </Link>
                <Link className="secondary-button" to="/download">Download App</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

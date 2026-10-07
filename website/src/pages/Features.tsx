import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
  Hospital,
  Pill,
  Navigation,
  Siren,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";

const features = [
  {
    icon: <Siren size={26} />,
    title: "Emergency SOS",
    description:
      "Quickly access emergency assistance and start your safety response when you need it most.",
  },
  {
    icon: <MapPin size={26} />,
    title: "Current Location",
    description:
      "Get your current GPS location and open it directly in Google Maps for easy sharing and navigation.",
  },
  {
    icon: <Phone size={26} />,
    title: "Emergency Call 112",
    description:
      "Reach India's emergency response number quickly through a dedicated emergency call action.",
  },
  {
    icon: <Navigation size={26} />,
    title: "Google Maps",
    description:
      "Open your location in Google Maps and use location-based navigation whenever required.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Nearby Police Station",
    description:
      "Find nearby police stations through Google Maps for faster access to local assistance.",
  },
  {
    icon: <Hospital size={26} />,
    title: "Nearby Hospital",
    description:
      "Locate nearby hospitals through Google Maps when medical assistance may be needed.",
  },
  {
    icon: <Pill size={26} />,
    title: "Nearby Pharmacy",
    description:
      "Search for nearby pharmacies and quickly access essential local healthcare resources.",
  },
  {
    icon: <Users size={26} />,
    title: "Trusted Contacts",
    description:
      "Add, manage, delete and call trusted contacts directly from the safety platform.",
  },
];

export default function Features() {
  return (
    <div className="app">
      <main>
        <section className="section hero-section">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ maxWidth: "850px", margin: "0 auto", textAlign: "center" }}
            >
              <div className="section-badge">
                <ShieldCheck size={15} />
                SHEGUARD AI FEATURES
              </div>

              <h1 className="section-title">
                Powerful tools for{" "}
                <span>everyday safety.</span>
              </h1>

              <p className="section-description">
                SHEGUARD AI brings essential emergency and location-based
                safety tools together in one simple platform, available across
                the mobile app and web experience.
              </p>
            </motion.div>

            <div className="features-grid" style={{ marginTop: "70px" }}>
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  className="feature-card"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -7 }}
                >
                  <div className="feature-icon">{feature.icon}</div>

                  <div className="feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <div className="feature-arrow">
                    <ArrowRight size={17} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-container">
            <div className="download-card">
              <div className="download-content">
                <div className="section-badge">
                  <ShieldCheck size={15} />
                  READY WHEN YOU NEED IT
                </div>

                <h2>
                  Safety tools,
                  <br />
                  <span>within reach.</span>
                </h2>

                <p>
                  Use the browser-based Safety Dashboard or download the
                  Android application for a dedicated mobile safety experience.
                </p>

                <div className="hero-actions">
                  <Link className="primary-button" to="/dashboard">
                    Open Safety Dashboard
                    <ArrowRight size={18} />
                  </Link>

                  <Link className="secondary-button" to="/download">
                    Download App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

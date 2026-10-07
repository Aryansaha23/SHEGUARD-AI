import { motion } from "framer-motion";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SiteLayout from "./SiteLayout";
import aryanPhoto from "../assets/aryan-saha.png";

export default function About() {
  return (
    <SiteLayout>
      <style>{`
        .about-developer-grid {
          display: grid;
          grid-template-columns: minmax(220px, 0.75fr) minmax(0, 1.5fr);
          gap: 45px;
          align-items: center;
        }

        .about-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          min-width: 0;
        }

        .about-info {
          padding: 20px;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .about-info-title {
          font-size: 32px;
          line-height: 1.2;
          margin-bottom: 18px;
        }

        .about-info-text {
          font-size: 16px;
          line-height: 1.8;
          max-width: 650px;
        }

        .about-contact-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 25px;
        }

        .about-photo {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.18);
          box-shadow: 0 15px 45px rgba(0,0,0,0.35);
          background: #151018;
          flex-shrink: 0;
        }

        .about-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        @media (max-width: 768px) {
          .about-developer-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .about-profile {
            padding: 10px 5px 20px;
          }

          .about-info {
            padding: 10px 5px 20px;
            text-align: center;
          }

          .about-info-title {
            font-size: 26px;
          }

          .about-info-text {
            font-size: 15px;
            line-height: 1.7;
            max-width: 100%;
          }

          .about-contact-buttons {
            justify-content: center;
          }

          .about-photo {
            width: 170px;
            height: 170px;
          }
        }

        @media (max-width: 480px) {
          .about-photo {
            width: 155px;
            height: 155px;
          }

          .about-info-title {
            font-size: 24px;
          }

          .about-contact-buttons {
            width: 100%;
          }

          .about-contact-buttons a {
            justify-content: center;
          }
        }
      `}</style>

      <main>
        {/* ==================== HERO ==================== */}
        <section className="section">
          <div className="section-container">
            <motion.div
              className="section-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-badge">ABOUT SHEGUARD AI</div>

              <h1>
                Technology designed around
                <br />
                <span>personal safety.</span>
              </h1>

              <p>
                SHEGUARD AI is a technology-driven personal safety platform
                designed to provide faster access to essential emergency and
                safety tools through a simple web and Android experience.
              </p>
            </motion.div>

            <div
              className="features-grid"
              style={{ marginTop: "55px" }}
            >
              <motion.article
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <span>01</span>
                </div>

                <h3>The Vision</h3>

                <p>
                  Bring practical emergency and personal safety tools into
                  one accessible experience.
                </p>
              </motion.article>

              <motion.article
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
              >
                <div className="feature-icon">
                  <span>02</span>
                </div>

                <h3>Mobile + Web</h3>

                <p>
                  Provide a consistent safety experience across the Android
                  application and browser platform.
                </p>
              </motion.article>

              <motion.article
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
              >
                <div className="feature-icon">
                  <span>03</span>
                </div>

                <h3>Built for Action</h3>

                <p>
                  Keep important safety actions visible, simple and quick to
                  access during emergency situations.
                </p>
              </motion.article>
            </div>
          </div>
        </section>

        {/* ==================== DEVELOPER ==================== */}
        <section className="section">
          <div className="section-container">
            <motion.div
              className="section-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-badge">ABOUT THE DEVELOPER</div>

              <h2>
                Built with a vision to make
                <br />
                <span>safety technology accessible.</span>
              </h2>

              <p>
                Meet the person behind the development and vision of
                SHEGUARD AI.
              </p>
            </motion.div>

            <motion.div
              className="download-card"
              style={{
                marginTop: "45px",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="about-developer-grid">

                {/* ==================== PROFILE ==================== */}
                <div className="about-profile">
                  <div className="about-photo">
                    <img
                      src={aryanPhoto}
                      alt="Aryan Saha - Founder and Project Lead of SHEGUARD AI"
                    />
                  </div>

                  <div
                    className="section-badge"
                    style={{ marginTop: "22px" }}
                  >
                    PROJECT LEAD
                  </div>

                  <h3
                    style={{
                      fontSize: "28px",
                      marginTop: "12px",
                      marginBottom: "5px",
                    }}
                  >
                    Aryan Saha
                  </h3>

                  <p style={{ margin: 0 }}>
                    Founder &amp; Project Lead
                  </p>
                </div>

                {/* ==================== INFORMATION ==================== */}
                <div className="about-info">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <ShieldCheck size={22} />
                    <strong>SHEGUARD AI</strong>
                  </div>

                  <h3 className="about-info-title">
                    Building technology for
                    <br />
                    safer emergency response.
                  </h3>

                  <p className="about-info-text">
                    SHEGUARD AI is being developed with the vision of creating
                    accessible technology that can help people stay prepared,
                    connected and safer during emergency situations.
                  </p>

                  <p className="about-info-text">
                    The project combines a modern web platform with an Android
                    safety application, bringing essential emergency actions
                    into one simple and accessible ecosystem.
                  </p>

                  <div className="about-contact-buttons">
                    <a
                      href="mailto:aryansaha2301@gmail.com"
                      className="secondary-button"
                    >
                      <Mail size={17} />
                      Email
                    </a>

                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-button"
                    >
                      LinkedIn
                    </a>

                    <a
                      href="https://github.com/Aryansaha23/SHEGUARD-AI"
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-button"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== PROJECT ==================== */}
        <section className="section">
          <div className="section-container">
            <motion.div
              className="section-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-badge">THE PROJECT</div>

              <h2>
                Focused on practical,
                <br />
                <span>real-world safety.</span>
              </h2>

              <p>
                SHEGUARD AI focuses on making important safety actions easier
                to discover and access when they matter most.
              </p>
            </motion.div>

            <div
              className="features-grid"
              style={{ marginTop: "45px" }}
            >
              <article className="feature-card">
                <div className="feature-icon">
                  <ShieldCheck size={22} />
                </div>

                <h3>Emergency Tools</h3>

                <p>
                  Quick access to SOS, emergency calling, trusted contacts
                  and location sharing.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">
                  <span>02</span>
                </div>

                <h3>Safety Resources</h3>

                <p>
                  Access useful safety locations and emergency resources from
                  a single platform.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">
                  <span>03</span>
                </div>

                <h3>Accessible Experience</h3>

                <p>
                  A clean web and mobile experience designed around fast,
                  understandable actions.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="section download-section">
          <div className="download-card">
            <div className="download-content">
              <div className="section-badge">SHEGUARD AI</div>

              <h2>
                Safety should be
                <br />
                <span>within reach.</span>
              </h2>

              <p>
                Explore the SHEGUARD AI safety dashboard or download the
                Android application.
              </p>

              <div className="hero-buttons">
                <Link
                  className="primary-button"
                  to="/dashboard"
                >
                  Safety Dashboard
                  <ArrowRight size={18} />
                </Link>

                <Link
                  className="secondary-button"
                  to="/download"
                >
                  Download App
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER NOTE ==================== */}
        <section
          style={{
            padding: "0 20px 70px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            SHEGUARD AI is an independent developing project focused on
            technology-driven personal safety and accessible emergency tools.
          </p>
        </section>
      </main>
    </SiteLayout>
  );
}
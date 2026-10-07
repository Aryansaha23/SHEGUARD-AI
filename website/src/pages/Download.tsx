import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download as DownloadIcon,
  ShieldCheck,
  MapPin,
  Users,
  Smartphone,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteLayout from "./SiteLayout";

const GITHUB_API =
  "https://api.github.com/repos/Aryansaha23/SHEGUARD-AI/releases/tags/v1.0.0";

const FALLBACK_DOWNLOAD_URL =
  "https://github.com/Aryansaha23/SHEGUARD-AI/releases/download/v1.0.0/SHEGUARD-AI.apk";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  download_count: number;
}

interface GitHubRelease {
  assets: GitHubAsset[];
}

export default function Download() {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState(FALLBACK_DOWNLOAD_URL);
  const [loadingCount, setLoadingCount] = useState(true);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const loadDownloadStats = async () => {
    try {
      setLoadingCount(true);

      const response = await fetch(GITHUB_API, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch GitHub release data.");
      }

      const release: GitHubRelease = await response.json();

      const apkAsset = release.assets.find(
        (asset) => asset.name.toLowerCase() === "sheguard-ai.apk"
      );

      if (apkAsset) {
        setDownloadCount(apkAsset.download_count);
        setDownloadUrl(apkAsset.browser_download_url);
      }
    } catch (error) {
      console.error("Download statistics error:", error);
      setDownloadCount(null);
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    loadDownloadStats();
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);

    window.location.href = downloadUrl;

    setTimeout(() => {
      setDownloadStarted(false);
    }, 3000);
  };

  return (
    <SiteLayout>
      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-badge">
                <Smartphone size={16} />
                Android Application
              </div>

              <h1>
                Download <span>SHEGUARD AI</span>
              </h1>

              <p>
                Get the SHEGUARD AI Android application and access emergency
                safety tools, trusted contacts, location sharing and emergency
                services from your phone.
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleDownload}
                >
                  <DownloadIcon size={18} />
                  {downloadStarted ? "Download Started" : "Download APK"}
                </button>

                <Link to="/dashboard" className="secondary-button">
                  Open Safety Dashboard
                  <ArrowRight size={18} />
                </Link>
              </div>

              <p className="hero-note">
                Android APK • SHEGUARD AI v1.0.0
              </p>
            </motion.div>
          </div>
        </section>

        {/* DOWNLOAD STATISTICS */}
        <section className="section">
          <div className="section-container">
            <motion.div
              className="section-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-eyebrow">LIVE STATISTICS</span>

              <h2>Real APK Downloads</h2>

              <p>
                Download statistics are read directly from the SHEGUARD AI
                GitHub release asset.
              </p>
            </motion.div>

            <div className="feature-grid">
              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <DownloadIcon size={24} />
                </div>

                <h3>
                  {loadingCount
                    ? "Loading..."
                    : downloadCount !== null
                      ? downloadCount.toLocaleString()
                      : "Unavailable"}
                </h3>

                <p>GitHub APK downloads</p>

                <button
                  type="button"
                  className="text-button"
                  onClick={loadDownloadStats}
                  disabled={loadingCount}
                >
                  <RefreshCw size={15} />
                  {loadingCount ? "Refreshing..." : "Refresh Count"}
                </button>
              </motion.div>

              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="feature-icon">
                  <ShieldCheck size={24} />
                </div>

                <h3>Official Release</h3>
                <p>SHEGUARD AI v1.0.0 is distributed through GitHub Releases.</p>
              </motion.div>

              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="feature-icon">
                  <Smartphone size={24} />
                </div>

                <h3>Android</h3>
                <p>Install the APK directly on a compatible Android device.</p>
              </motion.div>
            </div>

            <div className="download-info-card">
              <h3>Important</h3>
              <p>
                The number shown above is the download count reported by
                GitHub for the SHEGUARD-AI.apk release asset. It is not a
                fabricated website counter.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section section-dark">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-eyebrow">WHAT YOU GET</span>
              <h2>Safety tools in your pocket</h2>
              <p>
                The Android application brings the core SHEGUARD AI safety
                features directly to your mobile device.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <ShieldCheck size={24} />
                </div>
                <h3>Emergency SOS</h3>
                <p>Quickly access the emergency safety workflow.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <MapPin size={24} />
                </div>
                <h3>Location Tools</h3>
                <p>Access current location and nearby safety resources.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <h3>Trusted Contacts</h3>
                <p>Keep important emergency contacts available.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Smartphone size={24} />
                </div>
                <h3>Android App</h3>
                <p>Use SHEGUARD AI directly from your Android phone.</p>
              </div>
            </div>
          </div>
        </section>

        {/* INSTALLATION */}
        <section className="section">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-eyebrow">INSTALLATION</span>
              <h2>How to install</h2>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <span>01</span>
                <h3>Download the APK</h3>
                <p>
                  Click the Download APK button and download the official
                  SHEGUARD AI release.
                </p>
              </div>

              <div className="step-card">
                <span>02</span>
                <h3>Allow installation</h3>
                <p>
                  If Android asks for permission to install from this source,
                  allow it for your browser or file manager.
                </p>
              </div>

              <div className="step-card">
                <span>03</span>
                <h3>Install & open</h3>
                <p>
                  Install SHEGUARD AI and open the application to configure
                  your safety tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-container">
            <h2>Need browser-based safety tools?</h2>

            <p>
              You can also use the SHEGUARD AI Safety Dashboard directly from
              your browser.
            </p>

            <Link to="/dashboard" className="primary-button">
              Open Safety Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
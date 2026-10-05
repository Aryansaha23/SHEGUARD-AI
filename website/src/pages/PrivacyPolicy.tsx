import {
  ArrowLeft,
  Mail,
  Shield,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import "../App.css";
import "./PrivacyPolicy.css";

type PrivacySectionProps = {
  number: string;
  title: string;
  children: ReactNode;
};

function PrivacySection({
  number,
  title,
  children,
}: PrivacySectionProps) {
  return (
    <motion.section
      className="legal-section"
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="legal-number">
        {number}
      </div>

      <div className="legal-section-content">
        <h2>{title}</h2>
        {children}
      </div>
    </motion.section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">

      {/* NAVBAR */}

      <header className="legal-navbar">
        <div className="legal-nav-container">

          <a href="/" className="legal-brand">
            <div className="legal-brand-icon">
              <Shield size={21} />
            </div>

            <div>
              <span className="brand-name">
                SHEGUARD
              </span>

              <span className="brand-ai">
                AI
              </span>
            </div>
          </a>

          <a
            href="/"
            className="legal-back-button"
          >
            <ArrowLeft size={17} />
            Back to Website
          </a>

        </div>
      </header>

      <main>

        {/* HERO */}

        <section className="legal-hero">

          <div className="legal-hero-glow" />

          <div className="legal-hero-content">

            <div className="section-badge">
              <ShieldCheck size={15} />
              PRIVACY & DATA PROTECTION
            </div>

            <h1>
              Privacy
              <br />
              <span>
                Policy.
              </span>
            </h1>

            <p>
              This Privacy Policy explains how
              SHEGUARD AI handles information when
              you use the SHEGUARD AI website and
              Android application.
            </p>

            <div className="legal-updated">
              <Shield size={15} />
              Last updated: September 20, 2026
            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="legal-content">

          {/* INTRODUCTION */}

          <div className="legal-intro-card">

            <div className="legal-intro-icon">
              <ShieldCheck size={30} />
            </div>

            <div>
              <h2>
                Your privacy matters.
              </h2>

              <p>
                SHEGUARD AI is an independent
                developing personal safety project.
                We aim to keep the collection and use
                of information focused on the features
                required to provide the application
                experience.
              </p>

              <p>
                By using the SHEGUARD AI website or
                application, you acknowledge the
                practices described in this Privacy
                Policy.
              </p>
            </div>

          </div>

          <PrivacySection
            number="01"
            title="Information We Collect"
          >
            <p>
              Depending on how you use SHEGUARD AI,
              the application may process information
              that you provide directly or information
              required for particular safety features.
            </p>

            <ul>
              <li>
                Account information such as your name
                and email address.
              </li>

              <li>
                Emergency contact information that you
                choose to configure.
              </li>

              <li>
                Location information when you enable
                location-based features.
              </li>

              <li>
                Application settings and preferences
                required for the app experience.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection
            number="02"
            title="Location Data"
          >
            <p>
              SHEGUARD AI may request access to your
              device location for features such as live
              location sharing, safe-location assistance
              and emergency support.
            </p>

            <p>
              Location access is controlled through
              your device permissions. You can manage
              location permissions through your Android
              device settings.
            </p>

            <div className="legal-highlight">
              <span className="legal-highlight-icon">
                📍
              </span>

              <span>
                Location access is used only when
                location-based functionality requires
                it.
              </span>
            </div>
          </PrivacySection>

          <PrivacySection
            number="03"
            title="Emergency Contacts"
          >
            <p>
              SHEGUARD AI allows you to configure
              trusted or emergency contacts for safety
              functionality.
            </p>

            <p>
              You are responsible for ensuring that
              the contact information you provide is
              accurate and that you have appropriate
              permission to use another person's contact
              information.
            </p>
          </PrivacySection>

          <PrivacySection
            number="04"
            title="Account Information"
          >
            <p>
              Some application functionality may
              require you to create an account.
              Information associated with an account
              may include your name, email address and
              other information you provide during
              registration.
            </p>

            <p>
              The current developing version of
              SHEGUARD AI may store certain account
              information locally on the device.
            </p>
          </PrivacySection>

          <PrivacySection
            number="05"
            title="Local Storage"
          >
            <p>
              The application may use local device
              storage to maintain information required
              for the application experience, such as
              login state, profile information and
              application preferences.
            </p>

            <p>
              Local storage is stored on your device
              and may be removed when application data
              is cleared or the application is
              uninstalled, depending on your device.
            </p>
          </PrivacySection>

          <PrivacySection
            number="06"
            title="How Information Is Used"
          >
            <p>
              Information processed by SHEGUARD AI
              may be used to provide and support
              application functionality, including:
            </p>

            <ul>
              <li>
                Providing safety and emergency
                features.
              </li>

              <li>
                Supporting location-based functionality.
              </li>

              <li>
                Managing user accounts and application
                sessions.
              </li>

              <li>
                Connecting users with configured
                emergency contacts.
              </li>

              <li>
                Improving the application's
                functionality and user experience.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection
            number="07"
            title="Third-Party Services"
          >
            <p>
              Certain SHEGUARD AI features may depend
              on third-party technologies or services,
              such as mapping, device location,
              communication services or hosting
              infrastructure.
            </p>

            <p>
              Third-party services may process
              information according to their own
              privacy policies and terms.
            </p>
          </PrivacySection>

          <PrivacySection
            number="08"
            title="Data Security"
          >
            <p>
              We aim to use reasonable technical and
              organizational measures to protect
              information used by the project.
            </p>

            <p>
              However, no electronic storage,
              transmission method or software system
              can be guaranteed to be completely
              secure.
            </p>
          </PrivacySection>

          <PrivacySection
            number="09"
            title="Children's Privacy"
          >
            <p>
              SHEGUARD AI is not intentionally designed
              to collect personal information from
              children.
            </p>

            <p>
              If you believe that a child has provided
              personal information through the service,
              please contact the project team so the
              situation can be reviewed.
            </p>
          </PrivacySection>

          <PrivacySection
            number="10"
            title="Your Choices"
          >
            <p>
              You can manage certain permissions
              directly through your device, including
              location and other application
              permissions.
            </p>

            <p>
              You may also stop using the application
              and remove locally stored application data
              through your device settings.
            </p>
          </PrivacySection>

          <PrivacySection
            number="11"
            title="Changes to This Privacy Policy"
          >
            <p>
              This Privacy Policy may be updated as
              SHEGUARD AI develops new features,
              integrations and services.
            </p>

            <p>
              When significant changes are made, the
              updated version will be published on this
              website with a revised update date.
            </p>
          </PrivacySection>

          <PrivacySection
            number="12"
            title="Contact"
          >
            <p>
              If you have questions, concerns or
              requests regarding this Privacy Policy,
              you can contact the SHEGUARD AI project
              team.
            </p>

            <a
              href="mailto:aryansaha2301@gmail.com"
              className="legal-contact"
            >
              <Mail size={18} />
              aryansaha2301@gmail.com
            </a>
          </PrivacySection>

          {/* DISCLAIMER */}

          <div className="legal-disclaimer">

            <ShieldCheck size={24} />

            <div>
              <h3>
                Important Safety Notice
              </h3>

              <p>
                SHEGUARD AI is a developing personal
                safety project. It should not be
                considered a replacement for official
                emergency services, police, medical
                services or other professional
                emergency assistance.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="legal-footer">

        <div className="legal-footer-main">

          <div>

            <a
              href="/"
              className="legal-footer-brand"
            >
              <Shield size={18} />
              SHEGUARD AI
            </a>

            <p>
              AI-powered personal safety technology
              designed for safer journeys.
            </p>

          </div>

          <div className="legal-footer-links">

            <a href="/">
              Home
            </a>

            <a href="/privacy">
              Privacy Policy
            </a>

            <a href="mailto:aryansaha2301@gmail.com">
              Contact
            </a>

          </div>

        </div>

        <div className="legal-footer-bottom">
          © 2026 SHEGUARD AI. All rights reserved.
        </div>

      </footer>

    </div>
  );
}
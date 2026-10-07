import {

  useEffect,

  useState,

  type ReactNode,

} from "react";



import {

  ArrowRight,
  LocateFixed,
  Plus,
  Trash2,

  Download,

  ExternalLink,

  Mail,

  MapPin,

  Menu,

  Phone,

  Shield,

  ShieldCheck,

  Sparkles,

  Users,

  X,

} from "lucide-react";



import { motion } from "framer-motion";

import "./App.css";



type FeatureCardProps = {

  icon: ReactNode;

  title: string;

  description: string;

};



type StepProps = {

  number: string;

  title: string;

  description: string;

};



type FaqItemProps = {

  question: string;

  answer: string;

};



const features: FeatureCardProps[] = [

  {

    icon: <ShieldCheck size={28} />,

    title: "Emergency SOS",

    description:

      "Send an emergency alert quickly when you need immediate help.",

  },

  {

    icon: <MapPin size={28} />,

    title: "Live Location",

    description:

      "Share your current location with trusted people during an emergency.",

  },

  {

    icon: <MapPin size={28} />,

    title: "Safe Location",

    description:

      "Find nearby police stations, hospitals, pharmacies and other useful places.",

  },

  {

    icon: <Users size={28} />,

    title: "Emergency Contacts",

    description:

      "Keep important contacts ready so help can be reached faster.",

  },

  {

    icon: <Phone size={28} />,

    title: "Safe Exit",

    description:

      "Use a simulated incoming call to create a safer exit from uncomfortable situations.",

  },

  {

    icon: <Sparkles size={28} />,

    title: "AI Safety Assistant",

    description:

      "AI-powered safety assistance is planned for the next stage of SHEGUARD AI.",

  },

];



const navItems = [

  { id: "home", label: "Home" },

  { id: "features", label: "Features" },

  { id: "how-it-works", label: "How It Works" },

  { id: "technology", label: "Technology" },

  { id: "privacy", label: "Safety" },

  { id: "about", label: "About" },

  { id: "faq", label: "FAQ" },

];




type TrustedContact = {
  id: string;
  name: string;
  phone: string;
};

function SafetyDashboard() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState("Location not fetched");
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    try {
      const saved = localStorage.getItem("sheguard_trusted_contacts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sosState, setSosState] = useState("READY");

  useEffect(() => {
    localStorage.setItem("sheguard_trusted_contacts", JSON.stringify(contacts));
  }, [contacts]);

  const getLocation = (silent = false) => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by this browser");
      return Promise.reject(new Error("Geolocation not supported"));
    }

    if (!silent) setLocationStatus("Getting your location…");

    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(next);
          setLocationStatus("Location ready");
          resolve(next);
        },
        (error) => {
          setLocationStatus(error.code === 1 ? "Location permission denied" : "Unable to get location");
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
      );
    });
  };

  const mapsUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
    : "https://www.google.com/maps/search/?api=1&query=My+Location";

  const triggerSOS = async () => {
    setSosState("ACTIVATING…");
    try {
      const current = await getLocation(true);
      const message = `SHEGUARD AI EMERGENCY ALERT. I may need help. My current location: https://www.google.com/maps/search/?api=1&query=${current.latitude},${current.longitude}`;
      if (contacts.length > 0) {
        const recipients = contacts.map((contact) => contact.phone).join(",");
        window.location.href = `sms:${recipients}?body=${encodeURIComponent(message)}`;
        setSosState("SMS READY");
      } else {
        setSosState("NO CONTACTS");
        window.alert("Add at least one trusted contact before using SOS.");
      }
    } catch {
      setSosState("LOCATION ERROR");
    }
  };

  const addContact = () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (!cleanName || !cleanPhone) return;
    setContacts((current) => [
      ...current,
      { id: `${Date.now()}-${Math.random()}`, name: cleanName, phone: cleanPhone },
    ]);
    setName("");
    setPhone("");
  };

  const removeContact = (id: string) => {
    setContacts((current) => current.filter((contact) => contact.id !== id));
  };

  return (
    <section id="dashboard" className="dashboard-section section">
      <div className="section-heading">
        <div className="section-badge"><Shield size={15} /> SAFETY DASHBOARD</div>
        <h2>Use SHEGUARD <span>right now.</span></h2>
        <p>Browser-ready safety tools for location, emergency calling, trusted contacts and nearby safe places.</p>
      </div>

      <div className="dashboard-grid">
        <motion.div className="dashboard-sos-card" whileHover={{ y: -4 }}>
          <div className="dashboard-card-top">
            <div>
              <span className="dashboard-eyebrow">EMERGENCY CONTROL</span>
              <h3>Emergency SOS</h3>
            </div>
            <span className={`dashboard-status ${sosState !== "READY" ? "dashboard-status-active" : ""}`}>{sosState}</span>
          </div>
          <p>Get your current location and prepare an emergency SMS for your trusted contacts.</p>
          <button className="dashboard-sos-button" onClick={triggerSOS}>
            <ShieldCheck size={25} />
            <span>SOS</span>
            <small>ACTIVATE EMERGENCY</small>
          </button>
          <div className="dashboard-note">Web browsers cannot silently send SMS; your phone's SMS app will open for confirmation.</div>
        </motion.div>

        <div className="dashboard-actions-card">
          <div className="dashboard-card-top">
            <div>
              <span className="dashboard-eyebrow">QUICK ACTIONS</span>
              <h3>Emergency tools</h3>
            </div>
            <ShieldCheck size={22} className="dashboard-card-icon" />
          </div>
          <div className="dashboard-action-grid">
            <button className="dashboard-action" onClick={() => getLocation()}>
              <LocateFixed size={22} /><span>Get Location</span><small>{locationStatus}</small>
            </button>
            <a className="dashboard-action" href="tel:112">
              <Phone size={22} /><span>Call 112</span><small>Emergency services</small>
            </a>
            <a className="dashboard-action" href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={22} /><span>My Location</span><small>Open Google Maps</small>
            </a>
            <a className="dashboard-action" href="https://www.google.com/maps/search/police+station+near+me" target="_blank" rel="noreferrer">
              <Shield size={22} /><span>Police Station</span><small>Find nearby</small>
            </a>
            <a className="dashboard-action" href="https://www.google.com/maps/search/hospital+near+me" target="_blank" rel="noreferrer">
              <Plus size={22} /><span>Hospital</span><small>Find nearby</small>
            </a>
            <a className="dashboard-action" href="https://www.google.com/maps/search/pharmacy+near+me" target="_blank" rel="noreferrer">
              <MapPin size={22} /><span>Pharmacy</span><small>Find nearby</small>
            </a>
          </div>
        </div>
      </div>

      <div className="dashboard-contacts">
        <div className="dashboard-card-top">
          <div>
            <span className="dashboard-eyebrow">TRUSTED CONTACTS</span>
            <h3>Your emergency circle</h3>
          </div>
          <Users size={22} className="dashboard-card-icon" />
        </div>
        <div className="contact-form">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Contact name" aria-label="Contact name" />
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" aria-label="Phone number" type="tel" />
          <button className="primary-button contact-add" onClick={addContact}><Plus size={17} /> Add Contact</button>
        </div>
        <div className="contact-list">
          {contacts.length === 0 ? (
            <div className="contact-empty">No trusted contacts added yet. Add one above to enable SOS SMS preparation.</div>
          ) : contacts.map((contact) => (
            <div className="contact-item" key={contact.id}>
              <div className="contact-avatar"><Users size={18} /></div>
              <div className="contact-info"><strong>{contact.name}</strong><span>{contact.phone}</span></div>
              <a href={`tel:${contact.phone}`} className="contact-call"><Phone size={16} /></a>
              <button className="contact-delete" onClick={() => removeContact(contact.id)} aria-label={`Remove ${contact.name}`}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("home");



  useEffect(() => {

    const sections = navItems

      .map((item) => document.getElementById(item.id))

      .filter(Boolean) as HTMLElement[];



    const observer = new IntersectionObserver(

      (entries) => {

        const visibleEntries = entries

          .filter((entry) => entry.isIntersecting)

          .sort(

            (a, b) =>

              b.intersectionRatio - a.intersectionRatio

          );



        if (visibleEntries.length > 0) {

          setActiveSection(

            visibleEntries[0].target.id

          );

        }

      },

      {

        root: null,

        rootMargin: "-30% 0px -55% 0px",

        threshold: [0, 0.1, 0.25, 0.5, 0.75],

      }

    );



    sections.forEach((section) => {

      observer.observe(section);

    });



    const handleScroll = () => {

      if (window.scrollY < 250) {

        setActiveSection("home");

      }

    };



    window.addEventListener("scroll", handleScroll, {

      passive: true,

    });



    return () => {

      observer.disconnect();

      window.removeEventListener(

        "scroll",

        handleScroll

      );

    };

  }, []);



  const scrollToSection = (id: string) => {

    const section = document.getElementById(id);



    if (section) {

      section.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }



    setActiveSection(id);

    setMenuOpen(false);

  };



  return (

    <div className="app">



      {/* NAVBAR */}



      <header className="navbar">

        <div className="nav-container">



          <button

            className="brand"

            onClick={() =>

              scrollToSection("home")

            }

          >

            <div className="brand-icon">

              <Shield size={22} />

            </div>



            <div>

              <span className="brand-name">

                SHEGUARD

              </span>



              <span className="brand-ai">

                AI

              </span>

            </div>

          </button>



          <nav

            className={`nav-links ${

              menuOpen ? "mobile-open" : ""

            }`}

          >

            {navItems.map((item) => (

              <button

                key={item.id}

                className={

                  activeSection === item.id

                    ? "nav-active"

                    : ""

                }

                onClick={() =>

                  scrollToSection(item.id)

                }

              >

                {item.label}

              </button>

            ))}



            <button

              className="nav-download"

              onClick={() =>

                scrollToSection("download")

              }

            >

              Download

            </button>

          </nav>



          <button

            className="menu-button"

            onClick={() =>

              setMenuOpen(!menuOpen)

            }

            aria-label="Toggle menu"

          >

            {menuOpen ? (

              <X size={25} />

            ) : (

              <Menu size={25} />

            )}

          </button>



        </div>

      </header>



      {/* MAIN */}



      <main>



        {/* HERO */}



        <section

          id="home"

          className="hero section"

        >

          <div className="hero-glow glow-one" />

          <div className="hero-glow glow-two" />



          <div className="hero-grid">



            <motion.div

              className="hero-content"

              initial={{

                opacity: 0,

                y: 35,

              }}

              animate={{

                opacity: 1,

                y: 0,

              }}

              transition={{

                duration: 0.8,

              }}

            >



              <div className="ai-badge">

                <Sparkles size={16} />



                <span>

                  AI-POWERED PERSONAL SAFETY

                </span>

              </div>



              <h1>

                Your Safety.

                <br />

                <span>

                  Our Intelligence.

                </span>

              </h1>



              <p>

                SHEGUARD AI is a personal safety

                platform designed to help women

                respond quickly during emergency

                situations with SOS, location sharing,

                trusted contacts and intelligent

                safety assistance.

              </p>



              <div className="hero-buttons">



                <button

                  className="primary-button"

                  onClick={() =>

                    scrollToSection("download")

                  }

                >

                  <Download size={19} />

                  Download App

                  <ArrowRight size={18} />

                </button>



                <button

                  className="secondary-button"

                  onClick={() =>

                    scrollToSection("features")

                  }

                >

                  Explore Features

                </button>



              </div>



              <div className="trust-row">



                <div>

                  <ShieldCheck size={18} />

                  <span>

                    Fast Emergency Response

                  </span>

                </div>



                <div>

                  <MapPin size={18} />

                  <span>

                    Location Assistance

                  </span>

                </div>



                <div>

                  <Users size={18} />

                  <span>

                    Trusted Contacts

                  </span>

                </div>



              </div>



            </motion.div>



            {/* PHONE MOCKUP */}



            <motion.div

              className="hero-visual"

              initial={{

                opacity: 0,

                scale: 0.85,

              }}

              animate={{

                opacity: 1,

                scale: 1,

              }}

              transition={{

                duration: 1,

              }}

            >



              <div className="phone-glow" />



              <div className="phone">



                <div className="phone-notch" />



                <div className="phone-screen">



                  <div className="phone-header">



                    <div>

                      <small>

                        Welcome back

                      </small>



                      <strong>

                        SHEGUARD AI

                      </strong>

                    </div>



                    <div className="mini-shield">

                      <Shield size={17} />

                    </div>



                  </div>



                  <div className="protection-card">



                    <div className="protection-icon">

                      <ShieldCheck size={23} />

                    </div>



                    <div>

                      <span>

                        Protection Status

                      </span>



                      <strong>

                        ACTIVE

                      </strong>

                    </div>



                    <div className="active-dot" />



                  </div>



                  <div className="sos-area">



                    <div className="sos-ring ring-one" />

                    <div className="sos-ring ring-two" />



                    <button className="sos-button">

                      <span>SOS</span>

                      <small>

                        EMERGENCY

                      </small>

                    </button>



                  </div>



                  <div className="phone-actions">



                    <div className="phone-action">

                      <MapPin size={20} />



                      <span>

                        Live Location

                      </span>

                    </div>



                    <div className="phone-action">

                      <Users size={20} />



                      <span>

                        Contacts

                      </span>

                    </div>



                  </div>



                  <div className="safe-status">



                    <div className="status-check">

                      <ShieldCheck size={17} />

                    </div>



                    <div>

                      <strong>

                        You are protected

                      </strong>



                      <span>

                        SHEGUARD is ready when you

                        need it.

                      </span>

                    </div>



                  </div>



                </div>

              </div>



              <motion.div

                className="floating-card location-card"

                animate={{

                  y: [0, -10, 0],

                }}

                transition={{

                  duration: 3,

                  repeat: Infinity,

                  ease: "easeInOut",

                }}

              >



                <div className="floating-icon">

                  <MapPin size={18} />

                </div>



                <div>

                  <strong>

                    Live Location

                  </strong>



                  <span>

                    Sharing active

                  </span>

                </div>



              </motion.div>



              <motion.div

                className="floating-card safety-card"

                animate={{

                  y: [0, 10, 0],

                }}

                transition={{

                  duration: 3.5,

                  repeat: Infinity,

                  ease: "easeInOut",

                }}

              >



                <div className="floating-icon">

                  <ShieldCheck size={18} />

                </div>



                <div>

                  <strong>

                    Safety Active

                  </strong>



                  <span>

                    You're protected

                  </span>

                </div>



              </motion.div>



            </motion.div>



          </div>

        </section>



        <SafetyDashboard />



        {/* STATS */}



        <section className="stats-section">



          <div className="stats-container">



            <div>

              <strong>01</strong>

              <span>

                Safety Platform

              </span>

            </div>



            <div>

              <strong>24/7</strong>

              <span>

                Ready for Emergencies

              </span>

            </div>



            <div>

              <strong>06+</strong>

              <span>

                Core Safety Features

              </span>

            </div>



            <div>

              <strong>AI</strong>

              <span>

                Future Intelligence Layer

              </span>

            </div>



          </div>



        </section>



        {/* FEATURES */}



        <section

          id="features"

          className="section features-section"

        >



          <div className="section-heading">



            <div className="section-badge">

              <Sparkles size={15} />

              SAFETY FEATURES

            </div>



            <h2>

              Protection designed

              <br />

              <span>

                around you.

              </span>

            </h2>



            <p>

              SHEGUARD AI brings essential safety

              tools together in one simple and

              accessible platform.

            </p>



          </div>



          <div className="features-grid">



            {features.map(

              (feature, index) => (

                <FeatureCard

                  key={feature.title}

                  {...feature}

                  index={index}

                />

              )

            )}



          </div>



        </section>



        {/* HOW IT WORKS */}



        <section

          id="how-it-works"

          className="section how-section"

        >



          <div className="section-heading">



            <div className="section-badge">

              <Shield size={15} />

              HOW IT WORKS

            </div>



            <h2>

              Safety in

              <br />

              <span>

                three simple steps.

              </span>

            </h2>



            <p>

              Designed to keep emergency actions

              simple, fast and easy to understand.

            </p>



          </div>



          <div className="steps-container">



            <Step

              number="01"

              title="Open SHEGUARD"

              description="Access the safety dashboard and keep your emergency tools ready."

            />



            <div className="step-line" />



            <Step

              number="02"

              title="Trigger Help"

              description="Use SOS, location sharing or another available safety feature."

            />



            <div className="step-line" />



            <Step

              number="03"

              title="Stay Connected"

              description="Share important information with trusted people and reach safer locations."

            />



          </div>



        </section>



        {/* TECHNOLOGY */}



        <section

          id="technology"

          className="section technology-section"

        >



          <div className="section-heading">



            <div className="section-badge">

              <Sparkles size={15} />

              TECHNOLOGY

            </div>



            <h2>

              Built with

              <br />

              <span>

                modern technology.

              </span>

            </h2>



            <p>

              SHEGUARD AI combines mobile

              development, backend services,

              location technology and AI-ready

              architecture.

            </p>



          </div>



          <div className="technology-grid">



            <div className="technology-card">

              <div className="technology-logo">

                RN

              </div>



              <h3>

                React Native

              </h3>



              <p>

                Mobile application development

                for Android.

              </p>

            </div>



            <div className="technology-card">

              <div className="technology-logo">

                TS

              </div>



              <h3>

                TypeScript

              </h3>



              <p>

                Reliable and structured

                application development.

              </p>

            </div>



            <div className="technology-card">

              <div className="technology-logo">

                JS

              </div>



              <h3>

                Node.js

              </h3>



              <p>

                Backend API and server-side

                application logic.

              </p>

            </div>



            <div className="technology-card">

              <div className="technology-logo">

                K

              </div>



              <h3>

                Kotlin

              </h3>



              <p>

                Android native functionality

                and system integration.

              </p>

            </div>



            <div className="technology-card">

              <div className="technology-logo">

                AI

              </div>



              <h3>

                AI Ready

              </h3>



              <p>

                Architecture prepared for future

                AI safety capabilities.

              </p>

            </div>



            <div className="technology-card">

              <div className="technology-logo">

                GPS

              </div>



              <h3>

                Location Services

              </h3>



              <p>

                Location-based safety and

                emergency assistance.

              </p>

            </div>



          </div>



        </section>



        {/* SAFETY & PRIVACY */}



        <section

          id="privacy"

          className="section privacy-section"

        >



          <div className="privacy-card">



            <div className="privacy-content">



              <div className="section-badge">

                <ShieldCheck size={15} />

                SAFETY & PRIVACY

              </div>



              <h2>

                Your safety comes

                <br />

                <span>

                  first.

                </span>

              </h2>



              <p>

                SHEGUARD AI is designed around

                simple, accessible and safety-focused

                tools that help users stay prepared

                during emergency situations.

              </p>



              <div className="privacy-points">



                <div className="privacy-point">



                  <div className="privacy-point-icon">

                    <ShieldCheck size={20} />

                  </div>



                  <div>

                    <h3>

                      Safety-focused design

                    </h3>



                    <p>

                      Emergency features are kept

                      simple so important actions can

                      be accessed quickly.

                    </p>

                  </div>



                </div>



                <div className="privacy-point">



                  <div className="privacy-point-icon">

                    <MapPin size={20} />

                  </div>



                  <div>

                    <h3>

                      Location awareness

                    </h3>



                    <p>

                      Location features are used to

                      support emergency assistance

                      and nearby safety information.

                    </p>

                  </div>



                </div>



                <div className="privacy-point">



                  <div className="privacy-point-icon">

                    <Users size={20} />

                  </div>



                  <div>

                    <h3>

                      Trusted connections

                    </h3>



                    <p>

                      Emergency contacts help users

                      stay connected with people they

                      trust.

                    </p>

                  </div>



                </div>



              </div>



            </div>



            <div className="privacy-visual">



              <div className="privacy-glow" />



              <div className="privacy-shield">



                <ShieldCheck size={75} />



                <strong>

                  SAFETY

                </strong>



                <span>

                  BY DESIGN

                </span>



              </div>



              <div className="privacy-orbit orbit-a" />

              <div className="privacy-orbit orbit-b" />



            </div>



          </div>



          <div className="privacy-note">



            <Shield size={15} />



            <span>

              SHEGUARD AI is a developing project.

              Emergency features should not be

              considered a replacement for official

              emergency services.

            </span>



          </div>



        </section>



        {/* ABOUT / FOUNDER */}



        <section

          id="about"

          className="section about-section"

        >



          <div className="section-heading founder-heading">



            <div className="section-badge">

              <ShieldCheck size={15} />

              ABOUT SHEGUARD AI

            </div>



            <h2>

              Built with a vision

              <br />

              <span>

                for safer journeys.

              </span>

            </h2>



            <p>

              SHEGUARD AI is being developed as

              a modern personal safety platform

              that brings essential emergency

              tools together in one accessible

              experience.

            </p>



          </div>



          <motion.div

            className="founder-card"

            initial={{

              opacity: 0,

              y: 35,

            }}

            whileInView={{

              opacity: 1,

              y: 0,

            }}

            viewport={{

              once: true,

              amount: 0.2,

            }}

            transition={{

              duration: 0.7,

            }}

          >



            <div className="founder-photo-area">



              <div className="founder-photo-glow" />



              <div className="founder-photo-ring">



                <img

                  src="/images/founder.png"

                  alt="Aryan Saha - Founder and Project Lead of SHEGUARD AI"

                  className="founder-photo"

                />



              </div>



              <div className="founder-floating-badge">



                <ShieldCheck size={17} />



                <span>

                  PROJECT LEAD

                </span>



              </div>



            </div>



            <div className="founder-info">



              <div className="founder-role">



                <Sparkles size={15} />



                FOUNDER & PROJECT LEAD



              </div>



              <h3>

                Aryan Saha

              </h3>



              <p className="founder-description">

                Building SHEGUARD AI with the

                vision of creating accessible

                technology that can help people

                stay prepared, connected and safer

                during emergency situations.

              </p>



              <div className="founder-details">



                <a

                  href="mailto:aryansaha2301@gmail.com"

                  className="founder-contact"

                >



                  <div className="founder-contact-icon">

                    <Mail size={19} />

                  </div>



                  <div>



                    <span>

                      Email

                    </span>



                    <strong>

                      aryansaha2301@gmail.com

                    </strong>



                  </div>



                </a>



                <a

                  href="https://www.linkedin.com/in/aryan-saha-583372264/"

                  target="_blank"

                  rel="noreferrer"

                  className="founder-contact"

                >



                  <div className="founder-contact-icon">

                    <ExternalLink size={19} />

                  </div>



                  <div>



                    <span>

                      LinkedIn

                    </span>



                    <strong>

                      Connect with Aryan Saha

                    </strong>



                  </div>



                </a>



              </div>



              <div className="founder-actions">



                <a

                  href="https://www.linkedin.com/in/aryan-saha-583372264/"

                  target="_blank"

                  rel="noreferrer"

                  className="primary-button founder-linkedin-button"

                >

                  <ExternalLink size={18} />



                  View LinkedIn



                  <ArrowRight size={17} />

                </a>



                <button

                  className="outline-button"

                  onClick={() =>

                    scrollToSection("features")

                  }

                >

                  Explore Features



                  <ArrowRight size={17} />

                </button>



              </div>



            </div>



          </motion.div>



          <div className="founder-note">



            <Shield size={15} />



            <span>

              SHEGUARD AI is an independent

              developing project focused on

              technology-driven personal safety.

            </span>



          </div>



        </section>



        {/* FAQ */}



        <section

          id="faq"

          className="section faq-section"

        >



          <div className="section-heading">



            <div className="section-badge">

              <Sparkles size={15} />

              FAQ

            </div>



            <h2>

              Questions,

              <br />

              <span>

                answered simply.

              </span>

            </h2>



            <p>

              Find quick answers to common questions

              about SHEGUARD AI and its safety features.

            </p>



          </div>



          <div className="faq-container">



            <FaqItem

              question="What is SHEGUARD AI?"

              answer="SHEGUARD AI is a personal safety platform designed to bring emergency tools such as SOS, location sharing, trusted contacts and safe-location assistance together in one application."

            />



            <FaqItem

              question="Is SHEGUARD AI free to use?"

              answer="The current SHEGUARD AI Android application is distributed as an APK for direct download. Availability of individual features may depend on the current version of the application."

            />



            <FaqItem

              question="Does SHEGUARD AI share my location?"

              answer="Location sharing is used by supported safety features to help communicate your current location. Location permissions are required for location-based functionality."

            />



            <FaqItem

              question="How does Emergency SOS work?"

              answer="The SOS feature is designed to help initiate an emergency alert and share relevant safety information with configured emergency contacts, depending on available device permissions and application configuration."

            />



            <FaqItem

              question="Can I use SHEGUARD AI without an account?"

              answer="Some application functionality may require registration and login. The exact requirements depend on the current application version and enabled features."

            />



            <FaqItem

              question="Is SHEGUARD AI a replacement for emergency services?"

              answer="No. SHEGUARD AI is a developing personal safety project and should not be considered a replacement for official emergency services or professional emergency assistance."

            />



          </div>



        </section>



        {/* DOWNLOAD */}



        <section

          id="download"

          className="section download-section"

        >



          <div className="download-card">



            <div className="download-glow" />



            <div className="download-content">



              <div className="section-badge">

                <Download size={15} />

                GET THE APP

              </div>



              <h2>

                SHEGUARD AI.

                <br />

                <span>

                  Safety within reach.

                </span>

              </h2>



              <p>

                Download the SHEGUARD AI Android

                application and keep essential

                personal safety tools ready whenever

                you need them.

              </p>



              <div className="download-meta">



                <div className="download-meta-item">



                  <ShieldCheck size={17} />



                  <div>

                    <strong>

                      Android App

                    </strong>



                    <span>

                      APK application

                    </span>

                  </div>



                </div>



                <div className="download-meta-item">



                  <Download size={17} />



                  <div>

                    <strong>

                      Direct Download

                    </strong>



                    <span>

                      No account required

                    </span>

                  </div>



                </div>



                <div className="download-meta-item">



                  <Sparkles size={17} />



                  <div>

                    <strong>

                      SHEGUARD AI

                    </strong>



                    <span>

                      Personal safety platform

                    </span>

                  </div>



                </div>



              </div>



              <a

                className="primary-button download-main-button"

                href="/downloads/SHEGUARD-AI.apk"

                download="SHEGUARD-AI.apk"

              >

                <Download size={19} />



                Download Android App



                <ArrowRight size={18} />

              </a>



              <div className="download-note">



                <Shield size={15} />



                <span>

                  Download the SHEGUARD AI APK

                  directly to your Android device.

                  Depending on your device settings,

                  you may need to allow installation

                  from your browser or file manager.

                </span>



              </div>



            </div>



            <div className="download-visual">



              <div className="download-visual-glow" />



              <div className="download-phone">



                <div className="download-phone-notch" />



                <div className="download-phone-screen">



                  <div className="download-phone-icon">

                    <ShieldCheck size={42} />

                  </div>



                  <strong>

                    SHEGUARD

                  </strong>



                  <span>

                    AI

                  </span>



                  <div className="download-phone-status">



                    <div className="download-status-dot" />



                    Safety Ready



                  </div>



                </div>



              </div>



              <div className="download-floating download-floating-one">



                <ShieldCheck size={18} />



                <span>

                  Safety First

                </span>



              </div>



              <div className="download-floating download-floating-two">



                <MapPin size={18} />



                <span>

                  Location Ready

                </span>



              </div>



            </div>



          </div>



        </section>



      </main>



      {/* FOOTER */}



      <footer className="footer">



        <div className="footer-container">



          <div className="footer-brand">



            <div className="brand">



              <div className="brand-icon">

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



            </div>



            <p>

              AI-powered personal safety

              technology designed to help you

              stay connected, prepared and safer.

            </p>



            <div className="footer-founder">



              <span>

                Founder & Project Lead

              </span>



              <strong>

                Aryan Saha

              </strong>



            </div>



          </div>



          <div className="footer-links">



            {navItems.map((item) => (

              <button

                key={item.id}

                onClick={() =>

                  scrollToSection(item.id)

                }

              >

                {item.label}

              </button>

            ))}



            <button

              onClick={() =>

                scrollToSection("download")

              }

            >

              Download

            </button>



            <a href="/privacy">

              Privacy Policy

            </a>



            <a href="/terms">

              Terms & Conditions

            </a>



          </div>



          <div className="footer-contact">



            <span>

              CONTACT

            </span>



            <a href="mailto:aryansaha2301@gmail.com">



              <Mail size={15} />



              aryansaha2301@gmail.com



            </a>



            <a

              href="https://www.linkedin.com/in/aryan-saha-583372264/"

              target="_blank"

              rel="noreferrer"

            >



              <ExternalLink size={15} />



              LinkedIn



            </a>



          </div>



        </div>



        <div className="footer-bottom">



          <span>

            © 2026 SHEGUARD AI. All rights reserved.

          </span>



          <span>

            Built for safer journeys.

          </span>



        </div>



      </footer>



    </div>

  );

}



/* FEATURE CARD */



function FeatureCard({

  icon,

  title,

  description,

  index,

}: FeatureCardProps & {

  index: number;

}) {

  return (

    <motion.div

      className="feature-card"

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

        amount: 0.2,

      }}

      transition={{

        duration: 0.5,

        delay: index * 0.08,

      }}

      whileHover={{

        y: -8,

      }}

    >



      <div className="feature-icon">

        {icon}

      </div>



      <div className="feature-number">

        {String(index + 1).padStart(2, "0")}

      </div>



      <h3>

        {title}

      </h3>



      <p>

        {description}

      </p>



      <div className="feature-arrow">

        <ArrowRight size={17} />

      </div>



    </motion.div>

  );

}



/* STEP */



function Step({

  number,

  title,

  description,

}: StepProps) {

  return (

    <motion.div

      className="step"

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

      }}

      transition={{

        duration: 0.5,

      }}

    >



      <div className="step-number">

        {number}

      </div>



      <h3>

        {title}

      </h3>



      <p>

        {description}

      </p>



    </motion.div>

  );

}



/* FAQ ITEM */



function FaqItem({

  question,

  answer,

}: FaqItemProps) {

  const [open, setOpen] = useState(false);



  return (

    <motion.div

      className={`faq-item ${

        open ? "faq-open" : ""

      }`}

      initial={{

        opacity: 0,

        y: 20,

      }}

      whileInView={{

        opacity: 1,

        y: 0,

      }}

      viewport={{

        once: true,

        amount: 0.2,

      }}

      transition={{

        duration: 0.45,

      }}

    >



      <button

        className="faq-question"

        onClick={() =>

          setOpen(!open)

        }

        aria-expanded={open}

      >



        <span>

          {question}

        </span>



        <span className="faq-icon">

          {open ? "−" : "+"}

        </span>



      </button>



      <div

        className={`faq-answer ${

          open ? "faq-answer-open" : ""

        }`}

      >



        <p>

          {answer}

        </p>



      </div>



    </motion.div>

  );

}



export default App;
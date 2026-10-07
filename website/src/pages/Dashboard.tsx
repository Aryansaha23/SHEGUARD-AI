import { useState } from "react";
import {
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Pill,
  ShieldCheck,
  Siren,
  Trash2,
  Users,
} from "lucide-react";
import SiteLayout from "./SiteLayout";

type Contact = {
  id: number;
  name: string;
  phone: string;
};

const STORAGE_KEY = "sheguard_contacts";

function getContacts(): Contact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function openMaps(query: string) {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

function callNumber(phone: string) {
  window.location.href = `tel:${phone}`;
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>(getContacts);
  const [location, setLocation] = useState<string>("Location not fetched yet");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const saveContacts = (next: Contact[]) => {
    setContacts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject(new Error("Location permission was denied or unavailable.")),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const handleLocation = async () => {
    setBusy(true);

    try {
      const coords = await getCurrentLocation();
      const value = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      setLocation(value);
    } catch (error) {
      setLocation(
        error instanceof Error
          ? error.message
          : "Unable to get your current location."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSos = async () => {
    if (!contacts.length) {
      alert("Please add at least one trusted contact before using SOS.");
      return;
    }

    setBusy(true);

    try {
      const coords = await getCurrentLocation();

      const mapsUrl =
        `https://www.google.com/maps/search/?api=1&query=` +
        `${coords.latitude},${coords.longitude}`;

      const locationText =
        `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;

      setLocation(locationText);

      const message =
        `SHEGUARD AI Emergency Alert.\n\n` +
        `I may need help. My current location is:\n${mapsUrl}`;

      const recipients = contacts
        .map((contact) => contact.phone.trim())
        .filter(Boolean)
        .join(",");

      window.location.href =
        `sms:${recipients}?body=${encodeURIComponent(message)}`;
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to get your location. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const addContact = () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanPhone) {
      alert("Please enter both contact name and phone number.");
      return;
    }

    const next = [
      ...contacts,
      {
        id: Date.now(),
        name: cleanName,
        phone: cleanPhone,
      },
    ];

    saveContacts(next);
    setName("");
    setPhone("");
  };

  const deleteContact = (id: number) => {
    saveContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <SiteLayout>
      <main>
        <section className="section">
          <div className="section-container">
            <div className="section-heading">
              <div className="section-badge">
                <ShieldCheck size={15} />
                SAFETY DASHBOARD
              </div>

              <h1>
                Your safety tools,
                <br />
                <span>within reach.</span>
              </h1>

              <p>
                Quick access to emergency actions, current location,
                nearby services and trusted contacts.
              </p>
            </div>

            <div className="features-grid" style={{ marginTop: 50 }}>
              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={handleSos}
                disabled={busy}
              >
                <div className="feature-icon">
                  <Siren />
                </div>
                <h3>{busy ? "Getting Location..." : "Emergency SOS"}</h3>
                <p>
                  Get your current location and open the phone SMS composer
                  with an emergency message.
                </p>
              </button>

              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={handleLocation}
                disabled={busy}
              >
                <div className="feature-icon">
                  <MapPin />
                </div>
                <h3>Get Current Location</h3>
                <p>{location}</p>
              </button>

              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={() => callNumber("112")}
              >
                <div className="feature-icon">
                  <Phone />
                </div>
                <h3>Call 112</h3>
                <p>Open your device's emergency calling action.</p>
              </button>

              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={() => openMaps("police station near me")}
              >
                <div className="feature-icon">
                  <Navigation />
                </div>
                <h3>Police Station</h3>
                <p>Find nearby police stations using Google Maps.</p>
              </button>

              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={() => openMaps("hospital near me")}
              >
                <div className="feature-icon">
                  <Hospital />
                </div>
                <h3>Hospital</h3>
                <p>Find nearby hospitals using Google Maps.</p>
              </button>

              <button
                type="button"
                className="feature-card dashboard-action"
                onClick={() => openMaps("pharmacy near me")}
              >
                <div className="feature-icon">
                  <Pill />
                </div>
                <h3>Pharmacy</h3>
                <p>Find nearby pharmacies using Google Maps.</p>
              </button>
            </div>

            <div className="download-card" style={{ marginTop: 35 }}>
              <div
                className="download-content"
                style={{ width: "100%" }}
              >
                <div className="section-badge">
                  <Users size={15} />
                  TRUSTED CONTACTS
                </div>

                <h2>
                  Keep your <span>people ready.</span>
                </h2>

                <p>
                  Contacts are stored locally in this browser using
                  localStorage.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    margin: "25px 0",
                  }}
                >
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Contact name"
                    aria-label="Contact name"
                    style={{
                      flex: "1 1 220px",
                      padding: 14,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,.12)",
                      background: "rgba(255,255,255,.04)",
                      color: "white",
                    }}
                  />

                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    aria-label="Phone number"
                    type="tel"
                    style={{
                      flex: "1 1 220px",
                      padding: 14,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,.12)",
                      background: "rgba(255,255,255,.04)",
                      color: "white",
                    }}
                  />

                  <button
                    type="button"
                    className="primary-button"
                    onClick={addContact}
                  >
                    Add Contact
                  </button>
                </div>

                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 0",
                      borderTop: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <span>
                      <strong>{contact.name}</strong>
                      <br />
                      <small>{contact.phone}</small>
                    </span>

                    <span
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => callNumber(contact.phone)}
                      >
                        <Phone size={15} />
                        Call
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => deleteContact(contact.id)}
                        aria-label={`Delete ${contact.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </div>
                ))}

                {!contacts.length && (
                  <p>No trusted contacts added yet.</p>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                padding: "16px 20px",
                borderRadius: 14,
                border: "1px solid rgba(236,72,153,.15)",
                background: "rgba(236,72,153,.04)",
              }}
            >
              <strong>Browser limitation:</strong>{" "}
              the website cannot silently send SMS in the background.
              SOS opens your device's SMS composer so you can review and
              send the emergency message.
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

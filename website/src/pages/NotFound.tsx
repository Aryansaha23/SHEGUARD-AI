import { motion } from "framer-motion";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 20%, rgba(236,72,153,0.16), transparent 35%), #0b0712",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(168,85,247,0.12)",
          filter: "blur(100px)",
          top: "-120px",
          right: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "rgba(236,72,153,0.10)",
          filter: "blur(100px)",
          bottom: "-120px",
          left: "-100px",
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "650px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "76px",
            height: "76px",
            margin: "0 auto 28px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #ec4899, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 20px 60px rgba(236,72,153,0.25)",
          }}
        >
          <ShieldAlert size={38} strokeWidth={1.8} />
        </motion.div>

        {/* Error code */}
        <div
          style={{
            fontSize: "clamp(80px, 16vw, 150px)",
            lineHeight: 0.9,
            fontWeight: 800,
            letterSpacing: "-8px",
            background:
              "linear-gradient(135deg, #ffffff, #ec4899, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "22px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            margin: "0 0 14px",
            fontWeight: 750,
            letterSpacing: "-1px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            color: "#aaa4b5",
            fontSize: "16px",
            lineHeight: 1.7,
          }}
        >
          The page you're looking for doesn't exist or may
          have been moved. Let's get you back to the
          SHEGUARD AI safety platform.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "34px",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "14px 22px",
              background:
                "linear-gradient(135deg, #ec4899, #8b5cf6)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              boxShadow:
                "0 12px 30px rgba(236,72,153,0.22)",
            }}
          >
            <Home size={18} />
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "14px",
              padding: "14px 22px",
              background: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              fontWeight: 650,
              fontSize: "15px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              backdropFilter: "blur(12px)",
            }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p
          style={{
            marginTop: "38px",
            color: "#716b7c",
            fontSize: "13px",
            letterSpacing: "0.3px",
          }}
        >
          SHEGUARD AI — Your Safety. Our Intelligence.
        </p>
      </motion.section>
    </main>
  );
}
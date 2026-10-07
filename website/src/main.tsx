import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Technology from "./pages/Technology";
import Safety from "./pages/Safety";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import HelpCenter from "./pages/HelpCenter";
import Download from "./pages/Download";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import App from "./App";
import NotFound from "./pages/NotFound";
createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><Routes>
<Route path="/" element={<Home/>}/><Route path="/features" element={<Features/>}/><Route path="/how-it-works" element={<HowItWorks/>}/><Route path="/technology" element={<Technology/>}/><Route path="/safety" element={<Safety/>}/><Route path="/about" element={<About/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/help-center" element={<HelpCenter/>}/><Route path="/download" element={<Download/>}/><Route path="/privacy" element={<PrivacyPolicy/>}/><Route path="/terms" element={<Terms/>}/><Route path="/legacy" element={<App/>}/><Route path="*" element={<NotFound/>}/>
</Routes></BrowserRouter></StrictMode>);

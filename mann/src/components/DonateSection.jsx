import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { img } from "../utils/images";
import Icon from "./Icon";

// ============ DONATE SECTION + RAZORPAY (brutalist) ============
const RAZORPAY_KEY = "rzp_live_T6FcPfo1mS01du";

const AMOUNTS = ["500", "1000", "2500", "5000"];
const PROJECT_OPTIONS = [
  "Project Poshan",
  "Project Gyaan",
  "Project Sakhi",
  "Project Swasth",
  "Project Pashu",
  "Project Paryavaran",
];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== "undefined") return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

const inputCls =
  "w-full rounded-2xl border border-primary/10 bg-surface-container-low p-5 text-lg text-on-surface outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50";

export default function DonateSection({ heading, subheading }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("1000");
  const [custom, setCustom] = useState("");
  const [project, setProject] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDonate = async () => {
    setError("");
    const amount = Math.round(Number(custom || selected));
    if (!amount || Number(amount) <= 0) {
      setError("Please select or enter a valid amount.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!/^\d{10}$/.test(contact)) {
      setError("Please enter a valid 10-digit contact number.");
      return;
    }

    try {
      setLoading(true);
      await loadRazorpayScript();

      const options = {
        key: RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "MANN CARE FOUNDATION",
        description: `Donation${project ? " for " + project : ""}`,
        image: img("/logo.png"),
        handler: (response) => {
          const params = new URLSearchParams({
            amount: String(amount),
            project: project || "General",
            payment_id: response.razorpay_payment_id,
          });
          navigate(`/payment-success?${params.toString()}`);
        },
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          contact,
        },
        notes: { project: project || "General" },
        theme: { color: "#b50061" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError("Payment failed: " + (response.error?.description || "Please try again."));
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="py-section-padding-mobile md:py-section-padding-desktop px-6 lg:px-8 bg-surface" id="donate">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden bg-white shadow-[0_30px_60px_-15px_rgba(138,0,72,0.2)]">
          {/* Left */}
          <div className="bg-primary text-white p-8 md:p-16 flex flex-col justify-between">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/15 text-white font-label-bold text-xs uppercase tracking-[0.2em] rounded-full mb-6">
                Make a Difference
              </span>
              <h2 className="font-display-lg font-extrabold text-4xl md:text-6xl leading-[0.9] tracking-tighter uppercase mb-6">
                {heading || "Join Hands With MANN CARE FOUNDATION"}
              </h2>
              <p className="text-xl text-white/90 mb-6">
                {subheading || "Become a reason someone lives with dignity, health, and hope. Every donation — big or small — creates a ripple of change that transforms lives."}
              </p>
            </div>
            <div className="space-y-4 text-lg font-medium">
              <p className="flex items-center gap-4">
                <Icon name="verified" />100% Transparent
              </p>
              <p className="flex items-center gap-4">
                <Icon name="receipt_long" />Tax Benefits Available
              </p>
              <p className="flex items-center gap-4">
                <Icon name="public" />Nationwide Impact
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white p-8 md:p-16">
            <h3 className="font-display-lg font-extrabold text-3xl md:text-4xl uppercase text-on-surface tracking-tight mb-6">
              Choose Your Contribution
            </h3>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setSelected(a); setCustom(""); }}
                  className={`rounded-xl py-4 font-bold transition ${
                    selected === a && !custom
                      ? "bg-primary text-white shadow-[0_10px_20px_-5px_rgba(138,0,72,0.4)]"
                      : "bg-surface-container-low text-primary hover:bg-primary-fixed"
                  }`}
                >
                  ₹{Number(a).toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter custom amount (₹)"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setSelected("");
              }}
              className={`${inputCls} mb-6`}
            />

            <label className="block font-label-bold text-xs uppercase tracking-[0.2em] text-primary mb-2">
              Choose Project (optional)
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={`${inputCls} mb-6`}
            >
              <option value="">-- All Projects --</option>
              {PROJECT_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Contact Number *"
              maxLength={10}
              value={contact}
              onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
              className={`${inputCls} mb-6`}
              required
            />

            {error && <p className="text-base text-error mb-4">{error}</p>}

            <button
              type="button"
              onClick={handleDonate}
              disabled={loading}
              className="w-full rounded-2xl bg-primary text-white py-6 font-label-bold text-xl uppercase tracking-widest transition-all hover:bg-primary-container hover:scale-[1.01] disabled:opacity-60 shadow-[0_10px_30px_-5px_rgba(138,0,72,0.4)]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-3">
                  <Icon name="progress_activity" className="animate-spin" />
                  Please wait...
                </span>
              ) : (
                <span className="inline-flex items-center gap-3">
                  <Icon name="favorite" />
                  Donate Now
                </span>
              )}
            </button>
            <p className="text-center text-sm text-on-surface-variant mt-4">
              Secured payment. Your trust is our priority.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import SuccessModal from "../../components/Common/SuccessModal";
import { validatePersonForm, hasErrors } from "../../utils/validation";

const RAZORPAY_LIVE_KEY = "rzp_live_T1vEMMkRqw3jrw";

const causeIcons = {
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  women: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M9 22v-4l-3-3 1-4" />
      <path d="M15 22v-4l3-3-1-4" />
      <path d="M12 11v5" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  oldage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ashra: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

const causes = [
  {
    id: "education",
    label: "Education",
    icon: causeIcons.education,
    color: "#4059aa",
    title: "Support Education for Every Child",
    description:
      "Your donation helps provide quality education, school supplies, and learning opportunities to underprivileged children. Every child deserves access to knowledge and the chance to build a brighter future.",
    impact: [
      { emoji: "📚", text: "School supplies for 10 children" },
      { emoji: "🎒", text: "Backpacks & learning materials" },
      { emoji: "🏫", text: "Support after-school programs" },
    ],
    stats: { label: "Children Educated", value: "500+" },
  },
  {
    id: "women",
    label: "Women Empowerment",
    icon: causeIcons.women,
    color: "#e8485b",
    title: "Empower Women, Transform Lives",
    description:
      "Help us empower women with skills training, livelihood opportunities, and confidence to lead independent and dignified lives. Your support creates ripples of change that transform entire communities.",
    impact: [
      { emoji: "💼", text: "Vocational skills training" },
      { emoji: "💪", text: "Financial independence workshops" },
      { emoji: "🌟", text: "Leadership & confidence building" },
    ],
    stats: { label: "Women Empowered", value: "300+" },
  },
  {
    id: "food",
    label: "Food Kit",
    icon: causeIcons.food,
    color: "#f59e0b",
    title: "Fight Hunger, Provide Nourishment",
    description:
      "Your contribution provides nutritious food kits to families struggling with hunger and food insecurity. No one should sleep hungry — together we can ensure every family has a meal.",
    impact: [
      { emoji: "🍚", text: "Rice, dal & staple food supplies" },
      { emoji: "🥛", text: "Milk & nutrition for children" },
      { emoji: "📦", text: "Monthly food kit distribution" },
    ],
    stats: { label: "Families Fed", value: "1000+" },
  },
  {
    id: "medical",
    label: "Medical",
    icon: causeIcons.medical,
    color: "#10b981",
    title: "Save Lives with Critical Medical Care",
    description:
      "Support life-saving surgeries, medical treatments, and healthcare access for children and individuals who cannot afford care. Every heartbeat counts — your donation can save a life.",
    impact: [
      { emoji: "🏥", text: "Life-saving surgeries" },
      { emoji: "💊", text: "Essential medicines & treatments" },
      { emoji: "❤️", text: "Critical care for children" },
    ],
    stats: { label: "Lives Saved", value: "200+" },
  },
  {
    id: "oldage",
    label: "Old Age Home (Sahara)",
    icon: causeIcons.oldage,
    color: "#8b5cf6",
    title: "Give Dignity to Our Elders",
    description:
      "Your donation helps provide care, companionship, food, and medical support to elderly individuals in old-age homes. Help us ensure our seniors live their golden years with dignity and respect.",
    impact: [
      { emoji: "🏠", text: "Shelter & safe accommodation" },
      { emoji: "🍲", text: "Nutritious meals daily" },
      { emoji: "🎂", text: "Celebrations & companionship" },
    ],
    stats: { label: "Elders Cared For", value: "150+" },
  },
  {
    id: "ashra",
    label: "Project Ashra",
    icon: causeIcons.ashra,
    color: "#06b6d4",
    title: "Empower a Child Through Education",
    description:
      "Your donation supports Project Ashra — a haven of free education for underprivileged children. We provide shelter, school supplies, and a nurturing environment where every child gets the chance to learn, grow, and dream of a brighter future.",
    impact: [
      { emoji: "📖", text: "Free education for orphaned children" },
      { emoji: "🎒", text: "School bags & stationery supplies" },
      { emoji: "🏡", text: "Safe shelter & nurturing care" },
    ],
    stats: { label: "Children Supported", value: "200+" },
  },
];

const amounts = [
  { value: 500, label: "₹500", desc: "Provides meals for a week" },
  { value: 1000, label: "₹1,000", desc: "School supplies for a child" },
  { value: 2000, label: "₹2,000", desc: "Medical checkup for 5 kids" },
  { value: 5000, label: "₹5,000", desc: "Food kit for 10 families" },
];

export default function Donate() {
  const [activeTab, setActiveTab] = useState(causes[0].id);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredCause, setHoveredCause] = useState(null);
  const [processing, setProcessing] = useState(false);

  const cause = causes.find((c) => c.id === activeTab);

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const resetDonation = () => {
    setShowSuccess(false);
    setSelectedAmount(null);
    setCustomAmount("");
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  const getAmount = () => {
    if (customAmount) return parseInt(customAmount, 10);
    if (selectedAmount) return selectedAmount;
    return 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (processing) return;
    const amount = getAmount();
    const nextErrors = validatePersonForm(form);
    if (!amount || amount < 1) {
      nextErrors.amount = "Please select or enter a donation amount.";
    }
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      document.querySelector(".donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        return;
      }

      const options = {
        key: RAZORPAY_LIVE_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Ashray for Life Foundation",
        description: `Donation for ${cause.label}`,
        image: "/images/Ashray Foundation logo.png",
        prefill: {
          name: form.name || "Donor",
          email: form.email || "donor@example.com",
          contact: form.phone || "9999999999",
        },
        notes: {
          cause: cause.label,
          message: form.message || "",
        },
        theme: { color: "#4059aa" },
        handler: function () {
          setShowSuccess(true);
        },
        modal: {
          ondismiss: function () {},
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-on-primary-fixed-variant to-primary" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop py-24 md:py-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              volunteer_activism
            </span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Give Back</span>
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Donate</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Your generosity helps us create lasting change in the lives of those who need it most.
          </p>
        </div>
      </section>

      {/* ===== DONATE MAIN ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop" data-reveal>
          {/* ===== TABS ===== */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-12">
            {causes.map((c) => (
              <button
                key={c.id}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-label-md font-bold border transition-all whitespace-nowrap ${
                  activeTab === c.id
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-white border border-outline text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
                onClick={() => setActiveTab(c.id)}
                onMouseEnter={() => setHoveredCause(c.id)}
                onMouseLeave={() => setHoveredCause(null)}
              >
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* ===== CONTENT ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ===== INFO PANEL ===== */}
            <div className="lg:col-span-7">
              <div className="flex items-start gap-5 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ background: cause.color }}
                >
                  <span className="w-7 h-7 flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7">{cause.icon}</span>
                </div>
                <div>
                  <span
                    className="inline-block font-label-sm text-white font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3"
                    style={{ background: cause.color }}
                  >
                    Support This Cause
                  </span>
                  <h2 className="font-headline-lg text-primary">{cause.title}</h2>
                </div>
              </div>

              <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed">{cause.description}</p>

              <div className="bg-surface-container-high rounded-2xl border border-outline-variant p-6 mb-6">
                <h4 className="font-label-md text-on-surface font-bold mb-4">Your donation will help:</h4>
                <ul>
                  {cause.impact.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 py-3 border-b border-outline-variant last:border-b-0">
                      <span className="text-2xl w-8 text-center flex-shrink-0">{item.emoji}</span>
                      <span className="font-body-md text-on-surface">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-container-high rounded-2xl border border-outline-variant p-8 text-center">
                <span className="font-headline-lg text-primary block">{cause.stats.value}</span>
                <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-2 block">
                  {cause.stats.label}
                </span>
              </div>
            </div>

            {/* ===== FORM ===== */}
            <form className="donate-form lg:col-span-5 bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8" onSubmit={handlePayment}>
              <h3 className="font-headline-md text-primary mb-6">Choose Your Amount</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {amounts.map((amt) => (
                  <button
                    key={amt.value}
                    type="button"
                    className={`flex flex-col items-start gap-1 px-5 py-4 rounded-2xl border font-label-md transition-all ${
                      selectedAmount === amt.value
                        ? "bg-primary border-primary text-white shadow-lg"
                        : "bg-white border-outline text-on-surface-variant hover:border-primary"
                    }`}
                    onClick={() => handleAmountClick(amt.value)}
                  >
                    <span className="font-headline-md font-bold">{amt.label}</span>
                    <span className="font-label-sm opacity-80">{amt.desc}</span>
                  </button>
                ))}
                <div className="flex flex-col items-start gap-1 px-5 py-4 rounded-2xl border border-outline bg-white text-on-surface-variant">
                    <span className="font-label-md font-bold">Custom</span>
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-headline-md font-bold text-on-surface">₹</span>
                      <input
                        id="custom-amount"
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        aria-label="Custom donation amount in rupees"
                        value={customAmount}
                        onChange={handleCustomChange}
                        className="w-full bg-white border border-outline rounded-xl px-4 py-2 font-body-md font-bold text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                </div>
              </div>

              {errors.amount && <p className="form-error mb-6">⚠ {errors.amount}</p>}

              <h3 className="font-headline-md text-primary mb-6">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="name" className="font-label-md text-primary mb-2 block font-bold">Full Name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleFormChange} className={`w-full bg-white border ${errors.name ? "border-[#e8485b] focus:border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`} aria-invalid={!!errors.name} />
                  {errors.name && <p className="form-error">⚠ {errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="font-label-md text-primary mb-2 block font-bold">Email Address</label>
                  <input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleFormChange} className={`w-full bg-white border ${errors.email ? "border-[#e8485b] focus:border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`} aria-invalid={!!errors.email} />
                  {errors.email && <p className="form-error">⚠ {errors.email}</p>}
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="phone" className="font-label-md text-primary mb-2 block font-bold">Phone Number</label>
                <input id="phone" name="phone" type="tel" placeholder="+91 99999 99999" value={form.phone} onChange={handleFormChange} className={`w-full bg-white border ${errors.phone ? "border-[#e8485b] focus:border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="form-error">⚠ {errors.phone}</p>}
              </div>
              <div className="mb-8">
                <label htmlFor="message" className="font-label-md text-primary mb-2 block font-bold">Message (Optional)</label>
                <textarea id="message" name="message" rows="3" placeholder="Write a message..." value={form.message} onChange={handleFormChange} className="w-full bg-white border border-outline rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"></textarea>
              </div>

              <button type="submit" className="w-full bg-secondary-container text-on-secondary-container px-10 py-5 rounded-full font-label-md font-bold shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={!getAmount() || getAmount() < 1}>
                {getAmount() ? <>Donate ₹{getAmount().toLocaleString()}</> : "Select an Amount"}
              </button>

              <p className="flex items-center justify-center gap-2 text-on-surface-variant font-label-sm mt-6">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure payment via Razorpay
              </p>
            </form>
          </div>
        </div>
      </section>

      <SuccessModal
        open={showSuccess}
        onClose={resetDonation}
        title="Thank You for Your Donation!"
        message="Your support helps us continue our mission. A confirmation email will be sent to you shortly."
        actionLabel="Make Another Donation"
        onAction={resetDonation}
      />
    </div>
  );
}

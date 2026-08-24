import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SuccessModal from "../../components/Common/SuccessModal";
import { validatePersonForm, hasErrors } from "../../utils/validation";

const opportunities = [
  {
    title: "Field Volunteer",
    location: "Mumbai, Gujarat",
    type: "Part-time",
    desc: "Work directly with communities on education, hunger relief, and water conservation projects. Help distribute supplies and organize on-ground activities.",
  },
  {
    title: "Administrative Support",
    location: "Remote / Mumbai",
    type: "Flexible",
    desc: "Assist with documentation, data entry, coordination, and day-to-day operations. Help keep our foundation running smoothly.",
  },
  {
    title: "Digital & Social Media",
    location: "Remote",
    type: "Flexible",
    desc: "Manage our social media presence, create content, design graphics, and help spread awareness about our projects and initiatives.",
  },
  {
    title: "Fundraising & Events",
    location: "Mumbai",
    type: "Project-based",
    desc: "Organize fundraising events, reach out to potential donors, and help us build partnerships with corporates and individuals.",
  },
  {
    title: "Teaching & Mentoring",
    location: "Mumbai",
    type: "Part-time",
    desc: "Conduct classes, mentor children under Project VIDHYALAY, and help with skill development programs for women under Nari Tarang.",
  },
  {
    title: "Medical Outreach",
    location: "Mumbai, Thane",
    type: "On-call",
    desc: "Assist with medical camps, health awareness drives, and support Project LIFE-LINE in reaching patients who need critical care.",
  },
];

const benefits = [
  { icon: "badge", title: "Certificate of Service", desc: "Receive a recognized certificate for your contribution and hours served." },
  { icon: "groups", title: "Community Impact", desc: "Be part of a passionate team making real, measurable change in society." },
  { icon: "school", title: "Skill Development", desc: "Gain hands-on experience in social work, project management, and community outreach." },
  { icon: "diversity_3", title: "Networking", desc: "Connect with like-minded individuals, corporates, and industry professionals." },
  { icon: "favorite", title: "Personal Fulfillment", desc: "Experience the joy of giving back and making a difference in someone's life." },
  { icon: "trending_up", title: "Growth Opportunities", desc: "Outstanding volunteers get opportunities for leadership roles and paid positions." },
];

export default function Volunteer() {
  const sectionRefs = useRef([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validatePersonForm(form);
    if (!form.interest) nextErrors.interest = "Please select an area of interest.";
    if (!form.reason || !form.reason.trim()) {
      nextErrors.reason = "Please tell us why you'd like to volunteer.";
    }
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setForm({ name: "", email: "", phone: "", interest: "", reason: "" });
    setErrors({});
  };

  return (
    <main className="bg-background text-on-surface font-body-md">
      {/* ===== HERO ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-on-primary-fixed-variant to-primary" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop py-24 md:py-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary-container font-label-sm uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              groups
            </span>
            GET INVOLVED
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">
            Volunteer With Us,<br />Be the Change
          </h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            Join our mission to create a Just, Equitable and Humane Society. Your time and skills can transform lives.
          </p>
        </div>
      </section>

      {/* ===== WHY VOLUNTEER ===== */}
      <section className="py-20 md:py-28 bg-white" ref={(el) => (sectionRefs.current[3] = el)}>
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16 items-center" data-reveal>
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="font-label-md text-primary uppercase tracking-[0.2em]">Why Volunteer</span>
            </div>
            <h2 className="font-headline-lg text-primary mb-6">Make a Difference</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              At <strong className="text-primary">Ashray for Life Foundation (AFLF)</strong>, we believe that change starts with
              people like you. Whether you have a few hours a week or a few days a month, your contribution
              can create ripples of impact across our seven key sectors.
            </p>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              From teaching children and feeding the hungry to providing medical aid and caring for the
              elderly — every volunteer plays a vital role in our mission. Join us and be part of something
              bigger than yourself.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src="images/BUTTER.jpg"
              alt="Volunteers working together"
              className="rounded-3xl border border-outline-variant subtle-shadow w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20 md:py-28 bg-background" ref={(el) => (sectionRefs.current[4] = el)}>
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop" data-reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-primary mb-4">Benefits of Volunteering</h2>
            <p className="font-body-lg text-on-surface-variant">
              When you give your time, you gain so much more in return
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow hover:-translate-y-1 transition-all p-8"
              >
                <div className="bg-primary text-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <span className="material-symbols-outlined text-3xl">{b.icon}</span>
                </div>
                <h3 className="font-headline-md text-xl text-primary mb-3">{b.title}</h3>
                <p className="font-body-md text-on-surface-variant">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPPORTUNITIES ===== */}
      <section className="py-20 md:py-28 bg-white" ref={(el) => (sectionRefs.current[5] = el)}>
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop" data-reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-1 bg-primary rounded-full" />
            <span className="font-label-md text-primary uppercase tracking-[0.2em]">Open Positions</span>
          </div>
          <h2 className="font-headline-lg text-primary mb-4">Current Opportunities</h2>
          <p className="font-body-lg text-on-surface-variant mb-16">
            Find a role that matches your skills and interests
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {opportunities.map((opp, i) => (
              <div
                key={i}
                className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow hover:-translate-y-1 transition-all p-8 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-headline-md text-xl text-primary">{opp.title}</h3>
                  <span className="font-label-sm text-on-primary-fixed-variant bg-primary-fixed px-4 py-2 rounded-full uppercase tracking-widest shrink-0">
                    {opp.type}
                  </span>
                </div>
                <p className="font-label-md text-on-surface-variant flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  {opp.location}
                </p>
                <p className="font-body-md text-on-surface-variant">{opp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPLICATION FORM ===== */}
      <section className="py-20 md:py-28 bg-background" ref={(el) => (sectionRefs.current[6] = el)}>
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop" data-reveal>
          <div className="max-w-3xl mx-auto bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="font-label-md text-primary uppercase tracking-[0.2em]">Apply Now</span>
            </div>
            <h2 className="font-headline-lg text-primary mb-4">Ready to Join?</h2>
            <p className="font-body-lg text-on-surface-variant mb-10">
              Fill out the form below and our team will get in touch with you.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="font-label-md text-primary mb-2 block font-bold">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    autoComplete="name"
                    className={`w-full bg-white border ${errors.name ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="form-error" role="alert">⚠ {errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="font-label-md text-primary mb-2 block font-bold">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    autoComplete="email"
                    className={`w-full bg-white border ${errors.email ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="form-error" role="alert">⚠ {errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="font-label-md text-primary mb-2 block font-bold">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleFormChange}
                    autoComplete="tel"
                    className={`w-full bg-white border ${errors.phone ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="form-error" role="alert">⚠ {errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="interest" className="font-label-md text-primary mb-2 block font-bold">Area of Interest *</label>
                  <select
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-white border ${errors.interest ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.interest}
                    aria-describedby={errors.interest ? "interest-error" : undefined}
                  >
                    <option value="">Select an opportunity</option>
                    {opportunities.map((opp, i) => (
                      <option key={i} value={opp.title}>{opp.title}</option>
                    ))}
                  </select>
                  {errors.interest && <p id="interest-error" className="form-error" role="alert">⚠ {errors.interest}</p>}
                </div>
              </div>
                <div className="mb-8">
                  <label htmlFor="reason" className="font-label-md text-primary mb-2 block font-bold">
                    Why do you want to volunteer with AFLF? *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    name="reason"
                    placeholder="Tell us about yourself and why you'd like to join us..."
                    value={form.reason}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-white border ${errors.reason ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.reason}
                    aria-describedby={errors.reason ? "reason-error" : undefined}
                  ></textarea>
                  {errors.reason && <p id="reason-error" className="form-error" role="alert">⚠ {errors.reason}</p>}
                </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-label-md font-bold shadow-xl hover:bg-on-primary-fixed-variant hover:-translate-y-0.5 transition-all"
              >
                Submit Application
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>

            <SuccessModal
              open={showSuccess}
              onClose={resetForm}
              title="Application Received!"
              message="We have received your application. Our team will reach out to you soon."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-20 md:pb-28 bg-background">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="relative bg-primary rounded-3xl px-6 py-16 md:px-20 md:py-20 text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container opacity-15 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-secondary-fixed opacity-10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-headline-lg text-white mb-4">Have Questions?</h2>
              <p className="font-body-lg text-white/85 max-w-2xl mx-auto mb-10">
                Reach out to us and we will be happy to help you find the right volunteer opportunity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/ContactUs"
                  className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-label-md font-bold shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Contact Us
                </Link>
                <Link
                  to="/donate"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-10 py-4 rounded-full font-label-md font-bold hover:bg-white hover:text-primary transition-all"
                >
                  Support Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import SuccessModal from "../../components/Common/SuccessModal";
import { validatePersonForm, hasErrors } from "../../utils/validation";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validatePersonForm(form);
    if (!form.subject || !form.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
    }
    if (!form.message || !form.message.trim()) {
      nextErrors.message = "Please write a message.";
    }
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setForm({ name: "", email: "", subject: "", message: "" });
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
              mail
            </span>
            Get In Touch
          </div>
          <h1 className="font-headline-xl text-white mt-8 mb-6">Contact Us</h1>
          <p className="font-body-lg text-white/85 max-w-2xl">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* ===== MAIN ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* ===== INFO ===== */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 flex items-start gap-6">
              <div className="bg-primary text-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-primary mb-2">Address</h3>
                <p className="font-body-md text-on-surface-variant">
                  Unit - 218, 2nd Floor, Auris Galleria,<br />
                  New Link Road, Auris Serenity,<br />
                  Malad (West), Mumbai - 400064.
                </p>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 flex items-start gap-6">
              <div className="bg-primary text-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-primary mb-2">Phone</h3>
                <a
                  href="tel:+919930028300"
                  className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  +91 99300 28300
                </a>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 flex items-start gap-6">
              <div className="bg-primary text-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-primary mb-2">Email</h3>
                <a
                  href="mailto:ashrayforlifefoundation@gmail.com"
                  className="font-body-md text-on-surface-variant hover:text-primary transition-colors break-all"
                >
                  ashrayforlifefoundation@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 flex items-start gap-6">
              <div className="bg-primary text-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-primary mb-2">Bank Details</h3>
                <p className="font-body-md text-on-surface-variant">
                  <strong className="text-primary">Account Name:</strong> Ashray For Life Foundation<br />
                  <strong className="text-primary">Bank:</strong> Axis Bank (Malad-West)<br />
                  <strong className="text-primary">Account No:</strong> 923010009459428<br />
                  <strong className="text-primary">IFSC:</strong> UTIB0004707
                </p>
              </div>
            </div>
          </div>

          {/* ===== FORM ===== */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container rounded-3xl border border-outline-variant subtle-shadow p-8 md:p-12">
              <form onSubmit={handleSubmit}>
                <h2 className="font-headline-lg text-primary mb-8">Send Us a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="font-label-md text-primary mb-2 block font-bold">
                      Full Name
                    </label>
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
                    <label htmlFor="email" className="font-label-md text-primary mb-2 block font-bold">
                      Email Address
                    </label>
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
                <div className="mb-6">
                  <label htmlFor="subject" className="font-label-md text-primary mb-2 block font-bold">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleFormChange}
                    required
                    autoComplete="off"
                    className={`w-full bg-white border ${errors.subject ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && <p id="subject-error" className="form-error" role="alert">⚠ {errors.subject}</p>}
                </div>
                <div className="mb-8">
                  <label htmlFor="message" className="font-label-md text-primary mb-2 block font-bold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={handleFormChange}
                    required
                    className={`w-full bg-white border ${errors.message ? "border-[#e8485b]" : "border-outline"} rounded-xl px-5 py-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  ></textarea>
                  {errors.message && <p id="message-error" className="form-error" role="alert">⚠ {errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-label-md font-bold shadow-xl hover:bg-on-primary-fixed-variant hover:-translate-y-0.5 transition-all"
                >
                  Send Message
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <SuccessModal
                open={showSuccess}
                onClose={resetForm}
                title="Message Sent!"
                message="Your message has been sent successfully. We'll get back to you shortly."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

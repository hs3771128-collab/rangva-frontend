import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaMapMarkedAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-ink";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Saare fields bharein");
      return;
    }
    toast.success("Message bhej diya — hum 24 ghante me jawab denge");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="rangva-container px-4 lg:px-6 py-10">
      <div className="max-w-2xl mx-auto text-center mb-9">
        <div className="text-[10px] tracking-[0.26em] uppercase text-terra mb-3">Help &amp; support</div>
        <h1 className="font-display text-[32px] sm:text-[42px] leading-none text-ink">Contact us</h1>
        <p className="text-[13px] text-muted mt-3">
          Order, size, delivery ya return — koi bhi sawaal ho, hum yahan hain.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6 max-w-4xl mx-auto">
        {/* Info */}
        <div className="space-y-3">
          <div className="bg-white border border-line rounded-2xl p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f7e6e1] text-terra grid place-items-center shrink-0">
              <FaPhoneAlt size={13} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-muted">Phone</div>
              <div className="text-[13px] font-semibold text-ink mt-0.5">+92 300 0000000</div>
              <div className="text-[11px] text-muted">Mon–Sat, 10am – 7pm PKT</div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f7e6e1] text-terra grid place-items-center shrink-0">
              <FaEnvelope size={13} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-muted">Email</div>
              <div className="text-[13px] font-semibold text-ink mt-0.5">hello@rangva.pk</div>
              <div className="text-[11px] text-muted">24 ghante me reply</div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f7e6e1] text-terra grid place-items-center shrink-0">
              <FaMapMarkedAlt size={13} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-muted">Address</div>
              <div className="text-[13px] font-semibold text-ink mt-0.5">Karachi, Pakistan</div>
              <div className="text-[11px] text-muted">Online store — nationwide delivery</div>
            </div>
          </div>

          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 h-11 rounded-full bg-[#1f7a4d] text-white text-[11.5px] tracking-[0.14em] uppercase font-semibold hover:opacity-90 transition"
          >
            <FaWhatsapp size={15} /> Chat on WhatsApp
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="font-display text-[22px] text-ink mb-1">Send a message</h2>

          <div>
            <label className="text-[12px] font-semibold text-ink mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aap ka naam"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ink mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ink mb-1 block">Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Order number ya sawaal likh dein…"
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-ink resize-none"
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

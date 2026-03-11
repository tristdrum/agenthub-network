import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Check, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</p>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Get in touch</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          For product questions, check the{" "}
          <Link to={createPageUrl("Docs")} className="underline underline-offset-4 hover:text-foreground transition-colors">docs</Link>{" "}
          and{" "}
          <Link to={createPageUrl("Docs")} className="underline underline-offset-4 hover:text-foreground transition-colors">FAQ</Link>{" "}
          first. For everything else, use this form.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: MessageSquare, title: "Product questions", desc: "Check the docs and FAQ — most questions are answered there." },
            { icon: Mail, title: "Email", desc: "hello@agenthub.network" },
            { icon: MessageSquare, title: "Press", desc: "press@agenthub.network" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 border border-border rounded-xl bg-card">
              <Icon className="w-4 h-4 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold mb-0.5">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="text-center py-12 border border-border rounded-xl bg-card">
            <div className="w-10 h-10 rounded-full bg-green-muted flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5 text-green" />
            </div>
            <p className="font-semibold mb-1">Message sent</p>
            <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Message</label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={5}
                placeholder="Your message"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Send message
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
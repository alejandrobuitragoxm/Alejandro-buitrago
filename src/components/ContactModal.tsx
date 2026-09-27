import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2, MessageSquare, Instagram, Globe } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Commercial',
    role: 'Director',
    budget: '$15k - $40k',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      id="contact-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-[#0e0e12] border border-zinc-700/80 rounded-sm shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h3 className="font-syne font-bold text-base text-white uppercase tracking-wider">
              START A CONVERSATION // BOOKING & CONTACT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-syne font-bold text-2xl uppercase text-white mb-2">
              MESSAGE SENT
            </h4>
            <p className="text-zinc-400 text-xs font-mono-code max-w-md mb-6 leading-relaxed">
              Thanks for reaching out. We&apos;ll review the brief and treatment and get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-400 text-black font-semibold text-xs font-mono-code uppercase rounded-sm"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono-code text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Martin Soler"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                  EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                  AGENCY / BRAND
                </label>
                <input
                  type="text"
                  placeholder="Production company / Brand..."
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                  PROJECT TYPE
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Commercial">Commercial / Spot</option>
                  <option value="Music Video">Music Video</option>
                  <option value="Narrative">Short Film / Fiction</option>
                  <option value="Fashion">Fashion Film</option>
                  <option value="Documentary">Documentary</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                  ROLE NEEDED
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Director">Directing</option>
                  <option value="Creative Direction">Creative Direction</option>
                  <option value="Full Production">Full Production</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                PROJECT DETAILS, LOCATIONS OR TREATMENT LINK
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe the concept, estimated shoot dates, location, deliverables..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-sm focus:outline-none focus:border-amber-400 resize-y"
              />
            </div>

            {/* Direct Contact Links */}
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
              <div className="flex items-center gap-4">
                <a
                  href="mailto:alejandro.buitrago.xm@gmail.com"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>alejandro.buitrago.xm@gmail.com</span>
                </a>
                <a
                  href="https://www.instagram.com/a_buitrag0/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@a_buitrag0</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold uppercase rounded-sm flex items-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND BRIEF</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

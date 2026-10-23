"use client";

import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "reset_verify_signups";

type Signup = { email: string; ref: string | null; at: string };

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRef(new URLSearchParams(window.location.search).get("ref"));
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const existing: Signup[] = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    existing.push({ email, ref, at: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-body glass rounded-xl px-5 py-4" role="status">
        You are on the list. We will email you when you can run a check.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass flex flex-col gap-2 rounded-xl p-2 sm:flex-row"
    >
      <label htmlFor="email" className="sr-only">
        Work email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="text-body w-full flex-1 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-ink placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
      />
      <button
        type="submit"
        className="text-body cursor-pointer rounded-lg bg-accent px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none"
      >
        Send me the link when I can run a check
      </button>
    </form>
  );
}

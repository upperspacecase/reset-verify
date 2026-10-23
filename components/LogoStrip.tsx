const LOGOS = [
  "Microsoft 365",
  "Entra ID",
  "Okta",
  "Stripe Identity",
  "HaloPSA",
  "Freshservice",
  "Jira Service Management",
];

export function LogoStrip() {
  return (
    <section className="mt-16 w-full text-center sm:mt-20" aria-label="Compatible tools">
      <p className="text-body text-slate-600">
        Paste the link into any ticket. Works next to the tools you already run.
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
        {LOGOS.map((name) => (
          <li
            key={name}
            className="text-body font-semibold uppercase tracking-wide text-slate-400"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

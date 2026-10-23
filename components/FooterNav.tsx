const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
];

export function FooterNav() {
  return (
    <footer className="mt-20 w-full border-t border-slate-200 pt-8">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-body cursor-pointer rounded text-slate-600 transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 motion-reduce:transition-none"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}

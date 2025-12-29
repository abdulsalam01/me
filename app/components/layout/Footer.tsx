import Container from "./Container";

const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-black/20">
            <Container>
                <div className="py-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-white/90 font-semibold tracking-wide">
                                Portfolio
                            </div>
                            <p className="mt-2 text-sm text-white/60">
                                Built with Next.js + Tailwind. Galaxy vibes, zero bloat.
                            </p>
                        </div>

                        <nav className="flex flex-wrap gap-2">
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className="rounded-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-white/45">
                            © {year} Your Name. All rights reserved.
                        </p>
                        <div className="flex gap-3 text-xs">
                            <a
                                className="text-white/55 hover:text-white transition"
                                href="https://github.com/your-username"
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>
                            <span className="text-white/20">•</span>
                            <a
                                className="text-white/55 hover:text-white transition"
                                href="https://linkedin.com/in/your-handle"
                                target="_blank"
                                rel="noreferrer"
                            >
                                LinkedIn
                            </a>
                            <span className="text-white/20">•</span>
                            <a
                                className="text-white/55 hover:text-white transition"
                                href="mailto:you@email.com"
                            >
                                Email
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

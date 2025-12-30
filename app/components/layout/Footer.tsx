"use client";

import Container from "./Container";

const NAV = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#contact", label: "Contact" },
];

const SOCIAL = [
    { href: "https://github.com/abdulsalam01", label: "GitHub" },
    { href: "https://www.linkedin.com/in/abdulsalam-01", label: "LinkedIn" },
    { href: "mailto:abdulsalam121196@gmail.com", label: "Email" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-black">
            {/* background layers (dark + subtle nebula) */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 footer-nebula" />
                <div className="absolute inset-0 footer-vignette" />
                <div className="absolute inset-0 footer-stars" />
            </div>

            <Container>
                <div className="relative py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                        {/* left */}
                        <div>
                            <div className="inline-flex items-center gap-3">
                                <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/12 bg-white/6">
                                    {/* subtle orbit glow */}
                                    <span className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_25%,rgba(120,90,255,0.25),transparent_55%)]" />

                                    {/* image */}
                                    <img
                                        src="/me/images/profile.jpeg"
                                        alt="Abdul Salam"
                                        className="relative z-10 h-full w-full object-cover rounded-full"
                                    />

                                    {/* hover aura */}
                                    <span className="pointer-events-none absolute -inset-4 opacity-0 blur-xl transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_60%)]" />
                                </span>

                                <div>
                                    <div className="text-sm font-semibold text-white/90">
                                        ABDUL SALAM
                                    </div>
                                    <div className="text-xs text-white/55">
                                        Built with Next.js + Tailwind. Galaxy vibes, zero bloat.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/14 to-transparent" />

                            <div className="mt-5 text-xs text-white/50">
                                © {year} Abdul Salam. All rights reserved.
                            </div>
                        </div>

                        {/* right */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:justify-end">
                            <div>
                                <div className="text-xs font-semibold tracking-widest text-white/60">
                                    NAV
                                </div>
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                                    {NAV.map((n) => (
                                        <a
                                            key={n.href}
                                            href={n.href}
                                            className="text-sm font-semibold text-white/70 hover:text-white transition
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                                        >
                                            {n.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="sm:text-right">
                                <div className="text-xs font-semibold tracking-widest text-white/60">
                                    LINKS
                                </div>
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
                                    {SOCIAL.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target={s.href.startsWith("http") ? "_blank" : undefined}
                                            rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                                            className="text-sm font-semibold text-white/70 hover:text-white transition
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                                        >
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* bottom subtle glow line */}
                    <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
            </Container>
        </footer>
    );
}

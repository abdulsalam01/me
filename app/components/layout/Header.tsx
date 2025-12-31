"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#contact", label: "Contact" },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<string>("#home");

    // ✅ avoid re-renders on every observer callback
    const activeRef = useRef(active);
    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    // ✅ 1) scroll: throttle via rAF, update only when value changes
    useEffect(() => {
        let raf: number | null = null;
        let last = false;

        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                const next = window.scrollY > 8;
                if (next !== last) {
                    last = next;
                    setScrolled(next);
                }
            });
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    // ✅ 2) key handler
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // ✅ 3) body lock only when open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // ✅ 4) Active section: cheaper thresholds + only set when changed
    useEffect(() => {
        const ids = NAV.map((n) => n.href.slice(1));
        const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                // pick first intersecting (good enough, avoids sorting cost)
                const hit = entries.find((e) => e.isIntersecting);
                const id = hit?.target && (hit.target as HTMLElement).id;
                if (!id) return;

                const next = `#${id}`;
                if (next !== activeRef.current) {
                    activeRef.current = next;
                    setActive(next);
                }
            },
            { threshold: 0.35 }
        );

        els.forEach((e) => obs.observe(e));
        return () => obs.disconnect();
    }, []);

    // ✅ keep classes stable: no useMemo needed
    const shell = scrolled
        ? "fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md"
        : "fixed top-0 z-50 w-full border-b border-white/5 bg-black/90";

    const close = () => setOpen(false);

    return (
        <header className={shell}>
            {/* ✅ lean header: remove dust/glow layers (big paint cost). keep one subtle gradient only */}
            {scrolled && (
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_10%,rgba(120,90,255,0.12),transparent_55%)]" />
                </div>
            )}

            <Container>
                <div className="relative flex h-16 items-center justify-between">
                    {/* BRAND */}
                    <a
                        href="#home"
                        className="group inline-flex items-center gap-3 rounded-full px-2 py-1 text-white/90 hover:text-white
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                        <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/12 bg-black/40">
                            <img
                                src="/me/images/profile.jpeg"
                                alt="Abdul Salam"
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                            {/* ✅ no blur glow (expensive). just a thin ring on hover */}
                            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/0 transition group-hover:ring-white/15" />
                        </span>

                        <div className="leading-tight">
                            <div className="text-sm font-semibold tracking-wide">ABDUL SALAM</div>
                            <div className="text-[11px] text-white/60">Constellation Portfolio</div>
                        </div>
                    </a>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-3">
                        <div
                            className={[
                                "relative rounded-full border px-2 py-1",
                                scrolled ? "border-white/12 bg-white/6" : "border-white/10 bg-black/20",
                            ].join(" ")}
                        >
                            <div className="relative flex items-center gap-1">
                                {NAV.map((item) => {
                                    const isActive = active === item.href;

                                    // ✅ remove blur aurora + constellation lines (paint-heavy)
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                                                "text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                                                isActive ? "text-white" : "",
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "h-2 w-2 rounded-full border transition",
                                                    isActive
                                                        ? "bg-white/85 border-white/70"
                                                        : "bg-white/10 border-white/20 group-hover:bg-white/25 group-hover:border-white/30",
                                                ].join(" ")}
                                                aria-hidden="true"
                                            />
                                            <span>{item.label}</span>

                                            {/* ✅ cheap active underline */}
                                            {isActive && (
                                                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px bg-white/35" />
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA */}
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white
                border border-white/12 bg-white/8 transition hover:bg-white/12 hover:border-white/18
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* MOBILE button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            type="button"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full
                bg-white/8 border border-white/10 text-white/90 hover:bg-white/12 transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            <div className="relative h-4 w-5">
                                <span
                                    className={[
                                        "absolute left-0 top-0 h-0.5 w-5 rounded bg-white/85 transition duration-200",
                                        open ? "translate-y-1.5 rotate-45" : "",
                                    ].join(" ")}
                                />
                                <span
                                    className={[
                                        "absolute left-0 top-1.5 h-0.5 w-5 rounded bg-white/85 transition duration-200",
                                        open ? "opacity-0" : "opacity-100",
                                    ].join(" ")}
                                />
                                <span
                                    className={[
                                        "absolute left-0 top-3 h-0.5 w-5 rounded bg-white/85 transition duration-200",
                                        open ? "-translate-y-1.5 -rotate-45" : "",
                                    ].join(" ")}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </Container>

            {/* MOBILE MENU (lean): remove starmap bg + heavy blur) */}
            <div
                className={[
                    "md:hidden fixed inset-0 z-50",
                    open ? "pointer-events-auto" : "pointer-events-none",
                ].join(" ")}
                aria-hidden={!open}
            >
                <button
                    onClick={close}
                    className={[
                        "absolute inset-0 w-full h-full transition-opacity duration-200",
                        open ? "opacity-100 bg-black/60" : "opacity-0",
                    ].join(" ")}
                    aria-label="Close menu backdrop"
                />

                <div
                    className={[
                        "absolute left-1/2 top-16 w-[min(92vw,520px)] -translate-x-1/2 transition duration-200",
                        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    ].join(" ")}
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/80 shadow-2xl">
                        <div className="relative p-4">
                            <div className="flex items-center justify-between px-2 py-1">
                                <div className="text-xs font-semibold tracking-widest text-white/60">MENU</div>
                                <div className="text-xs text-white/40">tap to jump</div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-3 p-2">
                                {NAV.map((item) => {
                                    const isActive = active === item.href;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            onClick={close}
                                            className={[
                                                "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                                isActive
                                                    ? "text-white border border-white/20 bg-white/10"
                                                    : "text-white/85 border border-white/12 bg-white/6 hover:bg-white/10",
                                            ].join(" ")}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="p-2 pt-0">
                                <a
                                    href="#contact"
                                    onClick={close}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white
                    border border-white/12 bg-white/10 hover:bg-white/14 transition"
                                >
                                    Contact Me
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

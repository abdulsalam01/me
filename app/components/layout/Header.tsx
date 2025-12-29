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

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<string>("#home");
    const [xy, setXy] = useState({ x: 0.5, y: 0.2 });
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Active section highlighter
    useEffect(() => {
        const ids = NAV.map((n) => n.href.replace("#", ""));
        const els = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
                if (!visible?.target?.id) return;
                setActive(`#${(visible.target as HTMLElement).id}`);
            },
            { root: null, threshold: [0.2, 0.35, 0.5, 0.7] }
        );

        els.forEach((e) => obs.observe(e));
        return () => obs.disconnect();
    }, []);

    // Parallax glow based on pointer position
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
                const w = window.innerWidth || 1;
                const h = window.innerHeight || 1;
                setXy({ x: clamp(e.clientX / w, 0, 1), y: clamp(e.clientY / h, 0, 1) });
            });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const shell = useMemo(() => {
        return [
            "fixed top-0 z-50 w-full transition duration-300",
            scrolled
                ? "bg-black/45 backdrop-blur-xl border-b border-white/12"
                : "bg-black/20 backdrop-blur-md border-b border-white/8",
        ].join(" ");
    }, [scrolled]);

    const glowStyle = useMemo(
        () =>
            ({
                // used by CSS vars below
                ["--gx" as any]: `${Math.round(xy.x * 100)}%`,
                ["--gy" as any]: `${Math.round(xy.y * 100)}%`,
            }) as React.CSSProperties,
        [xy]
    );

    const close = () => setOpen(false);

    return (
        <header className={shell} style={glowStyle}>
            {/* glow + star dust layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 header-glow" />
                <div className="absolute inset-0 header-dust" />
            </div>

            <Container>
                <div className="relative flex h-16 items-center justify-between">
                    {/* BRAND: “planet core” */}
                    <a
                        href="#home"
                        className="group inline-flex items-center gap-3 rounded-full px-2 py-1 text-white/90 hover:text-white transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/12 bg-white/6">
                            <span className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)]" />
                            <span className="absolute inset-0 opacity-70 bg-[conic-gradient(from_180deg,rgba(120,90,255,0.55),rgba(0,200,255,0.45),rgba(255,80,180,0.30),rgba(120,90,255,0.55))]" />
                            <span className="absolute -inset-6 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)]" />
                            <span className="relative text-[10px] font-extrabold tracking-[0.35em] pl-[0.35em]">
                                ME
                            </span>
                        </span>

                        <div className="leading-tight">
                            <div className="text-sm font-semibold tracking-wide">Your Name</div>
                            <div className="text-[11px] text-white/60">Constellation Portfolio</div>
                        </div>
                    </a>

                    {/* DESKTOP: constellation nav */}
                    <nav className="hidden md:flex items-center gap-3">
                        <div className="relative rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md">
                            {/* “orbit line” */}
                            <div className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="relative flex items-center gap-1">
                                {NAV.map((item, idx) => {
                                    const isActive = active === item.href;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                                                "text-white/75 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                                                isActive ? "text-white" : "",
                                            ].join(" ")}
                                        >
                                            {/* star node */}
                                            <span
                                                className={[
                                                    "relative h-2.5 w-2.5 rounded-full border transition duration-300",
                                                    isActive
                                                        ? "bg-white/85 border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)]"
                                                        : "bg-white/10 border-white/20 group-hover:bg-white/30 group-hover:border-white/35",
                                                ].join(" ")}
                                                aria-hidden="true"
                                            />

                                            <span className="relative z-10">{item.label}</span>

                                            {/* hover aurora */}
                                            <span
                                                className="absolute inset-0 -z-10 rounded-full opacity-0 blur-sm transition duration-300
                                   group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(120,90,255,0.25),transparent_60%),radial-gradient(circle_at_70%_50%,rgba(0,200,255,0.18),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(255,80,180,0.12),transparent_60%)]"
                                                aria-hidden="true"
                                            />
                                            {/* subtle “constellation line” accent varies by index */}
                                            <span
                                                className={[
                                                    "pointer-events-none absolute -left-2 top-1/2 h-px w-3 -translate-y-1/2 opacity-0 transition duration-300",
                                                    "bg-gradient-to-r from-transparent via-white/40 to-transparent",
                                                    idx === 0 ? "hidden" : "group-hover:opacity-60",
                                                ].join(" ")}
                                                aria-hidden="true"
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA */}
                        <a
                            href="#contact"
                            className="relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white
                         border border-white/12 bg-white/8 backdrop-blur-md transition
                         hover:bg-white/12 hover:border-white/18
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            <span className="relative z-10">Contact</span>
                            <span
                                className="pointer-events-none absolute -inset-8 -z-10 opacity-0 blur-2xl transition duration-300 hover:opacity-100
                           bg-[radial-gradient(circle,rgba(120,90,255,0.18),transparent_60%)]"
                                aria-hidden="true"
                            />
                        </a>
                    </nav>

                    {/* MOBILE button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            type="button"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full
                         bg-white/8 border border-white/10 text-white/90
                         hover:bg-white/12 transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            <div className="relative h-4 w-5">
                                <span
                                    className={[
                                        "absolute left-0 top-0 h-0.5 w-5 rounded bg-white/85 transition duration-300",
                                        open ? "translate-y-1.5 rotate-45" : "",
                                    ].join(" ")}
                                />
                                <span
                                    className={[
                                        "absolute left-0 top-1.5 h-0.5 w-5 rounded bg-white/85 transition duration-300",
                                        open ? "opacity-0" : "opacity-100",
                                    ].join(" ")}
                                />
                                <span
                                    className={[
                                        "absolute left-0 top-3 h-0.5 w-5 rounded bg-white/85 transition duration-300",
                                        open ? "-translate-y-1.5 -rotate-45" : "",
                                    ].join(" ")}
                                />
                            </div>
                            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
                        </button>
                    </div>
                </div>
            </Container>

            {/* MOBILE: “star map” overlay menu */}
            <div
                className={[
                    "md:hidden fixed inset-0 z-50 transition",
                    open ? "pointer-events-auto" : "pointer-events-none",
                ].join(" ")}
                aria-hidden={!open}
            >
                {/* backdrop */}
                <button
                    onClick={close}
                    className={[
                        "absolute inset-0 w-full h-full",
                        "bg-black/55 backdrop-blur-sm transition-opacity duration-300",
                        open ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    aria-label="Close menu backdrop"
                />

                {/* panel */}
                <div
                    className={[
                        "absolute left-1/2 top-16 w-[min(92vw,520px)] -translate-x-1/2",
                        "transition duration-300",
                        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    ].join(" ")}
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/55 backdrop-blur-xl shadow-2xl">
                        <div className="pointer-events-none absolute inset-0 mobile-starmap" />
                        <div className="relative p-4">
                            <div className="flex items-center justify-between px-2 py-1">
                                <div className="text-xs font-semibold tracking-widest text-white/60">
                                    STAR MAP
                                </div>
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
                                                "group relative overflow-hidden rounded-2xl border p-4 transition",
                                                isActive
                                                    ? "border-white/22 bg-white/10"
                                                    : "border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/18",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={[
                                                        "relative h-3 w-3 rounded-full border transition",
                                                        isActive
                                                            ? "bg-white/90 border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)]"
                                                            : "bg-white/12 border-white/25 group-hover:bg-white/28 group-hover:border-white/35",
                                                    ].join(" ")}
                                                    aria-hidden="true"
                                                />
                                                <div className="text-sm font-semibold text-white/85 group-hover:text-white">
                                                    {item.label}
                                                </div>
                                            </div>

                                            <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />

                                            <span
                                                className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100
                                   bg-[radial-gradient(circle,rgba(120,90,255,0.18),transparent_55%),radial-gradient(circle,rgba(0,200,255,0.12),transparent_55%)]"
                                                aria-hidden="true"
                                            />
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

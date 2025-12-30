"use client";

import { useEffect, useRef, useState } from "react";
import Container from "../layout/Container";
import data from "../../data/contact.json";

type Quick = { label: string; href: string };
type Card = { title: string; desc: string; cta: string; href: string };

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function Contact() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const cometRef = useRef<HTMLDivElement | null>(null);
    const raf = useRef<number | null>(null);
    const [visible, setVisible] = useState(false);

    // reveal once
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) setVisible(true);
            },
            { threshold: 0.18 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // comet follower (no re-render): translate a tiny element + CSS vars
    useEffect(() => {
        const root = sectionRef.current;
        const comet = cometRef.current;
        if (!root || !comet) return;

        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;

        const onMove = (e: PointerEvent) => {
            const rect = root.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

            if (!inside) return;

            const rx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
            const ry = clamp((e.clientY - rect.top) / rect.height, 0, 1);
            root.style.setProperty("--cxp", `${Math.round(rx * 100)}%`);
            root.style.setProperty("--cyp", `${Math.round(ry * 100)}%`);

            tx = e.clientX - rect.left;
            ty = e.clientY - rect.top;
        };

        const loop = () => {
            // smooth follow
            cx += (tx - cx) * 0.14;
            cy += (ty - cy) * 0.14;
            comet.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            raf.current = requestAnimationFrame(loop);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        raf.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("pointermove", onMove);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const cards = data.cards as Card[];
    const quick = data.quickLinks as Quick[];

    return (
        <section
            id="contact"
            ref={(n) => {
                sectionRef.current = n;
            }}
            className="relative overflow-hidden border-t border-white/10"
        >
            {/* background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 contact-nebula" />
                <div className="absolute inset-0 contact-stars" />
                <div className="absolute inset-0 contact-vignette" />
            </div>

            {/* comet cursor */}
            <div
                ref={cometRef}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
                style={{ transform: "translate3d(-999px,-999px,0)" }}
            >
                <div className="contact-comet" />
            </div>

            <Container>
                <div className="relative py-20 sm:py-28">
                    {/* header */}
                    <div
                        className={[
                            "transition duration-700",
                            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                        ].join(" ")}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/65 animate-pulse" />
                            {data.eyebrow}
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                <span className="contact-title">{data.title}</span>
                            </h2>
                            <p className="text-white/75 sm:text-lg leading-relaxed">
                                {data.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* weird layout: “radio console” + “portal cards” */}
                    <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        {/* Left: radio console */}
                        <div
                            className={[
                                "relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 backdrop-blur-xl",
                                "transition duration-700",
                                visible ? "opacity-100" : "opacity-0",
                            ].join(" ")}
                            style={{ transitionDelay: "120ms" }}
                        >
                            <div className="pointer-events-none absolute inset-0 contact-consoleGlow" />

                            <div className="relative p-6 sm:p-7">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-semibold tracking-widest text-white/60">
                                        SIGNAL CONSOLE
                                    </div>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 animate-pulse" />
                                        ONLINE
                                    </span>
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
                                    <div className="text-[11px] font-semibold tracking-widest text-white/55">
                                        TRANSMISSION TEMPLATE
                                    </div>
                                    <div className="mt-3 text-sm text-white/80 leading-relaxed">
                                        “Hi Abdul, I'm building <span className="text-white/95 font-semibold">___</span>.
                                        I need help with <span className="text-white/95 font-semibold">___</span>.
                                        Timeline: <span className="text-white/95 font-semibold">___</span>.
                                        Budget: <span className="text-white/95 font-semibold">___</span>.”
                                    </div>
                                    <div className="mt-4 text-xs text-white/50">
                                        Bonus points if you include a link to specs. My brain loves specs.
                                    </div>
                                </div>

                                {/* fun toggles */}
                                <div className="mt-6 grid gap-3">
                                    {[
                                        { label: "Mode", value: "Serious 👔 / Chaos 🪐" },
                                        { label: "Response time", value: "Fast (unless I’m in a merge conflict)" },
                                        { label: "Preferred topic", value: "Systems, Product, Performance" },
                                    ].map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                        >
                                            <div className="text-xs font-semibold text-white/65">{row.label}</div>
                                            <div className="text-xs text-white/75">{row.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                                {/* quick links */}
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {quick.map((q) => (
                                        <a
                                            key={q.label}
                                            href={q.href}
                                            target={q.href.startsWith("http") ? "_blank" : undefined}
                                            rel={q.href.startsWith("http") ? "noreferrer" : undefined}
                                            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-md transition
                                 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                        >
                                            {q.label}
                                        </a>
                                    ))}
                                </div>

                                <div className="mt-6 text-xs text-white/50">{data.footerNote}</div>
                            </div>
                        </div>

                        {/* Right: portal cards */}
                        <div className="relative">
                            {/* offset slabs */}
                            <div className="pointer-events-none absolute -inset-6 rotate-[-2deg] rounded-[2.25rem] border border-white/10 bg-white/5 opacity-60" />
                            <div className="pointer-events-none absolute -inset-6 rotate-[1.2deg] rounded-[2.25rem] border border-white/10 bg-black/35 opacity-60" />

                            <div className="relative grid gap-4">
                                {cards.map((c, idx) => (
                                    <a
                                        key={c.title}
                                        href={c.href}
                                        target={c.href.startsWith("http") ? "_blank" : undefined}
                                        rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                                        className={[
                                            "group relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-black/45 backdrop-blur-xl p-6 sm:p-7",
                                            "transition duration-700",
                                            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                                        ].join(" ")}
                                        style={{ transitionDelay: `${180 + idx * 110}ms` }}
                                    >
                                        {/* portal glow */}
                                        <div className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 contact-portalGlow" />

                                        {/* weird corner ring */}
                                        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/12 opacity-30" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-lg font-semibold text-white/90">
                                                    {c.title}
                                                </div>
                                                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                                                    {c.desc}
                                                </p>
                                            </div>

                                            <span className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
                                                GO →
                                            </span>
                                        </div>

                                        <div className="mt-6 flex items-center gap-3">
                                            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                                            <span className="text-[10px] font-semibold tracking-widest text-white/45">
                                                OPEN PORTAL
                                            </span>
                                            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                                        </div>

                                        {/* warp CTA */}
                                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 transition
                                    group-hover:bg-white/14 group-hover:text-white">
                                            <span className="contact-warpDot" />
                                            {c.cta}
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-6 text-xs text-white/55">
                                If you’re a recruiter: send the role + stack + timeline. If you’re a founder: send the problem + constraints. If you’re a human: send a meme.
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                </div>
            </Container>
        </section>
    );
}

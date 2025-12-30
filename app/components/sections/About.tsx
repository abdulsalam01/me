"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../layout/Container";

type Stat = { label: string; value: string };
type Pill = { label: string };
type Highlight = { title: string; desc: string };

type Props = {
    id?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    stats?: Stat[];
    pills?: Pill[];
    highlights?: Highlight[];
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function About({
    id = "about",
    eyebrow = "ABOUT",
    title = "I think in systems, not features.",
    subtitle =
    "Most problems aren’t technical — they’re structural. I design software by understanding how decisions, constraints, and people interact over time.",
    stats = [
        { label: "Primary instinct", value: "Understand the problem first" },
        { label: "Default approach", value: "Design before code" },
        { label: "Quality bar", value: "Production-grade only" },
    ],
    pills = [
        { label: "Backend Architecture" },
        { label: "System Design" },
        { label: "Cloud & Infra" },
        { label: "Developer Experience" },
        { label: "Product Thinking" },
    ],
    highlights = [
        {
            title: "Engineering Judgment",
            desc: "Knowing when to optimize, when to simplify, and when to leave things alone.",
        },
        {
            title: "Execution Discipline",
            desc: "Shipping clean, observable, and maintainable systems — not half-solutions.",
        },
        {
            title: "Long-Term Thinking",
            desc: "I build software that survives growth, change, and real-world usage.",
        },
    ],
}: Props) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [xy, setXy] = useState({ x: 0.5, y: 0.35 });
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const isOn = entries.some((e) => e.isIntersecting);
                if (isOn) setVisible(true);
            },
            { threshold: 0.18 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!inside) return;

            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
                const rx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
                const ry = clamp((e.clientY - rect.top) / rect.height, 0, 1);
                setXy({ x: rx, y: ry });
            });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const vars = useMemo(
        () =>
            ({
                ["--ax" as any]: `${Math.round(xy.x * 100)}%`,
                ["--ay" as any]: `${Math.round(xy.y * 100)}%`,
            }) as React.CSSProperties,
        [xy]
    );

    return (
        <section
            id={id}
            ref={(n) => {
                sectionRef.current = n;
            }}
            className="relative overflow-hidden border-t border-white/10"
            style={vars}
        >
            {/* Background: controlled nebula + constellation ring */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 about-nebula" />
                <div className="absolute inset-0 about-stars" />
                <div className="absolute -top-36 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full about-orbitRing" />
                <div className="absolute inset-0 about-vignette" />
            </div>

            <Container>
                <div className="relative py-20 sm:py-28">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        {/* LEFT: headline + copy (stagger reveal) */}
                        <div
                            className={[
                                "relative",
                                "transition duration-700",
                                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                            ].join(" ")}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70 backdrop-blur-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-white/65 animate-pulse" />
                                {eyebrow}
                            </div>

                            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                <span className="about-title">{title}</span>
                            </h2>

                            <p className="mt-5 max-w-xl text-white/75 sm:text-lg leading-relaxed">
                                {subtitle}
                            </p>

                            {/* Pills */}
                            <div className="mt-7 flex flex-wrap gap-2">
                                {pills.map((p, idx) => (
                                    <span
                                        key={p.label}
                                        className={[
                                            "rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur-md",
                                            "transition duration-700",
                                            visible
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-2 opacity-0",
                                        ].join(" ")}
                                        style={{ transitionDelay: `${120 + idx * 60}ms` }}
                                    >
                                        {p.label}
                                    </span>
                                ))}
                            </div>

                            {/* Stats strip */}
                            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                                {stats.map((s, idx) => (
                                    <div
                                        key={s.label}
                                        className={[
                                            "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-4",
                                            "transition duration-700",
                                            visible
                                                ? "translate-y-0 opacity-100"
                                                : "translate-y-3 opacity-0",
                                        ].join(" ")}
                                        style={{ transitionDelay: `${260 + idx * 80}ms` }}
                                    >
                                        <div className="text-xs text-white/55">{s.label}</div>
                                        <div className="mt-1 text-sm font-semibold text-white/90">
                                            {s.value}
                                        </div>
                                        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: “floating constellation cards” */}
                        <div className="relative">
                            <div className="relative mx-auto max-w-xl">
                                {/* Constellation line */}
                                <div className="pointer-events-none absolute left-1/2 top-8 h-[32rem] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent" />

                                <div className="grid gap-4">
                                    {highlights.map((h, idx) => (
                                        <div
                                            key={h.title}
                                            className={[
                                                "group relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 backdrop-blur-xl p-6",
                                                "transition duration-700",
                                                visible
                                                    ? "translate-y-0 opacity-100"
                                                    : "translate-y-4 opacity-0",
                                            ].join(" ")}
                                            style={{
                                                transitionDelay: `${180 + idx * 110}ms`,
                                            }}
                                        >
                                            {/* floating glow */}
                                            <div className="pointer-events-none absolute -inset-16 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 about-cardGlow" />
                                            {/* node dot */}
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.35)]" />
                                                <div className="min-w-0">
                                                    <div className="text-lg font-semibold text-white/90">
                                                        {h.title}
                                                    </div>
                                                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                                                        {h.desc}
                                                    </p>

                                                    <div className="mt-5 flex items-center gap-3">
                                                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                                                        <span className="text-[10px] font-semibold tracking-widest text-white/45">
                                                            SIGNAL
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* subtle motion (no heavy JS) */}
                                            <div className="pointer-events-none absolute right-5 top-5 h-16 w-16 rounded-full border border-white/10 opacity-35 about-float" />
                                        </div>
                                    ))}
                                </div>

                                {/* small “planet” badge */}
                                <div
                                    className={[
                                        "mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl",
                                        "transition duration-700",
                                        visible ? "opacity-100" : "opacity-0",
                                    ].join(" ")}
                                    style={{ transitionDelay: "520ms" }}
                                >
                                    <span className="relative h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)]">
                                        <span className="absolute -inset-2 rounded-full blur-md bg-white/15" />
                                    </span>
                                    Design-minded engineering. Product-first thinking.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* bottom: “orbit divider” */}
                    <div className="mt-16">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                    </div>
                </div>
            </Container>
        </section>
    );
}

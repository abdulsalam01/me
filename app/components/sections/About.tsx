"use client";

import { useEffect, useRef, useState } from "react";
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

    // ✅ reveal once, no continuous observers
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) setVisible(true);
            },
            { threshold: 0.2 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section
            id={id}
            ref={(n) => {
                sectionRef.current = n;
            }}
            className="relative border-t border-white/10 bg-black"
        >
            {/* ✅ static background only */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-[#070b18] to-black" />

            <Container>
                <div className="relative py-20 sm:py-28">
                    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        {/* LEFT */}
                        <div
                            className={[
                                "transition duration-700",
                                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                            ].join(" ")}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70">
                                <span className="h-1.5 w-1.5 rounded-full bg-white/65" />
                                {eyebrow}
                            </div>

                            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                {title}
                            </h2>

                            <p className="mt-5 max-w-xl text-white/75 sm:text-lg leading-relaxed">
                                {subtitle}
                            </p>

                            {/* Pills */}
                            <div className="mt-7 flex flex-wrap gap-2">
                                {pills.map((p) => (
                                    <span
                                        key={p.label}
                                        className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75"
                                    >
                                        {p.label}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                                {stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="text-xs text-white/55">{s.label}</div>
                                        <div className="mt-1 text-sm font-semibold text-white/90">
                                            {s.value}
                                        </div>
                                        <div className="mt-3 h-px w-full bg-white/10" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="relative">
                            <div className="grid gap-4">
                                {highlights.map((h) => (
                                    <div
                                        key={h.title}
                                        className={[
                                            "rounded-3xl border border-white/12 bg-white/5 p-6 transition duration-700",
                                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                                            <div>
                                                <div className="text-lg font-semibold text-white/90">
                                                    {h.title}
                                                </div>
                                                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                                                    {h.desc}
                                                </p>
                                                <div className="mt-4 h-px w-full bg-white/10" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Signature line */}
                            <div
                                className={[
                                    "mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition duration-700",
                                    visible ? "opacity-100" : "opacity-0",
                                ].join(" ")}
                            >
                                <span className="h-2 w-2 rounded-full bg-white/70" />
                                Design-minded engineering. Product-first thinking.
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                </div>
            </Container>
        </section>
    );
}

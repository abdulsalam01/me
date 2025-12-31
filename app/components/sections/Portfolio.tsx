"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../layout/Container";
import data from "../../data/portfolio.json";

type Link = { label: string; href: string };
type Project = {
    id: string;
    title: string;
    tagline: string;
    year: string;
    role: string;
    stack: string[];
    impact: string[];
    links: Link[];
    accent: "violet" | "cyan" | "pink" | "emerald" | "amber" | "indigo" | "blue";
};

const ACCENT: Record<Project["accent"], { dot: string }> = {
    violet: { dot: "bg-violet-400" },
    cyan: { dot: "bg-cyan-400" },
    pink: { dot: "bg-pink-400" },
    emerald: { dot: "bg-emerald-400" },
    amber: { dot: "bg-amber-400" },
    indigo: { dot: "bg-indigo-400" },
    blue: { dot: "bg-blue-400" },
};

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const projects = data.projects as Project[];

    const PAGE_SIZE = 5;
    const [page, setPage] = useState(0);
    const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
    const [visible, setVisible] = useState(false);

    const totalPages = Math.ceil(projects.length / PAGE_SIZE);

    const pageProjects = useMemo(() => {
        const start = page * PAGE_SIZE;
        return projects.slice(start, start + PAGE_SIZE);
    }, [projects, page]);

    useEffect(() => {
        if (!pageProjects.find((p) => p.id === activeId)) {
            setActiveId(pageProjects[0]?.id);
        }
    }, [pageProjects, activeId]);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => entries.some((e) => e.isIntersecting) && setVisible(true),
            { threshold: 0.2 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const active =
        projects.find((p) => p.id === activeId) ?? pageProjects[0];

    return (
        <section
            id="portfolio"
            ref={(n) => { sectionRef.current = n }}
            className="relative border-t border-white/10 bg-black"
        >
            {/* Static background only */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060b1a] to-black" />

            <Container>
                <div className="relative py-20 sm:py-28">
                    {/* Header */}
                    <div
                        className={[
                            "transition duration-700",
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                        ].join(" ")}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                            {data.eyebrow}
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <h2 className="text-3xl sm:text-5xl font-semibold text-white">
                                {data.title}
                            </h2>
                            <p className="text-white/70 sm:text-lg">{data.subtitle}</p>
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                        {/* LEFT */}
                        <div className="rounded-3xl border border-white/12 bg-white/5 p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-xs font-semibold tracking-widest text-white/60">
                                    FLIGHT PATH
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="rounded-full px-3 py-2 text-xs border border-white/12 text-white/70 disabled:opacity-40"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() =>
                                            setPage((p) => Math.min(totalPages - 1, p + 1))
                                        }
                                        disabled={page === totalPages - 1}
                                        className="rounded-full px-3 py-2 text-xs border border-white/12 text-white/70 disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {pageProjects.map((p) => {
                                    const isActive = p.id === activeId;
                                    const accent = ACCENT[p.accent];

                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => setActiveId(p.id)}
                                            className={[
                                                "text-left rounded-2xl border p-4 transition",
                                                isActive
                                                    ? "border-white/25 bg-white/10"
                                                    : "border-white/10 bg-white/5 hover:bg-white/8",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={[
                                                        "h-2.5 w-2.5 rounded-full",
                                                        isActive ? accent.dot : "bg-white/30",
                                                    ].join(" ")}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm font-semibold text-white/90">
                                                        {p.title}
                                                        <span className="text-xs text-white/50">
                                                            {p.year}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-white/60">
                                                        {p.role}
                                                    </div>
                                                    <div className="mt-2 text-xs text-white/70 line-clamp-2">
                                                        {p.tagline}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="rounded-3xl border border-white/12 bg-white/5 p-6 sm:p-8">
                            <div className="text-xs font-semibold tracking-widest text-white/60">
                                STAR SYSTEM
                            </div>

                            <h3 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
                                {active.title}
                            </h3>
                            <p className="mt-2 text-white/70">{active.tagline}</p>

                            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-white/60">
                                        IMPACT
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {active.impact.map((x) => (
                                            <li key={x} className="text-sm text-white/75">
                                                • {x}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-white/60">
                                        STACK
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {active.stack.map((s) => (
                                            <span
                                                key={s}
                                                className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs text-white/75"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {active.links.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        className="rounded-full border border-white/14 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/14"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 h-px w-full bg-white/10" />
                </div>
            </Container>
        </section>
    );
}

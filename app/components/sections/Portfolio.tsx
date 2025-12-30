"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../layout/Container";
import data from "../../data/portfolio.json";

type Link = { label: string; href: string, glow?: string; };
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

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

const ACCENT: Record<Project["accent"], { ring: string; glow: string; dot: string }> = {
    violet: {
        ring: "ring-[rgba(120,90,255,0.35)]",
        glow:
            "bg-[radial-gradient(circle_at_30%_30%,rgba(120,90,255,0.28),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(0,200,255,0.14),transparent_55%)]",
        dot: "bg-[rgba(120,90,255,0.85)]",
    },
    cyan: {
        ring: "ring-[rgba(0,200,255,0.35)]",
        glow:
            "bg-[radial-gradient(circle_at_30%_30%,rgba(0,200,255,0.24),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(120,90,255,0.14),transparent_55%)]",
        dot: "bg-[rgba(0,200,255,0.85)]",
    },
    pink: {
        ring: "ring-[rgba(255,80,180,0.35)]",
        glow:
            "bg-[radial-gradient(circle_at_30%_30%,rgba(255,80,180,0.20),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(120,90,255,0.14),transparent_55%)]",
        dot: "bg-[rgba(255,80,180,0.85)]",
    },
    emerald: {
        dot: "bg-emerald-300/90",
        ring: "ring-emerald-300/25",
        glow: "bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_60%)]",
    },
    amber: {
        dot: "bg-amber-300/90",
        ring: "ring-amber-300/25",
        glow: "bg-[radial-gradient(circle,rgba(245,158,11,0.18),transparent_60%)]",
    },
    indigo: {
        dot: "bg-indigo-300/90",
        ring: "ring-indigo-300/25",
        glow: "bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_60%)]",
    },
    blue: {
        dot: "bg-blue-300/90",
        ring: "ring-blue-300/25",
        glow: "bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_60%)]",
    },
};

// ✅ Add pagination (5 items per page) + Prev/Next controls
// Drop-in edits inside your Portfolio component

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const projects = data.projects as Project[];

    const PAGE_SIZE = 5;

    // ✅ NEW: page state
    const [page, setPage] = useState(0);

    // ✅ Keep activeId stable, but ensure it always exists in the current page
    const [activeId, setActiveId] = useState<string>(projects[0]?.id ?? "");
    const [visible, setVisible] = useState(false);

    const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));

    // ✅ NEW: slice projects for current page
    const pageProjects = useMemo(() => {
        const start = page * PAGE_SIZE;
        return projects.slice(start, start + PAGE_SIZE);
    }, [projects, page]);

    // ✅ If activeId is not in current page, pick the first project in the page
    useEffect(() => {
        if (!pageProjects.length) return;
        const exists = pageProjects.some((p) => p.id === activeId);
        if (!exists) setActiveId(pageProjects[0].id);
    }, [pageProjects, activeId]);

    // reveal once (your code)
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

    // pointer glow without re-render (your code)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        let raf: number | null = null;

        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (!inside) return;

            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
                const ry = clamp((e.clientY - rect.top) / rect.height, 0, 1);
                el.style.setProperty("--px", `${Math.round(rx * 100)}%`);
                el.style.setProperty("--py", `${Math.round(ry * 100)}%`);
            });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const active = useMemo(
        () => projects.find((p) => p.id === activeId) ?? pageProjects[0] ?? projects[0],
        [projects, pageProjects, activeId]
    );

    const prevPage = () => setPage((p) => Math.max(0, p - 1));
    const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <section
            id="portfolio"
            ref={(n) => {
                sectionRef.current = n;
            }}
            className="relative overflow-hidden border-t border-white/10"
        >
            {/* background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 portfolio-nebula" />
                <div className="absolute inset-0 portfolio-vignette" />
                <div className="absolute inset-0 portfolio-stars" />
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
                                <span className="portfolio-title">{data.title}</span>
                            </h2>
                            <p className="text-white/75 sm:text-lg leading-relaxed">{data.subtitle}</p>
                        </div>
                    </div>

                    {/* layout */}
                    <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        {/* LEFT */}
                        <div
                            className={[
                                "relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl",
                                "transition duration-700",
                                visible ? "opacity-100" : "opacity-0",
                            ].join(" ")}
                            style={{ transitionDelay: "120ms" }}
                        >
                            <div className="pointer-events-none absolute inset-0 portfolio-railGlow" />

                            <div className="relative p-5 sm:p-6">
                                {/* ✅ top row now includes pagination */}
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs font-semibold tracking-widest text-white/60">FLIGHT PATH</div>
                                        <div className="mt-1 text-xs text-white/45">
                                            Page <span className="text-white/70">{page + 1}</span> /{" "}
                                            <span className="text-white/70">{totalPages}</span> • showing{" "}
                                            <span className="text-white/70">{pageProjects.length}</span> of{" "}
                                            <span className="text-white/70">{projects.length}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={prevPage}
                                            disabled={page === 0}
                                            className={[
                                                "rounded-full px-3 py-2 text-xs font-semibold transition",
                                                "border border-white/12 bg-white/6 text-white/75",
                                                page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10 hover:border-white/18",
                                            ].join(" ")}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextPage}
                                            disabled={page >= totalPages - 1}
                                            className={[
                                                "rounded-full px-3 py-2 text-xs font-semibold transition",
                                                "border border-white/12 bg-white/6 text-white/75",
                                                page >= totalPages - 1
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "hover:bg-white/10 hover:border-white/18",
                                            ].join(" ")}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />

                                    <div className="grid gap-3">
                                        {/* ✅ use pageProjects instead of projects */}
                                        {pageProjects.map((p) => {
                                            const isActive = p.id === activeId;
                                            const accent = ACCENT[p.accent] ?? ACCENT.violet;

                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setActiveId(p.id)}
                                                    className={[
                                                        "group relative text-left rounded-2xl border p-4 transition",
                                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                                                        isActive
                                                            ? "border-white/18 bg-white/8"
                                                            : "border-white/10 bg-white/4 hover:bg-white/6 hover:border-white/14",
                                                    ].join(" ")}
                                                >
                                                    <span className="absolute left-[9px] top-1/2 -translate-y-1/2">
                                                        <span
                                                            className={[
                                                                "block h-3 w-3 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.18)]",
                                                                isActive ? accent.dot : "bg-white/35",
                                                            ].join(" ")}
                                                        />
                                                    </span>

                                                    <span
                                                        className={[
                                                            "pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full border opacity-0 blur-[0.5px] transition duration-300",
                                                            isActive ? "opacity-35" : "group-hover:opacity-20",
                                                            "border-white/12",
                                                        ].join(" ")}
                                                    />

                                                    <div className="ml-5">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="text-sm font-semibold text-white/90">{p.title}</div>
                                                            <div className="text-xs text-white/55">{p.year}</div>
                                                        </div>
                                                        <div className="mt-1 text-xs text-white/60">{p.role}</div>
                                                        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                        <div className="mt-3 text-xs text-white/70 line-clamp-2">{p.tagline}</div>
                                                    </div>

                                                    <span
                                                        className={[
                                                            "pointer-events-none absolute -inset-16 -z-10 opacity-0 blur-2xl transition duration-300",
                                                            "group-hover:opacity-100",
                                                            accent.glow,
                                                        ].join(" ")}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT (unchanged) */}
                        <div className="relative">
                            <div className="pointer-events-none absolute -inset-6 rotate-[-2.5deg] rounded-[2.25rem] border border-white/10 bg-white/5 opacity-60" />
                            <div className="pointer-events-none absolute -inset-6 rotate-[1.5deg] rounded-[2.25rem] border border-white/10 bg-black/35 opacity-60" />

                            <div
                                className={[
                                    "relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-black/40 backdrop-blur-xl shadow-2xl",
                                    "transition duration-700",
                                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                                ].join(" ")}
                                style={{ transitionDelay: "200ms" }}
                            >
                                <div className="pointer-events-none absolute -inset-24 portfolio-activeGlow" />

                                <div className="relative p-6 sm:p-8">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <div className="text-xs font-semibold tracking-widest text-white/60">STAR SYSTEM</div>
                                            <div className="mt-3 text-2xl sm:text-3xl font-semibold text-white/90">{active.title}</div>
                                            <div className="mt-2 text-sm text-white/70 max-w-2xl leading-relaxed">{active.tagline}</div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
                                                {active.year}
                                            </span>
                                            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
                                                {active.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/14 to-transparent" />

                                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                        <div>
                                            <div className="text-xs font-semibold tracking-widest text-white/60">IMPACT</div>
                                            <ul className="mt-3 space-y-2">
                                                {active.impact.map((x) => (
                                                    <li key={x} className="text-sm text-white/75 leading-relaxed">
                                                        <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/55" />
                                                        {x}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <div className="text-xs font-semibold tracking-widest text-white/60">STACK</div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {active.stack.map((s) => (
                                                    <span
                                                        key={s}
                                                        className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur-md"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        {active.links.map((l) => (
                                            <a
                                                key={l.label}
                                                href={l.href}
                                                target={l.href.startsWith("http") ? "_blank" : undefined}
                                                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                                                className="group relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white
                          border border-white/14 bg-white/10 backdrop-blur-md transition
                          hover:bg-white/14 hover:border-white/20
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                            >
                                                <span className="relative z-10">{l.label}</span>
                                                <span
                                                    className="pointer-events-none absolute -inset-10 -z-10 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100
                            bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_60%)]"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        ))}
                                    </div>

                                    <div className="mt-10 relative">
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                                        <div className="pointer-events-none absolute left-1/2 top-0 h-10 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 blur-[0.5px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                </div>
            </Container>
        </section>
    );
}

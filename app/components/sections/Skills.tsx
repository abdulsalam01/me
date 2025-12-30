"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../layout/Container";

type SkillNode = {
    id: string;
    label: string;
    level: "Expert" | "Advanced";
    x: number; // 0..100 (constellation coordinate)
    y: number; // 0..100
    tags?: string[];
};

type Props = {
    id?: string;
    title?: string;
    subtitle?: string;
};

type SkillCopy = {
    headline: string;
    body: string;
    business: string[];
};

const SKILL_COPY: Record<string, SkillCopy> = {
    go: {
        headline: "Golang is my default for backend services.",
        body:
            "I mainly use Go when building APIs and internal services that must stay fast, predictable, and easy to reason about under load. Goroutines and explicit concurrency help me control latency instead of guessing it.",
        business: [
            "Consistent response times under traffic",
            "Simpler services → easier maintenance",
            "Lower operational overhead in production",
        ],
    },

    ts: {
        headline: "TypeScript is how I move fast without breaking things.",
        body:
            "In most product-facing systems, TypeScript lets me iterate quickly while keeping contracts clear between frontend and backend. Types become shared understanding, not just compiler checks.",
        business: [
            "Faster feature iteration",
            "Fewer regressions during refactors",
            "Better collaboration across teams",
        ],
    },

    java: {
        headline: "Java is what I trust for long-lived systems.",
        body:
            "I use Java when systems are expected to grow in complexity over time. Its ecosystem and patterns help keep large codebases structured and understandable years later.",
        business: [
            "Stable core platforms",
            "Predictable scaling behavior",
            "Lower long-term rewrite risk",
        ],
    },

    php: {
        headline: "PHP helps me ship business features quickly.",
        body:
            "I’ve used PHP extensively for backend APIs and internal tools where speed of delivery matters. With the right structure, it stays maintainable while moving fast.",
        business: [
            "Shorter time-to-market",
            "Cost-effective backend delivery",
            "Easy onboarding for teams",
        ],
    },

    sql: {
        headline: "Data performance is something I take personally.",
        body:
            "I spend a lot of time on query shape, indexing strategy, and caching. When data access is slow, everything else feels slow — users notice immediately.",
        business: [
            "Faster dashboards and workflows",
            "Reduced infrastructure cost",
            "Better user experience at scale",
        ],
    },

    rust: {
        headline: "Rust fascinates me for the right reasons.",
        body:
            "When working on large or performance-sensitive systems, I reach for Rust to gain control over memory and execution. I use it selectively — where safety and efficiency actually matter.",
        business: [
            "Higher performance per compute unit",
            "Fewer runtime failures",
            "Confidence in critical components",
        ],
    },

    py: {
        headline: "Python is my leverage tool.",
        body:
            "I use Python to automate repetitive work, build internal tools, and experiment quickly. It’s how I remove friction from teams and processes.",
        business: [
            "Operational efficiency",
            "Faster experimentation cycles",
            "Less manual work for engineers",
        ],
    },

    cpp: {
        headline: "C/C++ gave me systems intuition.",
        body:
            "Working close to memory and hardware helped me understand performance issues that abstractions often hide. That perspective carries into higher-level systems.",
        business: [
            "Stronger performance debugging",
            "Better architectural decisions",
            "Fewer blind spots in production",
        ],
    },

    ruby: {
        headline: "Ruby taught me to value developer experience.",
        body:
            "I’ve used Ruby when clarity and expressiveness matter. Clean code and readable intent make teams faster and systems easier to evolve.",
        business: [
            "Higher developer productivity",
            "Readable, maintainable codebases",
            "Faster onboarding",
        ],
    },

    kt: {
        headline: "Kotlin keeps mobile systems sane.",
        body:
            "In Android development, Kotlin helps me balance speed and correctness. It reduces boilerplate while keeping intent explicit.",
        business: [
            "Higher mobile app quality",
            "Faster release cycles",
            "Lower maintenance burden",
        ],
    },

    ex: {
        headline: "Elixir is my choice for resilient concurrency.",
        body:
            "I use Elixir when building systems that need to handle many concurrent users and stay online even when parts fail. The BEAM model changes how you think about reliability.",
        business: [
            "Higher uptime for realtime systems",
            "Graceful handling of traffic spikes",
            "Less production firefighting",
        ],
    },

    cs: {
        headline: "C# works well for enterprise environments.",
        body:
            "I use C# for services, integrations, and internal platforms where structure, tooling, and long-term support matter.",
        business: [
            "Reliable internal systems",
            "Easier integration across services",
            "Lower risk in enterprise workloads",
        ],
    },

    sol: {
        headline: "Solidity makes business rules explicit.",
        body:
            "I explore Solidity when logic needs to be transparent and verifiable. Writing rules as code changes how trust and ownership are enforced.",
        business: [
            "Auditable business logic",
            "Reduced disputes and ambiguity",
            "Programmable trust models",
        ],
    },
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function Skills({
    id = "skills",
    title = "Skill Constellation",
    subtitle = "A path, not a grid. Hover a star to see the signal.",
}: Props) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [active, setActive] = useState<string>("go");
    const [visible, setVisible] = useState(false);
    const [xy, setXy] = useState({ x: 0.5, y: 0.35 });
    const raf = useRef<number | null>(null);

    // Based on your CV expertise list (Expert + Advanced)
    const nodes: SkillNode[] = useMemo(
        () => [
            // Expert ring
            { id: "go", label: "Golang", level: "Expert", x: 14, y: 55, tags: ["Microservices", "Latency", "Concurrency"] },
            { id: "ts", label: "JavaScript / TypeScript", level: "Expert", x: 28, y: 30, tags: ["Node.js", "Web", "Tooling"] },
            { id: "java", label: "Java", level: "Expert", x: 52, y: 18, tags: ["Systems", "Patterns"] },
            { id: "php", label: "PHP", level: "Expert", x: 76, y: 28, tags: ["APIs", "Backend"] },
            { id: "sql", label: "SQL / NoSQL", level: "Expert", x: 86, y: 54, tags: ["Indexing", "Caching", "Queries"] },

            // Advanced orbit
            { id: "rust", label: "Rust", level: "Advanced", x: 70, y: 78, tags: ["Perf", "Safety"] },
            { id: "py", label: "Python", level: "Advanced", x: 48, y: 84, tags: ["Automation", "Data"] },
            { id: "cpp", label: "C / C++", level: "Advanced", x: 24, y: 78, tags: ["Low-level", "Systems"] },
            { id: "ruby", label: "Ruby", level: "Advanced", x: 10, y: 32, tags: ["Web", "DX"] },
            { id: "kt", label: "Kotlin", level: "Advanced", x: 44, y: 42, tags: ["Mobile", "Android"] },

            // Added (Advanced orbit)
            { id: "ex", label: "Elixir", level: "Advanced", x: 60, y: 36, tags: ["Concurrency", "Fault-tolerance", "Realtime"] },
            { id: "cs", label: "C#", level: "Advanced", x: 36, y: 60, tags: ["Enterprise", "Services", "Integrations"] },
            { id: "sol", label: "Solidity", level: "Advanced", x: 62, y: 56, tags: ["Smart Contracts", "Auditable Logic", "On-chain"] },
        ],
        []
    );


    const edges = useMemo(
        () =>
            [
                ["ruby", "ts"],
                ["ts", "java"],
                ["java", "php"],
                ["php", "sql"],
                ["sql", "rust"],
                ["rust", "py"],
                ["py", "cpp"],
                ["cpp", "go"],
                ["go", "kt"],
                ["kt", "ts"],

                // new links
                ["ts", "ex"],
                ["java", "cs"],
                ["sql", "cs"],
                ["ts", "sol"],
                ["sol", "sql"],
            ] as Array<[string, string]>,
        []
    );


    const activeNode = useMemo(() => nodes.find((n) => n.id === active) ?? nodes[0], [active, nodes]);

    // reveal on scroll
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

    // pointer glow
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            const el = sectionRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (!inside) return;

            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
                const rx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
                const ry = clamp((e.clientY - rect.top) / rect.height, 0, 1);
                el.style.setProperty("--sx", `${Math.round(rx * 100)}%`);
                el.style.setProperty("--sy", `${Math.round(ry * 100)}%`);
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
                ["--sx" as any]: `${Math.round(xy.x * 100)}%`,
                ["--sy" as any]: `${Math.round(xy.y * 100)}%`,
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
        >
            {/* background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 skills-nebula" />
                <div className="absolute inset-0 skills-stars" />
                <div className="absolute inset-0 skills-vignette" />
            </div>

            <Container>
                <div className="relative py-20 sm:py-28">
                    <div
                        className={[
                            "transition duration-700",
                            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                        ].join(" ")}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/65 animate-pulse" />
                            SKILLS
                        </div>

                        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                            {title}
                        </h2>
                        <p className="mt-4 max-w-2xl text-white/75 sm:text-lg">{subtitle}</p>
                    </div>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                        {/* Constellation map */}
                        <div
                            className={[
                                "relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl",
                                "transition duration-700",
                                visible ? "opacity-100" : "opacity-0",
                            ].join(" ")}
                            style={{ transitionDelay: "120ms" }}
                        >
                            <div className="pointer-events-none absolute inset-0 skills-mapGlow" />

                            <div className="relative aspect-[16/10] w-full">
                                <svg viewBox="0 0 100 100" className="h-full w-full">
                                    {/* edges */}
                                    <g opacity="0.9">
                                        {edges.map(([a, b], i) => {
                                            const na = nodes.find((n) => n.id === a)!;
                                            const nb = nodes.find((n) => n.id === b)!;
                                            const hot = a === active || b === active;

                                            return (
                                                <line
                                                    key={`${a}-${b}-${i}`}
                                                    x1={na.x}
                                                    y1={na.y}
                                                    x2={nb.x}
                                                    y2={nb.y}
                                                    className={hot ? "skills-edge-hot" : "skills-edge"}
                                                />
                                            );
                                        })}
                                    </g>

                                    {/* orbit rings */}
                                    <circle cx="52" cy="52" r="38" className="skills-orbit" />
                                    <circle cx="52" cy="52" r="26" className="skills-orbit skills-orbit2" />

                                    {/* nodes */}
                                    {nodes.map((n) => {
                                        const isActive = n.id === active;
                                        const r = n.level === "Expert" ? 1.9 : 1.6;

                                        return (
                                            <g
                                                key={n.id}
                                                onMouseEnter={() => setActive(n.id)}
                                                onFocus={() => setActive(n.id)}
                                                tabIndex={0}
                                                role="button"
                                                aria-label={`Skill ${n.label}`}
                                                className="skills-node"
                                            >
                                                {/* glow */}
                                                <circle
                                                    cx={n.x}
                                                    cy={n.y}
                                                    r={isActive ? 5.2 : 4.2}
                                                    className={isActive ? "skills-nodeGlow-hot" : "skills-nodeGlow"}
                                                />

                                                {/* core */}
                                                <circle
                                                    cx={n.x}
                                                    cy={n.y}
                                                    r={isActive ? r + 0.35 : r}
                                                    className={isActive ? "skills-nodeCore-hot" : "skills-nodeCore"}
                                                />

                                                {/* label */}
                                                <text
                                                    x={n.x}
                                                    y={n.y - 3.4}
                                                    textAnchor="middle"
                                                    className={isActive ? "skills-label-hot" : "skills-label"}
                                                >
                                                    {n.label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* subtle instruction */}
                                <div className="absolute bottom-3 left-3 rounded-full border border-white/12 bg-black/35 px-3 py-2 text-xs font-semibold text-white/70 backdrop-blur-md">
                                    Hover / tap a star
                                </div>
                            </div>
                        </div>

                        {/* Detail panel */}
                        <div
                            className={[
                                "relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl p-6 sm:p-7",
                                "transition duration-700",
                                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                            ].join(" ")}
                            style={{ transitionDelay: "220ms" }}
                        >
                            <div className="pointer-events-none absolute -inset-20 skills-panelGlow" />

                            <div className="relative">
                                <div className="text-xs font-semibold tracking-widest text-white/60">
                                    SELECTED STAR
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="text-2xl font-semibold text-white/90">
                                        {activeNode.label}
                                    </div>
                                    <span
                                        className={[
                                            "rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md",
                                            activeNode.level === "Expert"
                                                ? "border-white/18 bg-white/10 text-white/85"
                                                : "border-white/12 bg-white/6 text-white/70",
                                        ].join(" ")}
                                    >
                                        {activeNode.level}
                                    </span>
                                </div>

                                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/14 to-transparent" />

                                {(() => {
                                    const copy = SKILL_COPY[activeNode.id] ?? {
                                        headline: "A practical skill, applied to outcomes.",
                                        body: "I use the right tool for the constraint—speed, reliability, cost, or team execution.",
                                        business: ["Ship faster", "Operate safer", "Reduce complexity"],
                                    };

                                    return (
                                        <div className="mt-4">
                                            <div className="text-sm font-semibold text-white/85">{copy.headline}</div>
                                            <p className="mt-2 text-sm text-white/75 leading-relaxed">{copy.body}</p>

                                            <ul className="mt-4 space-y-2">
                                                {copy.business.map((b) => (
                                                    <li key={b} className="text-sm text-white/70 leading-relaxed">
                                                        <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-white/50" />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })()}

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {(activeNode.tags ?? []).map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur-md"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-8 text-xs text-white/55">
                                    Source: Abdul Salam's “EXPERTISE”.
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

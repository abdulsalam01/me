"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../layout/Container";

type Props = {
    id?: string;
    videoSrc: string;
    name: string;
    headline: string;
    subheadline: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function Hero({
    id = "home",
    videoSrc,
    name,
    headline,
    subheadline,
    primaryCta = { label: "View Work", href: "#portfolio" },
    secondaryCta = { label: "Contact", href: "#contact" },
}: Props) {
    const vref = useRef<HTMLVideoElement | null>(null);
    const [ready, setReady] = useState(false);
    const [xy, setXy] = useState({ x: 0.5, y: 0.45 });
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const v = vref.current;
        if (!v) return;

        v.muted = true;
        v.playsInline = true;

        const onCanPlay = () => setReady(true);
        v.addEventListener("canplay", onCanPlay);

        // try play (mobile policies can block if not muted; we are muted)
        v.play().catch(() => { });

        return () => v.removeEventListener("canplay", onCanPlay);
    }, []);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
                const w = window.innerWidth || 1;
                const h = window.innerHeight || 1;
                setXy({
                    x: clamp(e.clientX / w, 0, 1),
                    y: clamp(e.clientY / h, 0, 1),
                });
            });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const heroVars = useMemo(
        () =>
            ({
                ["--hx" as any]: `${Math.round(xy.x * 100)}%`,
                ["--hy" as any]: `${Math.round(xy.y * 100)}%`,
            }) as React.CSSProperties,
        [xy]
    );

    return (
        <section
            id={id}
            className="relative min-h-[92vh] overflow-hidden border-b border-white/10"
            style={heroVars}
        >
            {/* VIDEO LAYER */}
            <div className="absolute inset-0">
                <video
                    ref={vref}
                    className={[
                        "h-full w-full object-cover transition-opacity duration-700",
                        ready ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
                {/* fallback gradient while video loads */}
                <div
                    className={[
                        "absolute inset-0 transition-opacity duration-700",
                        ready ? "opacity-0" : "opacity-100",
                        "bg-[radial-gradient(900px_600px_at_20%_10%,rgba(120,90,255,0.35),transparent_60%),radial-gradient(800px_500px_at_80%_25%,rgba(0,200,255,0.25),transparent_60%),radial-gradient(900px_700px_at_50%_90%,rgba(255,80,180,0.18),transparent_60%),radial-gradient(circle_at_50%_50%,rgba(10,15,35,1),rgba(3,5,15,1)_60%,rgba(0,0,0,1))]",
                    ].join(" ")}
                />
            </div>

            {/* OVERLAYS: darken for readability + cinematic bloom */}
            <div className="absolute inset-0 hero-vignette" />
            <div className="absolute inset-0 hero-nebula" />
            <div className="absolute inset-0 hero-stars pointer-events-none" />
            <div className="absolute inset-0 hero-scanlines pointer-events-none" />

            {/* CONTENT */}
            <Container>
                <div className="relative z-10 flex min-h-[92vh] items-center py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/30 px-3 py-1 text-xs font-semibold tracking-widest text-white/70 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                            {name}
                        </div>

                        <h1 className="mt-5 hero-title text-4xl font-semibold tracking-tight sm:text-6xl">
                            {headline}
                        </h1>

                        <p className="mt-4 max-w-2xl text-white/75 sm:text-lg">
                            {subheadline}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={primaryCta.href}
                                className="group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white
                           border border-white/14 bg-white/10 backdrop-blur-md transition
                           hover:bg-white/14 hover:border-white/20
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            >
                                <span className="relative z-10">{primaryCta.label}</span>
                                <span
                                    className="pointer-events-none absolute -inset-10 -z-10 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100
                             bg-[radial-gradient(circle,rgba(120,90,255,0.22),transparent_60%),radial-gradient(circle,rgba(0,200,255,0.14),transparent_60%)]"
                                    aria-hidden="true"
                                />
                            </a>

                            <a
                                href={secondaryCta.href}
                                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/85
                           border border-white/12 bg-black/25 backdrop-blur-md transition
                           hover:bg-black/35 hover:text-white
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            >
                                {secondaryCta.label}
                            </a>
                        </div>

                        {/* Micro badges */}
                        <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/70">
                            {["Scalable Systems",
                                "Reliable Architecture",
                                "Elegant Interfaces",
                                "Business-Ready Platforms",].map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-full border border-white/12 bg-white/5 px-3 py-2 backdrop-blur-md"
                                    >
                                        {t}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </Container>

            {/* Scroll cue */}
            <a
                href="#about"
                className="group absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/12 bg-black/25 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-md
                   hover:bg-black/35 hover:text-white transition
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
                <span className="inline-flex items-center gap-2">
                    Scroll
                    <span className="inline-block h-4 w-4 translate-y-[1px] opacity-80 group-hover:opacity-100 transition">
                        ↓
                    </span>
                </span>
                <span className="ml-2 inline-block h-1.5 w-10 overflow-hidden rounded-full bg-white/10 align-middle">
                    <span className="block h-full w-1/3 rounded-full bg-white/50 hero-scrollbar" />
                </span>
            </a>
        </section>
    );
}

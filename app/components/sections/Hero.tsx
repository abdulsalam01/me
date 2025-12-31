"use client";

import { useEffect, useRef, useState } from "react";
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

    useEffect(() => {
        const v = vref.current;
        if (!v) return;

        v.muted = true;
        v.playsInline = true;

        const onCanPlay = () => setReady(true);
        v.addEventListener("canplay", onCanPlay);

        v.play().catch(() => { });

        return () => v.removeEventListener("canplay", onCanPlay);
    }, []);

    return (
        <section
            id={id}
            className="relative min-h-[92vh] overflow-hidden border-b border-white/10 bg-black"
        >
            {/* VIDEO */}
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

                {/* static fallback */}
                {!ready && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b1025] via-black to-black" />
                )}

                {/* single readability overlay (cheap) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
            </div>

            {/* CONTENT */}
            <Container>
                <div className="relative z-10 flex min-h-[92vh] items-center py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1 text-xs font-semibold tracking-widest text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                            {name}
                        </div>

                        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            {headline}
                        </h1>

                        <p className="mt-4 max-w-2xl text-white/70 sm:text-lg">
                            {subheadline}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={primaryCta.href}
                                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white
                  border border-white/15 bg-white/10 transition hover:bg-white/15"
                            >
                                {primaryCta.label}
                            </a>

                            <a
                                href={secondaryCta.href}
                                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/80
                  border border-white/10 bg-black/40 transition hover:bg-black/60 hover:text-white"
                            >
                                {secondaryCta.label}
                            </a>
                        </div>

                        {/* badges (static, no blur) */}
                        <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/65">
                            {[
                                "Scalable Systems",
                                "Reliable Architecture",
                                "Elegant Interfaces",
                                "Business-Ready Platforms",
                            ].map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>

            {/* SCROLL CUE (static) */}
            <a
                href="#about"
                className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/12 bg-black/40 px-4 py-2 text-xs font-semibold text-white/75
          hover:bg-black/60 transition"
            >
                Scroll ↓
            </a>
        </section>
    );
}

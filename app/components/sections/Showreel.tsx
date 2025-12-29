"use client";

import { useEffect, useRef, useState } from "react";
import Container from "../layout/Container";

type Props = {
    id?: string;
    title?: string;
    subtitle?: string;
    videoSrc: string; // e.g. "/videos/hero-3d.mp4"
};

export default function Showreel({
    id = "showreel",
    title = "3D Showreel",
    subtitle = "One clip. Full atmosphere. High signal.",
    videoSrc,
}: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // Ensure autoplay works reliably (mobile may block audio; keep muted)
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = true;
        v.playsInline = true;

        const tryPlay = async () => {
            try {
                await v.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        };

        tryPlay();
    }, []);

    const toggle = async () => {
        const v = videoRef.current;
        if (!v) return;

        if (v.paused) {
            try {
                await v.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        } else {
            v.pause();
            setIsPlaying(false);
        }
    };

    return (
        <section id={id} className="relative border-t border-white/10">
            {/* ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* hard dark base */}
                <div className="absolute inset-0 bg-black" />

                {/* subtle nebula only (no white wash) */}
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(900px_420px_at_20%_20%,rgba(120,90,255,0.16),transparent_60%),radial-gradient(700px_380px_at_80%_30%,rgba(0,200,255,0.12),transparent_60%),radial-gradient(900px_500px_at_50%_95%,rgba(255,80,180,0.08),transparent_60%)]" />

                {/* vignette for contrast */}
                <div className="absolute inset-0 showreel-vignette" />

                {/* content shield: keeps left text readable on any screen */}
                <div className="absolute inset-0 showreel-shield" />

                {/* tiny stars */}
                <div className="absolute inset-0 showreel-stars" />
            </div>

            <Container>
                <div className="relative py-16 sm:py-20">
                    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        {/* Text / front layer */}
                        <div className="relative">
                            <div className="inline-block rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 sm:p-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-white/70 backdrop-blur-md">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
                                    FEATURED
                                </div>

                                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    {title}
                                </h2>

                                <p className="mt-3 max-w-xl text-white/70">{subtitle}</p>

                                {/* animated hint */}
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={toggle}
                                        className="group relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white
                             border border-white/12 bg-white/10 backdrop-blur-md transition
                             hover:bg-white/14 hover:border-white/18
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                    >
                                        <span className="relative z-10">
                                            {isPlaying ? "Pause" : "Play"}
                                        </span>
                                        <span
                                            className="pointer-events-none absolute -inset-10 -z-10 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100
                               bg-[radial-gradient(circle,rgba(120,90,255,0.22),transparent_60%),radial-gradient(circle,rgba(0,200,255,0.14),transparent_60%)]"
                                            aria-hidden="true"
                                        />
                                    </button>

                                    <div className="text-xs text-white/50">
                                        Tip: hover / tap — it feels like a portal.
                                    </div>
                                </div>

                                {/* little “orbit” decoration */}
                                <div className="pointer-events-none mt-10 hidden sm:block">
                                    <div className="relative h-10 w-64">
                                        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        <div className="absolute left-6 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.35)] animate-[orbitDot_3.2s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video card */}
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/35 backdrop-blur-xl shadow-2xl">
                                {/* glow ring */}
                                <div className="pointer-events-none absolute -inset-10 opacity-60 blur-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(120,90,255,0.22),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(0,200,255,0.18),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(255,80,180,0.10),transparent_60%)]" />
                                {/* scanline overlay */}
                                <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay scanlines" />

                                <div className="relative aspect-[16/10] w-full">
                                    <video
                                        ref={videoRef}
                                        className="h-full w-full object-cover"
                                        src={videoSrc}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        controls={false}
                                    />
                                    {/* top glass */}
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_15%,rgba(255,255,255,0.12),transparent_50%)]" />

                                    {/* clickable play/pause overlay for mobile */}
                                    <button
                                        type="button"
                                        onClick={toggle}
                                        className="absolute inset-0 flex items-end justify-end p-4"
                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        <span
                                            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/35 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur-md
                                 hover:bg-black/45 transition"
                                        >
                                            <span
                                                className={[
                                                    "h-2 w-2 rounded-full",
                                                    isPlaying ? "bg-emerald-400/90" : "bg-white/50",
                                                ].join(" ")}
                                            />
                                            {isPlaying ? "LIVE" : "PAUSED"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-white/45">
                                Replace the file at <code className="text-white/70">public{videoSrc}</code>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

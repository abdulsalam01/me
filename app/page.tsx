import data from "./data/portfolio.json";

export default function Page() {
  return (
    <main className="galaxy stars text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-white/5 p-8 shadow-lg backdrop-blur-md border border-white/10">
          <p className="text-sm text-white/70">{data.profile.location}</p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {data.profile.name}
          </h1>

          <p className="mt-2 text-lg text-white/80">
            {data.profile.headline}
          </p>

          <p className="mt-6 max-w-2xl text-white/75 leading-relaxed">
            {data.profile.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/15 border border-white/10"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold text-white/90">Projects</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.projects.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-white/5 p-6 backdrop-blur-md border border-white/10 hover:bg-white/7 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-white/70">{p.role}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  {p.repo ? (
                    <a
                      className="text-white/80 hover:text-white"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repo
                    </a>
                  ) : null}
                  {p.live ? (
                    <a
                      className="text-white/80 hover:text-white"
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live
                    </a>
                  ) : null}
                </div>
              </div>

              <p className="mt-3 text-white/75">{p.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/50">
          Edit content in <code className="text-white/70">app/data/portfolio.json</code>
        </p>
      </div>
    </main>
  );
}

import type { ResumeBuilderData } from "@/lib/resumeBuilder.functions";

type Props = { data: ResumeBuilderData; template: "modern" | "minimal" | "compact" };

export function ResumePreview({ data, template }: Props) {
  if (template === "minimal") return <Minimal data={data} />;
  if (template === "compact") return <Compact data={data} />;
  return <Modern data={data} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="border-b border-neutral-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
        {title}
      </h3>
      <div className="mt-2 space-y-3 text-[11.5px] leading-snug text-neutral-800">{children}</div>
    </section>
  );
}

function Modern({ data }: { data: ResumeBuilderData }) {
  const p = data.personal;
  return (
    <div
      className="bg-white p-10 font-sans text-neutral-900"
      style={{ width: 794, minHeight: 1123 }}
    >
      <header className="border-b-2 border-indigo-600 pb-3">
        <h1 className="text-2xl font-bold tracking-tight">{p.full_name || "Your Name"}</h1>
        <p className="mt-1 text-xs text-indigo-700">{p.headline || "Headline / Target Role"}</p>
        <p className="mt-1 text-[11px] text-neutral-600">
          {[p.email, p.phone, p.location].filter(Boolean).join(" · ")}
          {p.links.length > 0 && " · "}
          {p.links.map((l, i) => (
            <span key={i}>
              {i > 0 && " · "}
              <a className="underline">{l.label || l.url}</a>
            </span>
          ))}
        </p>
      </header>
      {p.summary && (
        <Section title="Summary">
          <p>{p.summary}</p>
        </Section>
      )}
      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((e, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">
                  {e.role || "Role"}{" "}
                  <span className="font-normal text-neutral-600">· {e.company}</span>
                </div>
                <div className="text-[10px] text-neutral-500">
                  {e.start}
                  {e.end ? ` — ${e.end}` : ""}
                </div>
              </div>
              {e.location && <div className="text-[10px] text-neutral-500">{e.location}</div>}
              <ul className="ml-4 list-disc space-y-0.5">
                {e.bullets.filter(Boolean).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((pr, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{pr.name}</div>
                <div className="text-[10px] text-neutral-500">{pr.tech}</div>
              </div>
              <ul className="ml-4 list-disc space-y-0.5">
                {pr.bullets.filter(Boolean).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((ed, i) => (
            <div key={i} className="flex items-baseline justify-between">
              <div>
                <div className="font-semibold">{ed.school}</div>
                <div className="text-[11px] text-neutral-600">
                  {[ed.degree, ed.field].filter(Boolean).join(" — ")}
                  {ed.score ? ` · ${ed.score}` : ""}
                </div>
              </div>
              <div className="text-[10px] text-neutral-500">
                {ed.start}
                {ed.end ? ` — ${ed.end}` : ""}
              </div>
            </div>
          ))}
        </Section>
      )}
      {data.skills.length > 0 && (
        <Section title="Skills">
          <p>{data.skills.join(" · ")}</p>
        </Section>
      )}
      {data.achievements.length > 0 && (
        <Section title="Achievements">
          <ul className="ml-4 list-disc space-y-0.5">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Minimal({ data }: { data: ResumeBuilderData }) {
  const p = data.personal;
  return (
    <div
      className="bg-white p-12 font-serif text-neutral-900"
      style={{ width: 794, minHeight: 1123 }}
    >
      <header className="text-center">
        <h1 className="text-3xl tracking-wide">{p.full_name || "Your Name"}</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-neutral-500">{p.headline}</p>
        <p className="mt-2 text-[10px] text-neutral-600">
          {[p.email, p.phone, p.location].filter(Boolean).join(" · ")}
        </p>
      </header>
      <Modern data={data} />
    </div>
  );
}

function Compact({ data }: { data: ResumeBuilderData }) {
  return (
    <div
      className="bg-white p-6 font-sans text-[10.5px] text-neutral-900"
      style={{ width: 794, minHeight: 1123 }}
    >
      <Modern data={data} />
    </div>
  );
}

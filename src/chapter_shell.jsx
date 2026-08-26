import { useState } from "react";

// One reading shell for every chapter: a vertical contents rail on the left,
// a measured reading column in the middle, references on the right.
// Blocks become rail groups, sections become rail items — the same data the
// three stacked pill strips used to be built from.
const name = s => s.label || s.title || s.id;
const title = id =>
  String(id || "").replace(/[-_]/g, " ").replace(/^./, c => c.toUpperCase());

export default function ChapterShell({
  blocks = [],
  sections = [],
  active,
  onSelect,
  references = [],
  children,
}) {
  const [railOpen, setRailOpen] = useState(false);

  const idx = sections.findIndex(s => s.id === active);
  const sec = sections[idx];
  const next = sections[idx + 1];
  const prev = sections[idx - 1];
  const groups = blocks.length
    ? blocks
        .map(b => ({ label: b.label, items: sections.filter(s => s.block === b.id) }))
        .filter(g => g.items.length)
    : sections.some(s => s.block)
      ? [...new Set(sections.map(s => s.block))].map(id => ({
          label: title(id),
          items: sections.filter(s => s.block === id),
        }))
      : [{ label: null, items: sections }];
  const group = groups.find(g => g.items.some(s => s.id === active));

  const go = id => { onSelect(id); setRailOpen(false); };

  return (
    <div className="cs">
      <div className="cs-prog">
        <i style={{ width: `${((idx + 1) / Math.max(sections.length, 1)) * 100}%` }} />
      </div>

      <div className="cs-handle">
        <button onClick={() => setRailOpen(o => !o)} aria-expanded={railOpen}>Contents</button>
        <span>{idx + 1} of {sections.length} · {sec ? name(sec) : ""}</span>
      </div>

      <div className="cs-body">
        <nav className={railOpen ? "cs-rail open" : "cs-rail"} aria-label="Chapter contents">
          <div className="cs-rhead">Contents · {idx + 1} of {sections.length}</div>
          <div className="cs-grp">
            {groups.map((g, gi) => (
              <div key={gi}>
                {g.label && <div className="cs-gname"><span>{g.label}</span><s /></div>}
                {g.items.map(s => {
                  const n = sections.findIndex(x => x.id === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => go(s.id)}
                      className={n < idx ? "done" : undefined}
                      aria-current={s.id === active ? "true" : "false"}
                    >
                      <span className="n">{n + 1}</span>
                      <span>{name(s)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <main className="cs-read">
          <div className="cs-col">
            {group && group.label && <div className="cs-kicker">{group.label}</div>}
            <h1>{sec ? name(sec) : ""}</h1>
            <div className="cs-meta">
              <span>Topic {idx + 1} of {sections.length}</span>
              {references.length > 0 && <span>{references.length} references</span>}
            </div>
          </div>

          <div className="cs-stage">{children}</div>

          {sec && sec.nextReason && (
            <div className="cs-next">
              {sec.nextReason}
              {next && <> Up next: {name(next)}.</>}
            </div>
          )}

          <div className="cs-pager">
            <button onClick={() => prev && go(prev.id)} disabled={!prev}>← Previous</button>
            <button className="cs-fwd" onClick={() => next && go(next.id)} disabled={!next}>
              {next
                ? <>{name(next)} →<small>topic {idx + 2} of {sections.length}</small></>
                : "End of chapter"}
            </button>
          </div>
        </main>

        <aside className="cs-aside">
          <h4><span>In this chapter</span><s /></h4>
          <div className="cs-summary">
            {sections.length} topics across {groups.length} section{groups.length === 1 ? "" : "s"}.
          </div>
          {references.length > 0 && (
            <>
              <h4><span>References</span><s /></h4>
              <ol>
                {references.map((r, i) => (
                  <li key={i}><b>{i + 1}</b><span>{r}</span></li>
                ))}
              </ol>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

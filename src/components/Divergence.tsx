'use client';

import type { PlaceChapter } from '@/lib/reading-position';
import { useVerdicts, type VerdictRecord } from '@/lib/use-verdicts';
import { labelOf } from './Verdict';

/**
 * The divergence view (atlas-tbhb): the reader's own arc.
 *
 * Every answer the reader has given, placed on the book by where they were
 * when they gave it, in two lanes — who killed him, who is responsible — set
 * against two fixed references: the jury's verdict (Dmitri, on both counts)
 * and the elder's claim (everyone, all of it). The point is not the diagram
 * but the sentence under it: the chapter where the reader's legal answer and
 * moral answer came apart, and where they changed their mind.
 *
 * The references are themselves spoilers, so each carries its chapter's
 * reading position and folds away before the reader reaches it.
 */

const W = 960;
const H = 214;
const LEFT = 150;
const RIGHT = 24;
const LANE_KILLED = 78;
const LANE_RESP = 158;

/**
 * The two answers diverge when both are given and the moral answer is anything
 * but the legal one. An unanswered question is not a divergence.
 */
export function apart(r: Pick<VerdictRecord, 'killed' | 'responsible'>): boolean {
  if (!r.killed || r.responsible.length === 0) return false;
  return r.responsible.length !== 1 || r.responsible[0] !== r.killed;
}

export default function Divergence({ places, juryAt, zossimaAt }: {
  places: PlaceChapter[];
  /** Reading position of the verdict chapter. */
  juryAt: number;
  /** Reading position where the elder's answer is first stated. */
  zossimaAt: number;
}) {
  const records = useVerdicts();
  const x = (position: number) => LEFT + ((position - 0.5) / places.length) * (W - LEFT - RIGHT);
  const at = (position: number) => places[position - 1];

  // Book boundaries along the axis, labelled as the edition numbers them.
  const books: { x: number; label: string }[] = [];
  places.forEach((p, i) => {
    if (i === 0 || p.book !== places[i - 1]!.book) {
      const roman = p.cite.startsWith('Epilogue') ? 'Ep.' : p.cite.split(',')[0]!.replace('Bk ', '');
      books.push({ x: x(p.ordinal) - (W - LEFT - RIGHT) / places.length / 2, label: roman });
    }
  });

  const firstApart = records.find(apart);
  const changes = records.flatMap((r, i) => {
    const prev = records[i - 1];
    if (!prev) return [];
    const out: string[] = [];
    if (prev.killed !== r.killed) {
      out.push(`who killed him, from ${prev.killed ? labelOf(prev.killed) : 'not sure'} to ${r.killed ? labelOf(r.killed) : 'not sure'}`);
    }
    const added = r.responsible.filter((x) => !prev.responsible.includes(x)).map(labelOf);
    const dropped = prev.responsible.filter((x) => !r.responsible.includes(x)).map(labelOf);
    if (added.length || dropped.length) {
      out.push(`who is responsible${added.length ? `, adding ${added.join(' and ')}` : ''}${dropped.length ? `${added.length ? ',' : ''} letting go of ${dropped.join(' and ')}` : ''}`);
    }
    return out.length ? [{ record: r, what: out }] : [];
  });

  return (
    <section className="divergence" aria-labelledby="divergence-title">
      <header className="section-header">
        <p className="eyebrow">Your arc</p>
        <h2 className="heading" id="divergence-title">Where you stand against the court, and the elder</h2>
        <p className="text-muted">
          Each answer you record is placed where you were in the book when you gave it. The upper
          line is who killed him, the lower who is responsible.
        </p>
      </header>

      <div className="chart scroll-x" style={{ ['--chart-min' as string]: '720px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`Your ${records.length} recorded answers across the book, against the jury and the elder`}>
          {/* lanes */}
          {[[LANE_KILLED, 'Who killed him'], [LANE_RESP, 'Who is responsible']].map(([y, label]) => (
            <g key={label as string}>
              <line x1={LEFT} x2={W - RIGHT} y1={y as number} y2={y as number} stroke="var(--border-strong)" strokeWidth={1} />
              <text x={LEFT - 14} y={(y as number) + 4} textAnchor="end" className="chart-label chart-label--muted">{label}</text>
            </g>
          ))}
          {/* book ticks */}
          {books.map((b) => (
            <g key={b.label}>
              <line x1={b.x} x2={b.x} y1={40} y2={H - 30} stroke="var(--border)" strokeWidth={1} />
              <text x={b.x + 3} y={H - 16} className="chart-label chart-label--muted">{b.label}</text>
            </g>
          ))}

          {/* the elder: everyone, all of it — from the chapter that says it */}
          <g data-spoiler-from={zossimaAt}>
            <line x1={x(zossimaAt)} x2={W - RIGHT} y1={LANE_RESP + 18} y2={LANE_RESP + 18}
              stroke="var(--gilt)" strokeWidth={2} strokeDasharray="1 4" strokeLinecap="round" />
            <text x={x(zossimaAt)} y={LANE_RESP + 32} className="chart-label" fill="var(--gilt)">
              The elder: everyone, all of it
            </text>
          </g>
          {/* the jury: Dmitri, on both questions */}
          <g data-spoiler-from={juryAt}>
            <line x1={x(juryAt)} x2={x(juryAt)} y1={LANE_KILLED - 26} y2={LANE_RESP + 8}
              stroke="var(--cloth)" strokeWidth={2} />
            <text x={x(juryAt) - 6} y={LANE_KILLED - 32} textAnchor="end" className="chart-label" fill="var(--cloth-deep)">
              The jury: Dmitri, on both
            </text>
          </g>

          {/* the reader's answers */}
          {records.map((r, i) => {
            const cx = x(r.position);
            const isApart = r === firstApart;
            return (
              <g key={r.at + i}>
                <circle cx={cx} cy={LANE_KILLED} r={5} fill={r.killed ? 'var(--ink)' : 'var(--bg)'}
                  stroke="var(--ink)" strokeWidth={1.5}>
                  <title>{`${at(r.position)?.cite}: ${r.killed ? labelOf(r.killed) : 'not sure'}`}</title>
                </circle>
                <circle cx={cx} cy={LANE_RESP} r={3 + 2 * Math.min(r.responsible.length, 4)}
                  fill="var(--bg)" stroke={r.responsible.includes('everyone') ? 'var(--gilt)' : 'var(--ink)'} strokeWidth={1.5}>
                  <title>{`${at(r.position)?.cite}: ${r.responsible.map(labelOf).join(', ') || 'no one chosen'}`}</title>
                </circle>
                {isApart && (
                  <line x1={cx} x2={cx} y1={LANE_KILLED + 7} y2={LANE_RESP - 9} stroke="var(--gilt)" strokeWidth={2} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="divergence__reading">
        {records.length === 0 ? (
          <p className="text-muted">
            Nothing recorded yet. Answer the two questions above — now, and again whenever the book moves you —
            and your arc will be drawn here.
          </p>
        ) : (
          <>
            <p>
              {firstApart
                ? <>Your two answers came apart at <strong>{at(firstApart.position)?.cite}</strong>, just after
                  “{at(firstApart.position)?.title.replace(/^“|”$/g, '')}”: you held{' '}
                  {firstApart.responsible.map(labelOf).join(', ')} responsible for a death you laid
                  on {labelOf(firstApart.killed!)}.</>
                : records.some((r) => r.killed && r.responsible.length)
                  ? <>So far your two answers have not come apart: the one you say killed him is the one you hold
                    responsible — the court’s way of answering.</>
                  : <>Answer both questions to see where, if anywhere, they part.</>}
            </p>
            {changes.length > 0 && (
              <ul className="divergence__changes">
                {changes.map(({ record, what }) => (
                  <li key={record.at}>
                    At <strong>{at(record.position)?.cite}</strong> (“{at(record.position)?.title.replace(/^“|”$/g, '')}”)
                    you changed {what.join('; and ')}.
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

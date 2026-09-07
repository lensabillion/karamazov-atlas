import type { Chapter } from '@/lib/corpus';
import type { NamedCharacter, Register } from '@/lib/names';

/**
 * How one person is named across the whole novel, chapter by chapter.
 *
 * Each column is a chapter; the stack within it is the mix of registers used
 * there, most formal at the top. Reading left to right you can watch the
 * temperature of a name change — and see that formality tracks ceremony
 * (the monastery, the confrontations) rather than the courtroom.
 */
const ORDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
const OPACITY: Record<Register, number> = {
  formal: 1,
  distanced: 0.8,
  neutral: 0.6,
  familiar: 0.4,
  tender: 0.22,
};

export default function RegisterRibbon({
  character,
  chapters,
}: {
  character: NamedCharacter;
  chapters: Chapter[];
}) {
  const W = 920;
  const H = 96;
  const colW = W / chapters.length;

  // Books alternate a faint ground so the reader can find their place.
  const bookBands: { x: number; w: number; num: number }[] = [];
  let runStart = 0;
  chapters.forEach((ch, i) => {
    const next = chapters[i + 1];
    if (!next || next.bookNum !== ch.bookNum) {
      bookBands.push({ x: runStart * colW, w: (i - runStart + 1) * colW, num: ch.bookNum });
      runStart = i + 1;
    }
  });

  const peak = Math.max(
    ...chapters.map((ch) =>
      Object.values(character.registerByChapter[ch.id] ?? {}).reduce((a, b) => a + b, 0),
    ),
    1,
  );

  return (
    <div className={`chart scroll-x group-${character.group}`}>
      <svg viewBox={`0 0 ${W} ${H + 18}`} role="img"
        aria-label={`How ${character.short} is named across all ${chapters.length} chapters`}>

        {bookBands.map((b, i) => (
          <rect key={b.num} x={b.x} y={0} width={b.w} height={H}
            fill={i % 2 ? 'var(--bg)' : 'transparent'} opacity={0.55} />
        ))}

        {chapters.map((ch, i) => {
          const mix = character.registerByChapter[ch.id] ?? {};
          const total = Object.values(mix).reduce((a, b) => a + b, 0);
          if (!total) return null;
          const colH = (total / peak) * H;
          let y = H - colH;
          return (
            <g key={ch.id}>
              <title>{`${ch.cite} — ${ch.title}`}</title>
              {ORDER.map((reg) => {
                const n = mix[reg] ?? 0;
                if (!n) return null;
                const h = (n / total) * colH;
                const rect = (
                  <rect key={reg} x={i * colW} y={y} width={Math.max(colW - 0.6, 1)} height={h}
                    fill="var(--group-color)" opacity={OPACITY[reg]} />
                );
                y += h;
                return rect;
              })}
            </g>
          );
        })}

        {bookBands.map((b) => (
          <text key={`l${b.num}`} x={b.x + b.w / 2} y={H + 13} textAnchor="middle"
            style={{ font: '400 9px "Alegreya Sans", sans-serif' }} fill="var(--text-faint)">
            {b.num === 13 ? 'Ep' : b.num}
          </text>
        ))}
      </svg>
    </div>
  );
}

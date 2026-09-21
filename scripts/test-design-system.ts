/**
 * The design system, enforced by the build.
 *
 * `docs/design-system.md` is the specification and `src/app/globals.css` is its
 * implementation. Until now every rule in it was enforced by whoever happened to
 * remember it, and an audit found four leaks by hand. Each check below is one of
 * those leaks, turned into something that fails instead of being noticed:
 *
 *   1. NO UNDEFINED TOKEN     `var(--typo)` renders as nothing at all. Nothing
 *                             else in this repo would notice — not tsc, not the
 *                             build, not a screenshot.
 *   2. NO DEAD TOKEN          `--tracking-wide` sat in :root, read by nobody.
 *   3. NO RAW COLOUR          plate.css hardcoded rgba(43, 36, 29, 0.35): a
 *                             fifth ink, in no token, that the palette did not
 *                             know about.
 *   4. NO SECOND TYPEFACE     One family, no sans. It is the first rule of the
 *                             skill and nothing was holding it.
 *   5. NO SHADOWED ROOT TOKEN `--rule` was declared six times across five
 *                             stylesheets: six places to change, five to forget.
 *   6. NO LITERAL RULE WEIGHT In this system a rule is a design decision, not an
 *                             incidental border, so its weight is a token.
 *   7. NO LITERAL SPACE STEP  Spacing comes from --space-1 … --space-6. Below
 *                             the first step a literal is an optical nudge; at
 *                             or above it, it is a seventh step, unless it
 *                             mirrors px geometry drawn elsewhere and says so.
 *   8. NO COMMENT IN A COMMENT CSS comments do not nest, so one that quotes a
 *                             comment ends early and the rest becomes source.
 *                             It blanked every token in globals.css once, while
 *                             checks 1–7 all passed.
 *
 * Checks 1–4 are the set specified by atlas-203l. Checks 5 and 6 were added so
 * that the other two leaks atlas-3w18 fixed cannot come back silently either,
 * and 7 so that the contract's spacing rule is held by more than its prose.
 *
 * Comments are stripped before anything is scanned, with offsets preserved so
 * line numbers stay true. globals.css explains the retired `--blue` token in a
 * comment that contains a literal `var(--blue)`; a naive scan reports it as an
 * undefined token, which is a false alarm about correct documentation.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const GLOBALS = join(SRC, 'app', 'globals.css');

let failed = 0;

type Leak = { file: string; line: number; text: string };

function report(name: string, leaks: Leak[], detail = 'offender(s)') {
  const ok = leaks.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${ok ? '' : ` — ${leaks.length} ${detail}`}`);
  for (const leak of leaks) console.log(`         ${leak.file}:${leak.line}  ${leak.text}`);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/** Blank out comments in place, so every offset and line number still holds. */
function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

const files = walk(SRC);
const cssFiles = files.filter((f) => f.endsWith('.css')).sort();
const tsxFiles = files.filter((f) => f.endsWith('.tsx')).sort();

type Source = { path: string; short: string; raw: string; code: string };
const read = (path: string): Source => {
  const raw = readFileSync(path, 'utf8');
  return { path, short: relative(ROOT, path), raw, code: stripComments(raw) };
};
const css = cssFiles.map(read);
const tsx = tsxFiles.map(read);
const globals = css.find((f) => f.path === GLOBALS)!;

const lineOf = (text: string, index: number): number => {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
};
const at = (src: Source, index: number): Leak => {
  const line = lineOf(src.code, index);
  return { file: src.short, line, text: (src.raw.split('\n')[line - 1] ?? '').trim().slice(0, 116) };
};

/** A custom-property declaration: `--name:`, not a `var(--name)` reference. */
const DEFINITION = /(?<![\w-])(--[A-Za-z0-9_-]+)\s*:/g;
/** A reference. Group 2 is a comma when the use carries a fallback. */
const REFERENCE = /var\(\s*(--[A-Za-z0-9_-]+)\s*(,?)/g;

console.log('design system — tokens');

// --- 1. No undefined token --------------------------------------------------
// A use WITH a fallback is legitimate: --chart-min is set inline by
// Divergence.tsx and read as var(--chart-min, 900px), which is correct and must
// keep working. Only a use with no fallback needs a declaration to exist.
const defined = new Set<string>();
for (const file of css) for (const m of file.code.matchAll(DEFINITION)) defined.add(m[1]!);

const undefinedUses: Leak[] = [];
for (const file of [...css, ...tsx]) {
  for (const m of file.code.matchAll(REFERENCE)) {
    const hasFallback = m[2] === ',';
    if (!hasFallback && !defined.has(m[1]!)) undefinedUses.push(at(file, m.index!));
  }
}
report('1. every var(--token) without a fallback resolves', undefinedUses, 'unresolved use(s)');

// --- 2. No dead token -------------------------------------------------------
// Tokens declared in globals.css :root / @theme must be read by something.
// Reads are counted as var() references only, which is exact while the codebase
// uses semantic classes rather than Tailwind's generated utilities. If colour or
// size utilities (`bg-cloth`, `text-lg`) start appearing in className strings,
// this check has to count those too or it will condemn a live token.
function tokenBlocks(text: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const head = /(^|[\s}])(:root|@theme)[^{}]*\{/g;
  let m: RegExpExecArray | null;
  while ((m = head.exec(text))) {
    let depth = 1;
    let i = head.lastIndex;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') depth--;
    }
    out.push([head.lastIndex, i - 1]);
  }
  return out;
}
const rootBlocks = tokenBlocks(globals.code);
const inRootBlock = (index: number) => rootBlocks.some(([a, b]) => index >= a && index < b);

const rootTokens = new Map<string, number>();
for (const m of globals.code.matchAll(DEFINITION)) {
  if (inRootBlock(m.index!)) rootTokens.set(m[1]!, m.index!);
}

const referenced = new Set<string>();
for (const file of [...css, ...tsx]) {
  for (const m of file.code.matchAll(REFERENCE)) referenced.add(m[1]!);
}
const deadTokens: Leak[] = [];
for (const [name, index] of rootTokens) {
  if (!referenced.has(name)) deadTokens.push(at(globals, index));
}
report('2. every token declared in :root / @theme is read', deadTokens, 'dead token(s)');

// --- 3. No raw colour outside the palette -----------------------------------
// The exemption is located precisely rather than by skipping globals.css: a raw
// colour is allowed only inside a custom-property declaration in :root or
// @theme, which is where the palette and --paper-texture's grain are declared.
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g;
const rawColours: Leak[] = [];
for (const file of css) {
  for (const m of file.code.matchAll(RAW_COLOUR)) {
    const index = m.index!;
    const start = Math.max(file.code.lastIndexOf(';', index), file.code.lastIndexOf('{', index)) + 1;
    const head = file.code.slice(start, index);
    // A `#` only names a colour in a value position; in a selector it names an id.
    if (!head.includes(':')) continue;
    const isTokenValue = /^\s*--[A-Za-z0-9_-]+\s*:/.test(head);
    if (file.path === GLOBALS && isTokenValue && inRootBlock(index)) continue;
    rawColours.push(at(file, index));
  }
}
report('3. no raw colour outside the palette declarations', rawColours, 'literal colour(s)');

console.log('\ndesign system — type, rules and space');

// --- 4. No second typeface --------------------------------------------------
// One family, no sans: the edition it follows has none, and a label is set as
// letterspaced capitals of the text face rather than as a second family.
const BANNED_FACE = ['sans-serif', 'system-ui', 'ui-sans-serif', '-apple-system',
  'BlinkMacSystemFont', 'Helvetica', 'Arial', 'Segoe', 'Roboto', 'Inter', 'Verdana', 'Tahoma'];
const FONT_TOKEN = /^var\(--font-(display|serif|sans)\)$/;
const faces: Leak[] = [];
for (const file of css) {
  for (const m of file.code.matchAll(/(?<![\w-])(--font-[A-Za-z0-9-]+|font-family)\s*:\s*([^;{}]+)/g)) {
    const [prop, value] = [m[1]!, m[2]!.trim()];
    if (prop === 'font-family') {
      if (!FONT_TOKEN.test(value)) faces.push(at(file, m.index!));
    } else if (BANNED_FACE.some((face) => value.includes(face))) {
      faces.push(at(file, m.index!));
    }
  }
}
for (const file of tsx) {
  for (const m of file.code.matchAll(/fontFamily\s*[:=]\s*['"{]?([^,'"}\n]+)/g)) {
    if (!FONT_TOKEN.test(m[1]!.trim())) faces.push(at(file, m.index!));
  }
}
report('4. one typeface, named only through --font-* tokens', faces, 'stray face(s)');

// --- 5. No shadowed root token ----------------------------------------------
// A token globals.css already declares must not be declared again elsewhere,
// even with the same value. --rule was written out six times, so the decision
// lived in six places and a change would have had to find all of them.
const shadowed: Leak[] = [];
for (const file of css) {
  if (file.path === GLOBALS) continue;
  for (const m of file.code.matchAll(DEFINITION)) {
    if (rootTokens.has(m[1]!)) shadowed.push(at(file, m.index!));
  }
}
report('5. no stylesheet redeclares a globals.css token', shadowed, 'shadowed token(s)');

// --- 6. No literal rule weight ----------------------------------------------
// The paired thick/thin rule is this system's divider, so its weight is a design
// decision with a token (--rule-hair / --rule-thick / --rule-heavy), not a px
// literal repeated across seven stylesheets. Radii are a separate decision and
// are not rules, so border-radius is out of scope here.
const BORDER_DECL = /(^|[;{}])\s*(border[a-z-]*)\s*:\s*([^;{}]*)/g;
const weights: Leak[] = [];
for (const file of css) {
  for (const m of file.code.matchAll(BORDER_DECL)) {
    const [prop, value] = [m[2]!, m[3]!];
    if (prop.includes('radius')) continue;
    // Point at the property, not at the `;` that separates it from the one above.
    if (/\d*\.?\d+px/.test(value)) weights.push(at(file, m.index! + m[0]!.indexOf(prop)));
  }
}
report('6. every rule weight comes from a --rule-* token', weights, 'literal weight(s)');

// --- 7. No literal spacing step ---------------------------------------------
// Spacing comes from --space-1 … --space-6, and a literal is allowed in exactly
// two cases. BELOW the first step (4px, 0.25rem, 0.25em) it is an optical
// adjustment the scale is too coarse to express — the 2px between a figure's
// number and its label, the 1px between stacked rows — and a token for it would
// be a seventh step in disguise. AT OR ABOVE the first step it must be a token,
// unless the value mirrors a coordinate drawn in px elsewhere and says so on its
// own line with `/* geometry: <what it mirrors> */`. A rem token there would
// scale with the reader's font size while its px twin stayed put.
const SPACE_DECL =
  /(^|[;{}])\s*((?:padding|margin|gap|row-gap|column-gap|scroll-margin|scroll-padding)(?:-[a-z]+)*)\s*:\s*([^;{}]*)/g;
/** A length literal, sign dropped: `-10px` is as much a step as `10px`. */
const LENGTH = /(?<![\w.])-?(\d*\.?\d+)(px|rem|em)\b/g;
const FIRST_STEP: Record<string, number> = { px: 4, rem: 0.25, em: 0.25 };
// The reason is required: an empty `geometry:` comment exempts nothing.
const GEOMETRY = /\/\*\s*geometry:\s*(?!\*\/)\S/;
const steps: Leak[] = [];
for (const file of css) {
  for (const m of file.code.matchAll(SPACE_DECL)) {
    const onScale = [...m[3]!.matchAll(LENGTH)].some(([, n, unit]) => Number(n) >= FIRST_STEP[unit!]!);
    if (!onScale) continue;
    const leak = at(file, m.index! + m[0]!.indexOf(m[2]!));
    // The reason is a comment, so it is read from the raw line, not the stripped one.
    if (GEOMETRY.test(file.raw.split('\n')[leak.line - 1] ?? '')) continue;
    steps.push(leak);
  }
}
report('7. every spacing step comes from a --space-* token', steps, 'literal step(s)');

// --- 8. No comment inside a comment -----------------------------------------
// CSS comments do not nest. A comment that quotes a comment, or holds a glob
// such as src/**/*.css (whose `**/` closes it), ends at the first closer inside
// it, and everything after that is parsed as stylesheet source. That happened
// here: a sentence in the globals.css header quoting the geometry marker closed
// the header 25 lines early, the stray prose swallowed @theme and :root, and
// every token on the page went empty while checks 1–7 all passed — they strip
// comments exactly as the browser does, so they cannot see this. Only CSS is
// scanned: the same mistake in TypeScript is a syntax error, which is loud.
// Scanning the raw text for an opener inside a comment's own body catches it.
const nested: Leak[] = [];
for (const file of css) {
  for (const m of file.raw.matchAll(/\/\*([\s\S]*?)\*\//g)) {
    const inner = m[1]!.indexOf('/*');
    if (inner >= 0) nested.push(at(file, m.index! + 2 + inner));
  }
}
report('8. no comment contains a comment', nested, 'nested comment(s)');

console.log(failed === 0 ? '\nall checks passed' : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);

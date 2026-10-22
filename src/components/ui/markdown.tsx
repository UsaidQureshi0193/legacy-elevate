import type { ReactNode } from "react";

/**
 * Small safe markdown renderer for AI output: ### headings, bullets,
 * **Key:** value pairs, **bold** and paragraphs. Output is React elements
 * only, never HTML strings.
 */
type Block =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "list"; items: string[] };

const HEADING = /^#{1,6}\s+(.*)$/;
const BULLET = /^\s*(?:[*\-•]|\d+\.)\s+(.*)$/;
const KEY_VALUE = /^\*\*(.+?):\*\*\s*(.*)$|^\*\*(.+?)\*\*:\s*(.*)$/;

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let list: string[] | null = null;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ kind: "para", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push({ kind: "list", items: list });
    list = null;
  };
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const h = HEADING.exec(line);
    if (h) {
      flushPara();
      flushList();
      blocks.push({ kind: "heading", text: h[1].replace(/\*\*/g, "") });
      continue;
    }
    const b = BULLET.exec(line);
    if (b) {
      flushPara();
      (list ??= []).push(b[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part.replace(/\*+/g, "")}</span>
    ),
  );
}

function Item({ text }: { text: string }) {
  const kv = KEY_VALUE.exec(text);
  if (kv) {
    const key = kv[1] ?? kv[3];
    const value = kv[2] ?? kv[4] ?? "";
    return (
      <li className="flex flex-col gap-0.5 rounded-lg border border-border bg-surface px-3 py-2 sm:flex-row sm:items-baseline sm:gap-2">
        <span className="text-xs font-semibold text-foreground">{key}:</span>
        <span className="num text-sm text-foreground">{inline(value)}</span>
      </li>
    );
  }
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-foreground">
      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{inline(text)}</span>
    </li>
  );
}

export function Markdown({ text, rtl = false }: { text: string; rtl?: boolean }) {
  const blocks = parse(text);
  return (
    <div dir={rtl ? "rtl" : "auto"} className="flex flex-col gap-3">
      {blocks.map((b, i) => {
        if (b.kind === "heading") {
          return (
            <h4 key={i} className="mt-2 border-l-2 border-primary pl-2.5 text-sm font-semibold text-foreground first:mt-0">
              {b.text}
            </h4>
          );
        }
        if (b.kind === "list") {
          return (
            <ul key={i} className="flex flex-col gap-1.5">
              {b.items.map((it, j) => (
                <Item key={j} text={it} />
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-foreground">
            {inline(b.text)}
          </p>
        );
      })}
    </div>
  );
}

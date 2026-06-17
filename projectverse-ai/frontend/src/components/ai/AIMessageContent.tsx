import type { ReactNode } from 'react';

interface AIMessageContentProps {
  content: string;
}

const inline = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^\`]+\`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('\`') && part.endsWith('\`')) {
      return <code key={index} className="rounded bg-background px-1.5 py-0.5 text-[0.9em] font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

export function AIMessageContent({ content }: AIMessageContentProps) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let codeLanguage = '';
  let inCode = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(
      <p key={blocks.length} className="leading-7">
        {inline(paragraph.join(' '))}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(
      <ul key={blocks.length} className="my-2 list-disc space-y-1 pl-5">
        {listItems.map((item, index) => <li key={index}>{inline(item)}</li>)}
      </ul>
    );
    listItems = [];
  };

  const flushCode = () => {
    blocks.push(
      <pre key={blocks.length} className="my-3 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-sm text-zinc-100">
        {codeLanguage && <div className="mb-2 text-xs uppercase text-zinc-400">{codeLanguage}</div>}
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
    codeLines = [];
    codeLanguage = '';
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('\`\`\`')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const Tag = heading[1].length === 1 ? 'h2' : heading[1].length === 2 ? 'h3' : 'h4';
      blocks.push(<Tag key={blocks.length} className="mt-3 font-semibold leading-7">{inline(heading[2])}</Tag>);
      continue;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1]);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  if (inCode) flushCode();

  return <div className="space-y-3 text-sm leading-relaxed">{blocks}</div>;
}

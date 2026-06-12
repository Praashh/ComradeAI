
export function splitByMarkdownSections(text: string): string[] {
  const sections = text.split(/(?=^## )/m).filter((s) => s.trim().length > 0);

  if (sections.length > 1) {
    return sections.map((s) => s.trim());
  }

  // Fallback: split by paragraphs with a max chunk size
  return splitByParagraphs(text, 2000);
}

function splitByParagraphs(text: string, maxChunkLength: number): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxChunkLength) {
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

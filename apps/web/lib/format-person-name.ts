function capitalizeWord(word: string): string {
  if (!word) return word;

  if (word.length === 2 && word.endsWith(".")) {
    return `${word.charAt(0).toUpperCase()}.`;
  }

  if (word.length === 1) {
    return word.toUpperCase();
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeSegment(segment: string): string {
  if (segment.includes("-")) {
    return segment
      .split("-")
      .map((part) => capitalizeWord(part))
      .join("-");
  }

  if (segment.includes("'")) {
    return segment
      .split("'")
      .map((part, index) =>
        index === 0 ? capitalizeWord(part) : part.toLowerCase(),
      )
      .join("'");
  }

  return capitalizeWord(segment);
}

/** e.g. "suprim khatri" → "Suprim Khatri" */
export function formatPersonName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalizeSegment)
    .join(" ");
}

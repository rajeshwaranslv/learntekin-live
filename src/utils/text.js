const collapseWhitespace = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

export const toPlainText = (value) => {
  const source = String(value || "").trim();
  if (!source) {
    return "";
  }

  if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
    const parser = new window.DOMParser();
    const documentFragment = parser.parseFromString(source, "text/html");
    return collapseWhitespace(documentFragment.body.textContent || "");
  }

  return collapseWhitespace(
    source
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
  );
};

export const toDisplayLabel = (value) => {
  const text = toPlainText(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

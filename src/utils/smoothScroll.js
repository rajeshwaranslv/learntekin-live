export const getHeaderOffset = () => {
  const header = document.getElementById("header");
  return header ? Math.ceil(header.getBoundingClientRect().height) + 10 : 82;
};

export const scrollToHash = (hash, behavior = "smooth") => {
  if (!hash || hash === "#") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id) || document.querySelector(hash);
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
};

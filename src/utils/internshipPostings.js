export const normalizeInternshipPostings = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.postings)) {
    return payload.postings;
  }

  if (Array.isArray(payload?.internships)) {
    return payload.internships;
  }

  return [];
};

export const getInternshipPostingId = (posting = {}) =>
  posting._id || posting.id || posting.postingId || "";

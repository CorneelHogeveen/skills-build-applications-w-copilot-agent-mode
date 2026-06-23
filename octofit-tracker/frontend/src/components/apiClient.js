export const isCodespaceNameConfigured = Boolean(import.meta.env.VITE_CODESPACE_NAME?.trim());

export function normalizeCollectionResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      pagination: null,
    };
  }

  if (!payload || typeof payload !== 'object') {
    return {
      items: [],
      pagination: null,
    };
  }

  const candidates = ['results', 'data', 'items'];
  const normalizedItems = candidates
    .map((key) => payload[key])
    .find((value) => Array.isArray(value));

  const pagination =
    Object.prototype.hasOwnProperty.call(payload, 'count') ||
    Object.prototype.hasOwnProperty.call(payload, 'next') ||
    Object.prototype.hasOwnProperty.call(payload, 'previous')
      ? {
          count: typeof payload.count === 'number' ? payload.count : null,
          next: typeof payload.next === 'string' ? payload.next : null,
          previous: typeof payload.previous === 'string' ? payload.previous : null,
        }
      : null;

  if (Array.isArray(normalizedItems)) {
    return {
      items: normalizedItems,
      pagination,
    };
  }

  if (payload.data && typeof payload.data === 'object') {
    return {
      items: [payload.data],
      pagination,
    };
  }

  return {
    items: [],
    pagination,
  };
}

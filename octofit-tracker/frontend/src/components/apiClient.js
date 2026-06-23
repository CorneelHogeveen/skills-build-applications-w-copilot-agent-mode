const rawCodespaceName = import.meta.env.VITE_CODESPACE_NAME;
const codespaceName = typeof rawCodespaceName === 'string' ? rawCodespaceName.trim() : '';

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : '/api';

export const isCodespaceNameConfigured = Boolean(codespaceName);

export function buildCollectionUrl(resourcePath) {
  const cleanPath = resourcePath.replace(/^\/+|\/+$/g, '');
  return `${apiBaseUrl}/${cleanPath}/`;
}

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

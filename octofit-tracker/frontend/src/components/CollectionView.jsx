import { useEffect, useMemo, useState } from 'react';
import {
  isCodespaceNameConfigured,
  normalizeCollectionResponse,
  resolveEndpointUrl,
} from './apiClient';

function prettyValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function guessColumns(items) {
  const keySet = new Set();

  items.slice(0, 5).forEach((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      Object.keys(item).forEach((key) => {
        keySet.add(key);
      });
    }
  });

  const priority = ['_id', 'name', 'email', 'points', 'type', 'scope', 'generatedAt'];
  const ordered = [];

  priority.forEach((key) => {
    if (keySet.has(key)) {
      ordered.push(key);
      keySet.delete(key);
    }
  });

  return ordered.concat(Array.from(keySet)).slice(0, 8);
}

export default function CollectionView({ title, endpointPath, emptyLabel }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = useMemo(() => resolveEndpointUrl(endpointPath), [endpointPath]);
  const columns = useMemo(() => guessColumns(items), [items]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(endpoint, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const preview = (await response.text()).slice(0, 80);
          throw new Error(
            `Expected JSON from ${endpoint}, received ${contentType || 'unknown content type'} (${preview})`
          );
        }

        const payload = await response.json();
        const normalized = normalizeCollectionResponse(payload);
        setItems(normalized.items);
        setPagination(normalized.pagination);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load data.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [endpoint]);

  return (
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
        <div>
          <h2 className="h4 mb-1">{title}</h2>
          <p className="text-muted mb-0">Endpoint: {endpoint}</p>
        </div>
        {!isCodespaceNameConfigured && (
          <div className="alert alert-warning py-2 px-3 mb-0" role="status">
            VITE_CODESPACE_NAME ontbreekt. Fallback naar /api is actief.
          </div>
        )}
      </div>

      {isLoading && <div className="alert alert-info">Data laden...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && items.length === 0 && (
        <div className="alert alert-secondary">{emptyLabel}</div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, rowIndex) => (
                <tr key={item?._id || `${endpointPath}-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={`${column}-${rowIndex}`}>{prettyValue(item?.[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && (
        <div className="d-flex flex-wrap gap-2">
          <span className="badge text-bg-light">count: {pagination.count ?? 'n/a'}</span>
          <span className="badge text-bg-light">previous: {pagination.previous ? 'yes' : 'no'}</span>
          <span className="badge text-bg-light">next: {pagination.next ? 'yes' : 'no'}</span>
        </div>
      )}
    </section>
  );
}

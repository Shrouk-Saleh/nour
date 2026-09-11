// Centralized fetch wrapper. Every API module goes through this so
// base URL, error handling, and JSON parsing live in one place.

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const token = localStorage.getItem('sprout-token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      signal: controller.signal,
      ...options,
    });

    let body = null;
    try {
      body = await res.json();
    } catch {
      // no JSON body
    }

    if (!res.ok) {
      throw new ApiRequestError(body?.error || `Request failed (${res.status})`, res.status);
    }

    return body?.data ?? body;
  } finally {
    clearTimeout(timeout);
  }
}

// Like request() but returns the full JSON body instead of stripping to body.data
async function requestRaw(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const token = localStorage.getItem('sprout-token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      signal: controller.signal,
      ...options,
    });

    let body = null;
    try { body = await res.json(); } catch { /* no json */ }

    if (!res.ok) {
      throw new ApiRequestError(body?.error || `Request failed (${res.status})`, res.status);
    }

    return body; // full body, not just body.data
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data ?? {}) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  // Returns the full body (not stripped to .data) — for endpoints that include extra fields like reward
  rawPost: (path, data) => requestRaw(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
};

export { ApiRequestError };

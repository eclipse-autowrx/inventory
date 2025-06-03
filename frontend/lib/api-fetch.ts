type CustomRequestInit = Omit<RequestInit, 'body'> & {
  body?: {
    [key: string | number | symbol]: unknown;
  };
};

export default function apiFetch(url: string, options: CustomRequestInit = {}) {
  return fetch(url, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

const BASE_URL = "https://localhost:7111/api/";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Unknown error");
  }
  return res.status === 204 ? null : await res.json(); // handle no content (204)
};

const makeHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  get: async (endpoint: string, token?: string) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "GET",
      headers: makeHeaders(token),
    });
    return handleResponse(res);
  },

  post: async (endpoint: string, body: object, token?: string) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers: makeHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint: string, body: object, token?: string) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "PUT",
      headers: makeHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (endpoint: string, token?: string) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "DELETE",
      headers: makeHeaders(token),
    });
    return handleResponse(res);
  },
};

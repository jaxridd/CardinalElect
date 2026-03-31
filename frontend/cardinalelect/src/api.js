const BASE_URL = "http://localhost:8000";

export const api = {
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Something went wrong");
    }
    return res.json();
  },
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Something went wrong");
    }
    return res.json();
  },
};

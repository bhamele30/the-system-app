const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  return `${base}${path}`;
}

const USER_ID_KEY = 'system-user-id';

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function saveJSON<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function loadJSON<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

export async function getGeoJSON<T = any>(url: string) {
    const res = await fetch(url);
    return res.json() as T;
}
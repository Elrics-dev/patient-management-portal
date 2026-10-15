const API_BASE_URL = (window.ELRICS_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
const ACCESS_KEY = 'elrics_access_token';
const REFRESH_KEY = 'elrics_refresh_token';

export function getAccessToken() { return localStorage.getItem(ACCESS_KEY); }
export function isAuthenticated() { return Boolean(getAccessToken()); }

async function request(path, options = {}, retry = true) {
    const headers = { 'Accept': 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    } catch {
        throw new Error('Cannot connect to the backend. Check that Django is running and the API URL is correct.');
    }
    if (response.status === 401 && retry && localStorage.getItem(REFRESH_KEY) && !path.includes('/auth/login/')) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return request(path, options, false);
    }
    const payload = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) { clearTokens(); }
        const detail = payload?.detail || Object.entries(payload || {}).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : JSON.stringify(value)}`).join(' ') || `Request failed (${response.status})`;
        throw new Error(detail);
    }
    return payload;
}

function clearTokens() { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); }

async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: localStorage.getItem(REFRESH_KEY) })
        });
        if (!response.ok) { clearTokens(); return false; }
        const data = await response.json();
        localStorage.setItem(ACCESS_KEY, data.access);
        return true;
    } catch { clearTokens(); return false; }
}

export async function login(credentials) {
    const data = await request('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }, false);
    localStorage.setItem(ACCESS_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
    return data.user;
}
export async function logout() { clearTokens(); }
export async function register(user) { return request('/auth/register/', { method: 'POST', body: JSON.stringify(user) }, false); }
export async function getCurrentUser() { return request('/auth/me/'); }
export async function getPatients() { return request('/patients/'); }
export async function getPatient(id) { return request(`/patients/${encodeURIComponent(id)}/`); }
export async function createPatient(patientData) { return request('/patients/', { method: 'POST', body: JSON.stringify(normalizePatient(patientData)) }); }
export async function updatePatient(id, patientData) { return request(`/patients/${encodeURIComponent(id)}/`, { method: 'PATCH', body: JSON.stringify(normalizePatient(patientData)) }); }
export async function deletePatient(id) { return request(`/patients/${encodeURIComponent(id)}/`, { method: 'DELETE' }); }
export async function searchPatients(query) {
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    return request(`/patients/${params.size ? `?${params}` : ''}`);
}
function normalizePatient(data) {
    const normalized = { ...data };
    if (normalized.fullName !== undefined) { normalized.name = normalized.fullName; delete normalized.fullName; }
    return normalized;
}

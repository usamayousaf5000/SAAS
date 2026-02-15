const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:3001/api';

export const api = {
    async request(endpoint, options = {}) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response;
        try {
            response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });
        } catch (err) {
            if (err?.name === 'TypeError' && err?.message?.toLowerCase().includes('fetch')) {
                throw new Error(`Can't reach the API. Is the backend running? (${API_URL.replace(/\/api\/?$/, '')})`);
            }
            throw err;
        }

        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0]?.msg || `API Error ${response.status}`);
        }

        return data;
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    },

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    },
};

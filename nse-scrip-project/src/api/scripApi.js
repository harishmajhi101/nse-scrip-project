import { API_BASE_URL } from '../config/apiConfig';

async function getJson(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        options
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed: ${response.status}`
        );
    }

    return data;
}

export async function getMaster() {
    const result = await getJson('/master');
    return result.data || [];
}

export async function getStaging() {
    const result = await getJson('/staging');
    return result.data || [];
}

export async function getHistory() {
    const result = await getJson('/history');
    return result.data || [];
}

export async function checkHealth() {
    return getJson('/health');
}

export async function runTier1() {
    return getJson('/tier1/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

export async function createStaging(data) {
    return getJson('/staging', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export async function createMaster(data) {
    return getJson('/master', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
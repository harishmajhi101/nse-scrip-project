const API_BASE_URL = '/api';

async function getJson(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('API REQUEST:', url);

    const response = await fetch(url, options);

    console.log('API STATUS:', response.status);

    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error('Invalid response from API');
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed: ${response.status}`
        );
    }

    return data;
}


// =========================
// MASTER
// =========================

export async function getMaster() {
    const response = await getJson('/master');
    return response.data || [];
}


// =========================
// STAGING
// =========================

export async function getStaging() {
    const response = await getJson('/staging');
    return response.data || [];
}


// =========================
// HISTORY
// =========================

export async function getHistory() {
    const response = await getJson('/history');
    return response.data || [];
}


// =========================
// HEALTH
// =========================

export async function checkHealth() {
    return getJson('/health');
}


// =========================
// TIER 1
// =========================

export async function runTier1() {
    return getJson('/tier1/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}


// =========================
// CREATE STAGING
// =========================

export async function createStaging(data) {
    return getJson('/staging', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


// =========================
// CREATE MASTER
// =========================

export async function createMaster(data) {
    return getJson('/master', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
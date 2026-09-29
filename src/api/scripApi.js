// ========================================
// API CONFIGURATION
// ========================================

const CATALYST_API =
    'https://nse-scrip-master-auto-update-60089696477.development.catalystserverless.in';

// Local development uses the Vite proxy.
// Slate/production uses the Catalyst API directly.
const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocal
    ? '/api'
    : `${CATALYST_API}/api`;


// ========================================
// COMMON API REQUEST
// ========================================

async function getJson(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('API REQUEST:', url);

    try {
        const response = await fetch(url, options);

        console.log('API STATUS:', response.status);

        const text = await response.text();

        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch (parseError) {
            console.error('API RESPONSE IS NOT JSON:', text);

            throw new Error(
                `Invalid response from API (${response.status})`
            );
        }

        if (!response.ok) {
            throw new Error(
                data?.message ||
                data?.error ||
                `Request failed: ${response.status}`
            );
        }

        return data;

    } catch (error) {
        console.error('API REQUEST ERROR:', error);

        throw error;
    }
}


// ========================================
// MASTER
// ========================================

export async function getMaster() {
    const response = await getJson('/master');

    return response.data || [];
}


// ========================================
// STAGING
// ========================================

export async function getStaging() {
    const response = await getJson('/staging');

    return response.data || [];
}


// ========================================
// HISTORY
// ========================================

export async function getHistory() {
    const response = await getJson('/history');

    return response.data || [];
}


// ========================================
// HEALTH
// ========================================

export async function checkHealth() {
    return getJson('/health');
}


// ========================================
// TIER 1
// ========================================

export async function runTier1() {
    return getJson('/tier1/run', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({})
    });
}


// ========================================
// CREATE STAGING
// ========================================

export async function createStaging(data) {
    return getJson('/staging', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    });
}


// ========================================
// CREATE MASTER
// ========================================

export async function createMaster(data) {
    return getJson('/master', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    });
}
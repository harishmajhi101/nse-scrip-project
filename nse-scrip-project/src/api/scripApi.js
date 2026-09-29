import { API_BASE_URL } from '../config/apiConfig';


// ==================================================
// GENERIC API HELPER
// ==================================================

async function getJson(endpoint, options = {}) {

    const url = `${API_BASE_URL}${endpoint}`;

    console.log('API REQUEST:', url);
    console.log('API METHOD:', options.method || 'GET');

    try {

        const response = await fetch(url, {
            ...options,
            headers: {
                ...(options.body
                    ? { 'Content-Type': 'application/json' }
                    : {}),
                ...(options.headers || {})
            }
        });

        console.log('API STATUS:', response.status);

        const text = await response.text();

        console.log('API RESPONSE:', text);

        let data = {};

        try {

            data = text
                ? JSON.parse(text)
                : {};

        } catch (parseError) {

            console.error(
                'API JSON PARSE ERROR:',
                parseError
            );

            throw new Error(
                'Invalid response from API'
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

        console.error(
            'API REQUEST ERROR:',
            error
        );

        throw error;
    }
}


// ==================================================
// MASTER
// ==================================================

export async function getMaster() {

    const response =
        await getJson('/master');

    return response.data || [];
}


// ==================================================
// STAGING
// ==================================================

export async function getStaging() {

    const response =
        await getJson('/staging');

    return response.data || [];
}


// ==================================================
// HISTORY
// ==================================================

export async function getHistory() {

    const response =
        await getJson('/history');

    return response.data || [];
}


// ==================================================
// HEALTH
// ==================================================

export async function checkHealth() {

    return await getJson('/health');
}


// ==================================================
// TIER 1
// ==================================================

export async function runTier1() {

    return await getJson(
        '/tier1/run',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
    );
}


// ==================================================
// CREATE STAGING
// ==================================================

export async function createStaging(data) {

    return await getJson(
        '/staging',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );
}


// ==================================================
// CREATE MASTER
// ==================================================

export async function createMaster(data) {

    return await getJson(
        '/master',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );
}
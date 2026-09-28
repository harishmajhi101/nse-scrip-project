const API_BASE_URL =
    import.meta.env.VITE_SCRIP_API_URL;


async function getJson(url, options = {}) {

    const response =
        await fetch(url, options);


    const json =
        await response.json()
            .catch(() => ({}));


    if (!response.ok) {

        throw new Error(
            json?.message ||
            json?.error ||
            `Request failed: ${response.status}`
        );

    }


    return json;

}


export async function getMaster() {
    const response = await fetch(`${API_BASE_URL}/master`);
    const json = await response.json();
    return json.data || [];
}


export async function getStaging() {

    const json =
        await getJson(
            `${API_BASE_URL}/staging`
        );

    return json.data || [];

}


export async function getHistory() {

    const json =
        await getJson(
            `${API_BASE_URL}/history`
        );

    return json.data || [];

}


export async function checkHealth() {

    return getJson(
        `${API_BASE_URL}/health`
    );

}


export async function runTier1() {

    return getJson(
        `${API_BASE_URL}/tier1/run`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({})
        }
    );

}


export async function createStaging(data) {

    return getJson(
        `${API_BASE_URL}/staging`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify(data)
        }
    );

}


export async function createMaster(data) {

    return getJson(
        `${API_BASE_URL}/master`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify(data)
        }
    );

}
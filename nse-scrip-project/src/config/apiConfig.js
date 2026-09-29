// export const API_BASE_URL =
    // 'https://nse-scrip-master-auto-update-60089696477.development.catalystserverless.in/api';

    const CATALYST_API =
    'https://nse-scrip-master-auto-update-60089696477.development.catalystserverless.in';

const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocal
    ? '/api'
    : `${CATALYST_API}/api`;
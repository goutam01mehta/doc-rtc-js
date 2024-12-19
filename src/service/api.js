import axios from 'axios';

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const API_HOST = process.env.API_HOST;

export async function getPageContent(orgId, pageId) {
    if (!AUTH_TOKEN) throw new Error("No AUTH_TOKEN found");
    if (!API_HOST) throw new Error("No API_HOST found");

    const url = `${API_HOST}/orgs/${orgId}/pages/${pageId}/content`;
    console.log("GETP_URL", url);

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'techdoc_auth': AUTH_TOKEN,
    };

    try {
        const response = await axios.get(url, { headers });

        return response.data.contents;
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }
}

export async function updatePage(orgId, pageId, html) {
    if (!AUTH_TOKEN) throw new Error("No AUTH_TOKEN found");
    if (!API_HOST) throw new Error("No API_HOST found");
    const url = `${API_HOST}/orgs/${orgId}/pages/${pageId}`;
    console.log("UPDATE_URL", url);

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'techdoc_auth': AUTH_TOKEN,
        'Content-Type': 'application/json'
    };
    const body = {
        contents: html
    };
    const jsonBody = JSON.stringify(body);
    try {
        const response = await axios.put(url, jsonBody, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

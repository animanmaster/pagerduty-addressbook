export default class ApiClient {
    private baseUrl: string;
    private apiKey: string;

    constructor(apiKey: string, baseUrl: string = 'https://api.pagerduty.com') {
        if (!apiKey) {
            throw new Error('apiKey cannot be empty');
        }
        if (!baseUrl) {
            throw new Error('baseUrl cannot be empty');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    }

    protected async fetch<T>(endpoint: string, method: string = 'GET', params: Record<string, any> = {}, headers: Record<string, string> = {}): Promise<T> {
        const queryParams = method === 'GET' ? `?${new URLSearchParams(params).toString()}` : '';
        const url = new URL(`${this.baseUrl}/${endpoint}${queryParams}`);

        const response = await fetch(url.toString(), {
            method: method,
            headers: {
                'Authorization': `Token token=${this.apiKey}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
            },
            body: method !== 'GET' ? JSON.stringify(params) : undefined
        });

        if (!response.ok) {
            throw new Error(`${response.status} error fetching ${endpoint}: ${response.statusText} body: ${await response.text()}`);
        }

        return await response.json() as T;
    }

    async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        return this.fetch<T>(endpoint, 'GET', params);
    }
}
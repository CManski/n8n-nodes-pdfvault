"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfVaultApi = void 0;
class PdfVaultApi {
    constructor() {
        this.name = 'pdfVaultApi';
        this.displayName = 'PDF Vault API';
        this.documentationUrl = 'https://pdfvault.app/docs/api';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                placeholder: 'pv_live_...',
                description: 'Your PDF Vault API key. Generate one at pdfvault.app under API Dashboard. Required for PDF, AI, QR, URL, and Template operations.',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                placeholder: 'eyJhbGciOiJIUzI1NiIs...',
                description: 'Optional. Supabase access token for eSign, Team, Workspace, Webhook, Bulk eSign, and Comment operations. Get this from your browser session or Supabase auth.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-API-Key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.pdfvault.app',
                url: '/v1/balance',
                method: 'GET',
            },
        };
    }
}
exports.PdfVaultApi = PdfVaultApi;
//# sourceMappingURL=PdfVaultApi.credentials.js.map
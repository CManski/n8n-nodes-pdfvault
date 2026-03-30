import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PdfVaultApi implements ICredentialType {
	name = 'pdfVaultApi';
	displayName = 'PDF Vault API';
	documentationUrl = 'https://pdfvault.app/docs/api';

	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pdfvault.app',
			url: '/v1/balance',
			method: 'GET',
		},
	};
}

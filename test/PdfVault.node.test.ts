import { PdfVault } from '../nodes/PdfVault/PdfVault.node';
import { PdfVaultApi } from '../credentials/PdfVaultApi.credentials';

describe('PdfVault Node', () => {
	let node: PdfVault;

	beforeEach(() => {
		node = new PdfVault();
	});

	it('should have a valid description', () => {
		expect(node.description).toBeDefined();
		expect(node.description.displayName).toBe('PDF Vault');
		expect(node.description.name).toBe('pdfVault');
		expect(node.description.version).toBe(1);
	});

	it('should require pdfVaultApi credentials', () => {
		expect(node.description.credentials).toBeDefined();
		expect(node.description.credentials).toHaveLength(1);
		expect(node.description.credentials![0].name).toBe('pdfVaultApi');
		expect(node.description.credentials![0].required).toBe(true);
	});

	it('should define all 11 resources', () => {
		const resourceProp = node.description.properties.find((p) => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		expect(resourceProp!.type).toBe('options');

		const options = (resourceProp as any).options;
		const resourceValues = options.map((o: any) => o.value);
		expect(resourceValues).toContain('pdf');
		expect(resourceValues).toContain('template');
		expect(resourceValues).toContain('qr');
		expect(resourceValues).toContain('url');
		expect(resourceValues).toContain('ai');
		expect(resourceValues).toContain('esign');
		expect(resourceValues).toContain('webhook');
		expect(resourceValues).toContain('team');
		expect(resourceValues).toContain('workspace');
		expect(resourceValues).toContain('esignBulk');
		expect(resourceValues).toContain('comment');
		expect(options).toHaveLength(11);
	});

	it('should define all 13 PDF operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('pdf'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);

		expect(opValues).toContain('merge');
		expect(opValues).toContain('split');
		expect(opValues).toContain('compress');
		expect(opValues).toContain('watermark');
		expect(opValues).toContain('flatten');
		expect(opValues).toContain('metadata');
		expect(opValues).toContain('pagenumbers');
		expect(opValues).toContain('image');
		expect(opValues).toContain('crop');
		expect(opValues).toContain('deletePages');
		expect(opValues).toContain('rotate');
		expect(opValues).toContain('imageToPdf');
		expect(opValues).toContain('urlToPdf');
		expect(options).toHaveLength(13);
	});

	it('should define all 7 template operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('template'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('generate');
		expect(opValues).toContain('list');
		expect(opValues).toContain('get');
		expect(opValues).toContain('upload');
		expect(opValues).toContain('update');
		expect(opValues).toContain('delete');
		expect(opValues).toContain('detect');
		expect(options).toHaveLength(7);
	});

	it('should define all 7 QR code operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('qr'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('update');
		expect(opValues).toContain('list');
		expect(opValues).toContain('get');
		expect(opValues).toContain('getImage');
		expect(opValues).toContain('stats');
		expect(opValues).toContain('delete');
		expect(options).toHaveLength(7);
	});

	it('should define all 6 short URL operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('url'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('get');
		expect(opValues).toContain('stats');
		expect(opValues).toContain('update');
		expect(opValues).toContain('delete');
		expect(options).toHaveLength(6);
	});

	it('should define all 7 AI operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('ai'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('summarize');
		expect(opValues).toContain('chat');
		expect(opValues).toContain('extract');
		expect(opValues).toContain('classify');
		expect(opValues).toContain('redact');
		expect(opValues).toContain('translate');
		expect(opValues).toContain('analyzeContract');
		expect(options).toHaveLength(7);
	});

	it('should define all 6 eSign operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('esign'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('cancel');
		expect(opValues).toContain('downloadSigned');
		expect(opValues).toContain('downloadCertificate');
		expect(opValues).toContain('audit');
		expect(options).toHaveLength(6);
	});

	it('should define all 5 webhook operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('webhook'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('update');
		expect(opValues).toContain('delete');
		expect(opValues).toContain('test');
		expect(options).toHaveLength(5);
	});

	it('should define all 8 team operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('team'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('get');
		expect(opValues).toContain('update');
		expect(opValues).toContain('inviteMember');
		expect(opValues).toContain('listMembers');
		expect(opValues).toContain('updateMember');
		expect(opValues).toContain('removeMember');
		expect(opValues).toContain('acceptInvite');
		expect(options).toHaveLength(8);
	});

	it('should define all 12 workspace operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('workspace'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('update');
		expect(opValues).toContain('delete');
		expect(opValues).toContain('inviteMember');
		expect(opValues).toContain('removeMember');
		expect(opValues).toContain('updateMember');
		expect(opValues).toContain('acceptInvite');
		expect(opValues).toContain('uploadFile');
		expect(opValues).toContain('listFiles');
		expect(opValues).toContain('deleteFile');
		expect(opValues).toContain('downloadFile');
		expect(options).toHaveLength(12);
	});

	it('should define all 5 eSign bulk operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('esignBulk'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('get');
		expect(opValues).toContain('remind');
		expect(opValues).toContain('cancel');
		expect(options).toHaveLength(5);
	});

	it('should define all 6 comment operations', () => {
		const operationProp = node.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('comment'),
		);
		expect(operationProp).toBeDefined();

		const options = (operationProp as any).options;
		const opValues = options.map((o: any) => o.value);
		expect(opValues).toContain('create');
		expect(opValues).toContain('list');
		expect(opValues).toContain('reply');
		expect(opValues).toContain('update');
		expect(opValues).toContain('delete');
		expect(opValues).toContain('resolve');
		expect(options).toHaveLength(6);
	});

	it('should have an execute function', () => {
		expect(typeof node.execute).toBe('function');
	});

	it('should have proper input/output configuration', () => {
		expect(node.description.inputs).toBeDefined();
		expect(node.description.outputs).toBeDefined();
	});

	it('should set the subtitle to show operation and resource', () => {
		expect(node.description.subtitle).toBe('={{$parameter["operation"] + ": " + $parameter["resource"]}}');
	});
});

describe('PdfVaultApi Credentials', () => {
	let credentials: PdfVaultApi;

	beforeEach(() => {
		credentials = new PdfVaultApi();
	});

	it('should have the correct name', () => {
		expect(credentials.name).toBe('pdfVaultApi');
		expect(credentials.displayName).toBe('PDF Vault API');
	});

	it('should define API Key and Access Token properties', () => {
		expect(credentials.properties).toHaveLength(2);

		const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
		expect(apiKeyProp).toBeDefined();
		expect(apiKeyProp!.type).toBe('string');
		expect(apiKeyProp!.typeOptions?.password).toBe(true);

		const accessTokenProp = credentials.properties.find((p) => p.name === 'accessToken');
		expect(accessTokenProp).toBeDefined();
		expect(accessTokenProp!.type).toBe('string');
		expect(accessTokenProp!.typeOptions?.password).toBe(true);
	});

	it('should authenticate via X-API-Key header', () => {
		expect(credentials.authenticate).toEqual({
			type: 'generic',
			properties: {
				headers: {
					'X-API-Key': '={{$credentials.apiKey}}',
				},
			},
		});
	});

	it('should test credentials against /v1/balance', () => {
		expect(credentials.test).toEqual({
			request: {
				baseURL: 'https://api.pdfvault.app',
				url: '/v1/balance',
				method: 'GET',
			},
		});
	});
});

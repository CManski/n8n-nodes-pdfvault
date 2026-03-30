import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultApiRequest } from '../GenericFunctions';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['webhook'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Register a new webhook endpoint', action: 'Create a webhook' },
			{ name: 'Delete', value: 'delete', description: 'Delete a webhook', action: 'Delete a webhook' },
			{ name: 'List', value: 'list', description: 'List all webhooks', action: 'List webhooks' },
			{ name: 'Test', value: 'test', description: 'Send a test event to a webhook', action: 'Test a webhook' },
			{ name: 'Update', value: 'update', description: 'Update a webhook', action: 'Update a webhook' },
		],
		default: 'create',
	},
];

export const webhookFields: INodeProperties[] = [
	// Create — URL
	{
		displayName: 'Webhook URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'The URL that will receive webhook POST requests',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},
	// Create — Events
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		options: [
			{ name: 'API Processed', value: 'api.processed' },
			{ name: 'eSign Completed', value: 'esign.completed' },
			{ name: 'eSign Signed', value: 'esign.signed' },
			{ name: 'QR Scanned', value: 'qr.scanned' },
			{ name: 'Template Generated', value: 'template.generated' },
			{ name: 'URL Clicked', value: 'url.clicked' },
			{ name: 'Vault Accessed', value: 'vault.accessed' },
			{ name: 'Vault Shared', value: 'vault.shared' },
		],
		default: [],
		description: 'Events that trigger this webhook',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},
	// Create — Description (optional)
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},

	// ID field for get, update, delete, test
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['update', 'delete', 'test'] } },
	},

	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['webhook'], operation: ['update'] } },
		options: [
			{ displayName: 'URL', name: 'url', type: 'string', default: '' },
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'API Processed', value: 'api.processed' },
					{ name: 'eSign Completed', value: 'esign.completed' },
					{ name: 'eSign Signed', value: 'esign.signed' },
					{ name: 'QR Scanned', value: 'qr.scanned' },
					{ name: 'Template Generated', value: 'template.generated' },
					{ name: 'URL Clicked', value: 'url.clicked' },
					{ name: 'Vault Accessed', value: 'vault.accessed' },
					{ name: 'Vault Shared', value: 'vault.shared' },
				],
				default: [],
			},
			{ displayName: 'Active', name: 'active', type: 'boolean', default: true },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
		],
	},
];

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'create') {
		const url = this.getNodeParameter('url', itemIndex) as string;
		const events = this.getNodeParameter('events', itemIndex) as string[];
		const description = this.getNodeParameter('description', itemIndex) as string;

		const body: IDataObject = { url, events };
		if (description) body.description = description;

		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/webhooks', body);
		returnData.push({ json: response });

	} else if (operation === 'list') {
		const response = await pdfVaultApiRequest.call(this, 'GET', '/v1/webhooks');
		const webhooks = (response.webhooks ?? response) as IDataObject[];
		if (Array.isArray(webhooks)) {
			for (const wh of webhooks) {
				returnData.push({ json: wh });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const response = await pdfVaultApiRequest.call(this, 'PATCH', `/v1/webhooks/${webhookId}`, updateFields);
		returnData.push({ json: response });

	} else if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'DELETE', `/v1/webhooks/${webhookId}`);
		returnData.push({ json: response });

	} else if (operation === 'test') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', `/v1/webhooks/${webhookId}/test`);
		returnData.push({ json: response });
	}

	return returnData;
}

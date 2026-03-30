import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultApiRequest, downloadPdfResult } from '../GenericFunctions';

export const qrOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['qr'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a QR code', action: 'Create a QR code' },
			{ name: 'Delete', value: 'delete', description: 'Delete a QR code', action: 'Delete a QR code' },
			{ name: 'Get', value: 'get', description: 'Get QR code details', action: 'Get QR code details' },
			{ name: 'Get Image', value: 'getImage', description: 'Download QR code as SVG image', action: 'Download QR code image' },
			{ name: 'List', value: 'list', description: 'List all QR codes', action: 'List QR codes' },
			{ name: 'Stats', value: 'stats', description: 'Get scan analytics for a QR code', action: 'Get QR code stats' },
			{ name: 'Update', value: 'update', description: 'Update a QR code', action: 'Update a QR code' },
		],
		default: 'create',
	},
];

export const qrFields: INodeProperties[] = [
	// Create
	{
		displayName: 'Destination URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		displayOptions: { show: { resource: ['qr'], operation: ['create'] } },
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['qr'], operation: ['create'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Dynamic', value: 'dynamic', description: 'Editable destination URL with scan tracking' },
			{ name: 'Static', value: 'static', description: 'Fixed destination URL, no tracking' },
		],
		default: 'dynamic',
		displayOptions: { show: { resource: ['qr'], operation: ['create'] } },
	},

	// Get, Stats, Update, Delete — ID
	{
		displayName: 'QR Code ID',
		name: 'qrId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['qr'], operation: ['get', 'stats', 'update', 'delete', 'getImage'] } },
	},

	// Stats — Days
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		default: 30,
		description: 'Number of days of analytics to retrieve',
		displayOptions: { show: { resource: ['qr'], operation: ['stats'] } },
	},

	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['qr'], operation: ['update'] } },
		options: [
			{ displayName: 'Destination URL', name: 'url', type: 'string', default: '' },
			{ displayName: 'Label', name: 'label', type: 'string', default: '' },
			{ displayName: 'Active', name: 'active', type: 'boolean', default: true },
		],
	},
];

export async function executeQrOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'create') {
		const url = this.getNodeParameter('url', itemIndex) as string;
		const label = this.getNodeParameter('label', itemIndex) as string;
		const type = this.getNodeParameter('type', itemIndex) as string;

		const body: IDataObject = { url, type };
		if (label) body.label = label;

		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/qr', body);
		returnData.push({ json: response });

	} else if (operation === 'list') {
		const response = await pdfVaultApiRequest.call(this, 'GET', '/v1/qr');
		const codes = (response.qrCodes ?? response) as IDataObject[];
		if (Array.isArray(codes)) {
			for (const qr of codes) {
				returnData.push({ json: qr });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'get') {
		const qrId = this.getNodeParameter('qrId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'GET', `/v1/qr/${qrId}`);
		returnData.push({ json: response });

	} else if (operation === 'stats') {
		const qrId = this.getNodeParameter('qrId', itemIndex) as string;
		const days = this.getNodeParameter('days', itemIndex) as number;
		const response = await pdfVaultApiRequest.call(this, 'GET', `/v1/qr/${qrId}/stats`, undefined, { days });
		returnData.push({ json: response });

	} else if (operation === 'update') {
		const qrId = this.getNodeParameter('qrId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const response = await pdfVaultApiRequest.call(this, 'PATCH', `/v1/qr/${qrId}`, updateFields);
		returnData.push({ json: response });

	} else if (operation === 'delete') {
		const qrId = this.getNodeParameter('qrId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'DELETE', `/v1/qr/${qrId}`);
		returnData.push({ json: response });

	} else if (operation === 'getImage') {
		const qrId = this.getNodeParameter('qrId', itemIndex) as string;
		const svgBuffer = await downloadPdfResult.call(this, `/v1/qr/${qrId}/image`);
		const binaryItem = await this.helpers.prepareBinaryData(svgBuffer, 'qrcode.svg', 'image/svg+xml');
		returnData.push({ json: { success: true }, binary: { data: binaryItem } });
	}

	return returnData;
}

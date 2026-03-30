import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultBearerRequest, pdfVaultBearerRequestWithFiles, getBinaryDataBuffer } from '../GenericFunctions';

export const esignBulkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['esignBulk'] } },
		options: [
			{ name: 'Cancel', value: 'cancel', description: 'Cancel a bulk eSign job', action: 'Cancel bulk eSign job' },
			{ name: 'Create', value: 'create', description: 'Send document to multiple recipients for signing', action: 'Create bulk eSign job' },
			{ name: 'Get', value: 'get', description: 'Get bulk job details with recipients', action: 'Get bulk eSign job' },
			{ name: 'List', value: 'list', description: 'List all bulk eSign jobs', action: 'List bulk eSign jobs' },
			{ name: 'Remind', value: 'remind', description: 'Remind unsigned recipients', action: 'Remind bulk eSign recipients' },
		],
		default: 'create',
	},
];

export const esignBulkFields: INodeProperties[] = [
	// Create — PDF file
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		description: 'Name of the binary property containing the PDF to send',
		displayOptions: { show: { resource: ['esignBulk'], operation: ['create'] } },
	},
	{
		displayName: 'Recipients (JSON)',
		name: 'recipients',
		type: 'json',
		required: true,
		default: '[{"email": "signer@example.com", "name": "John Doe"}]',
		description: 'JSON array of recipients: [{email, name?}]. Maximum 100.',
		displayOptions: { show: { resource: ['esignBulk'], operation: ['create'] } },
	},
	{
		displayName: 'Zones (JSON)',
		name: 'zones',
		type: 'json',
		default: '[{"page": 1, "x": 50, "y": 80, "width": 30, "height": 8}]',
		description: 'JSON array of signing zones. Coordinates are percentages.',
		displayOptions: { show: { resource: ['esignBulk'], operation: ['create'] } },
	},
	{
		displayName: 'Document Name',
		name: 'documentName',
		type: 'string',
		default: 'Document',
		displayOptions: { show: { resource: ['esignBulk'], operation: ['create'] } },
	},

	// Job ID for get, remind, cancel
	{
		displayName: 'Bulk Job ID',
		name: 'bulkJobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['esignBulk'], operation: ['get', 'remind', 'cancel'] } },
	},
];

export async function executeEsignBulkOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'create') {
		const { buffer, binaryData } = await getBinaryDataBuffer(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex) as string);
		const recipients = this.getNodeParameter('recipients', itemIndex) as string;
		const zones = this.getNodeParameter('zones', itemIndex) as string;
		const documentName = this.getNodeParameter('documentName', itemIndex) as string;

		const additionalFields: IDataObject = {
			recipients: typeof recipients === 'string' ? recipients : JSON.stringify(recipients),
			zones: typeof zones === 'string' ? zones : JSON.stringify(zones),
			documentName,
		};

		const response = await pdfVaultBearerRequestWithFiles.call(this, 'POST', '/esign/bulk', [
			{ fieldName: 'file', binaryData, buffer },
		], additionalFields);
		returnData.push({ json: response });

	} else if (operation === 'list') {
		const response = await pdfVaultBearerRequest.call(this, 'GET', '/esign/bulk');
		const jobs = (response.jobs ?? response) as IDataObject[];
		if (Array.isArray(jobs)) {
			for (const j of jobs) {
				returnData.push({ json: j });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'get') {
		const bulkJobId = this.getNodeParameter('bulkJobId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'GET', `/esign/bulk/${bulkJobId}`);
		returnData.push({ json: response });

	} else if (operation === 'remind') {
		const bulkJobId = this.getNodeParameter('bulkJobId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'POST', `/esign/bulk/${bulkJobId}/remind`);
		returnData.push({ json: response });

	} else if (operation === 'cancel') {
		const bulkJobId = this.getNodeParameter('bulkJobId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'DELETE', `/esign/bulk/${bulkJobId}`);
		returnData.push({ json: response });
	}

	return returnData;
}

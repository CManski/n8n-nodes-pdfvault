import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultBearerRequest, pdfVaultBearerRequestWithFiles, downloadPdfResult, getBinaryDataBuffer } from '../GenericFunctions';

export const esignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['esign'] } },
		options: [
			{ name: 'Audit Trail', value: 'audit', description: 'Get audit trail for an eSign request', action: 'Get eSign audit trail' },
			{ name: 'Cancel', value: 'cancel', description: 'Cancel an eSign request', action: 'Cancel eSign request' },
			{ name: 'Create', value: 'create', description: 'Create an eSign request', action: 'Create eSign request' },
			{ name: 'Download Certificate', value: 'downloadCertificate', description: 'Download certificate of completion', action: 'Download eSign certificate' },
			{ name: 'Download Signed', value: 'downloadSigned', description: 'Download the signed PDF', action: 'Download signed PDF' },
			{ name: 'List', value: 'list', description: 'List all eSign requests', action: 'List eSign requests' },
		],
		default: 'create',
	},
];

export const esignFields: INodeProperties[] = [
	// Create — PDF binary
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		description: 'Name of the binary property containing the PDF to sign',
		displayOptions: { show: { resource: ['esign'], operation: ['create'] } },
	},
	{
		displayName: 'Recipient Email',
		name: 'recipientEmail',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'signer@example.com',
		description: 'Email of the person who needs to sign. For multi-signer, use the Signers field instead.',
		displayOptions: { show: { resource: ['esign'], operation: ['create'] } },
	},
	{
		displayName: 'Zones (JSON)',
		name: 'zones',
		type: 'json',
		default: '[{"page": 1, "x": 50, "y": 80, "width": 30, "height": 8, "type": "signature"}]',
		description: 'JSON array of signing zones: [{page, x, y, width, height, type?, label?}]. Coordinates are percentages.',
		displayOptions: { show: { resource: ['esign'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Options',
		name: 'esignOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['esign'], operation: ['create'] } },
		options: [
			{ displayName: 'Recipient Name', name: 'recipientName', type: 'string', default: '' },
			{ displayName: 'Document Name', name: 'documentName', type: 'string', default: '' },
			{
				displayName: 'Signers (JSON)',
				name: 'signers',
				type: 'json',
				default: '',
				description: 'For multi-signer: JSON array [{email, name?}]. Overrides Recipient Email.',
			},
			{
				displayName: 'Signing Mode',
				name: 'signingMode',
				type: 'options',
				options: [
					{ name: 'Parallel (all at once)', value: 'parallel' },
					{ name: 'Sequential (in order)', value: 'sequential' },
				],
				default: 'parallel',
			},
		],
	},

	// ID field for cancel, download, audit
	{
		displayName: 'eSign Request ID',
		name: 'esignId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['esign'], operation: ['cancel', 'downloadSigned', 'downloadCertificate', 'audit'] } },
	},

	// Download Signed — include certificate option
	{
		displayName: 'Include Certificate',
		name: 'includeCertificate',
		type: 'boolean',
		default: false,
		description: 'Whether to append the certificate of completion to the signed PDF',
		displayOptions: { show: { resource: ['esign'], operation: ['downloadSigned'] } },
	},
];

export async function executeEsignOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'create') {
		const { buffer, binaryData } = await getBinaryDataBuffer(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex) as string);
		const recipientEmail = this.getNodeParameter('recipientEmail', itemIndex) as string;
		const zones = this.getNodeParameter('zones', itemIndex) as string;
		const options = this.getNodeParameter('esignOptions', itemIndex, {}) as IDataObject;

		const additionalFields: IDataObject = { recipientEmail, zones };
		if (options.recipientName) additionalFields.recipientName = options.recipientName;
		if (options.documentName) additionalFields.documentName = options.documentName;
		if (options.signers) additionalFields.signers = options.signers;
		if (options.signingMode) additionalFields.signingMode = options.signingMode;

		const response = await pdfVaultBearerRequestWithFiles.call(this, 'POST', '/esign/create', [
			{ fieldName: 'file', binaryData, buffer },
		], additionalFields);
		returnData.push({ json: response });

	} else if (operation === 'list') {
		const response = await pdfVaultBearerRequest.call(this, 'GET', '/esign/requests');
		const requests = (response.requests ?? response) as IDataObject[];
		if (Array.isArray(requests)) {
			for (const r of requests) {
				returnData.push({ json: r });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'cancel') {
		const esignId = this.getNodeParameter('esignId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'DELETE', `/esign/${esignId}`);
		returnData.push({ json: response });

	} else if (operation === 'downloadSigned') {
		const esignId = this.getNodeParameter('esignId', itemIndex) as string;
		const includeCertificate = this.getNodeParameter('includeCertificate', itemIndex) as boolean;
		const path = includeCertificate ? `/esign/${esignId}/download?certificate=true` : `/esign/${esignId}/download`;
		const pdfBuffer = await downloadPdfResult.call(this, path);
		const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'signed.pdf', 'application/pdf');
		returnData.push({ json: { success: true, esignId }, binary: { data: binaryItem } });

	} else if (operation === 'downloadCertificate') {
		const esignId = this.getNodeParameter('esignId', itemIndex) as string;
		const pdfBuffer = await downloadPdfResult.call(this, `/esign/${esignId}/certificate`);
		const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'certificate.pdf', 'application/pdf');
		returnData.push({ json: { success: true, esignId }, binary: { data: binaryItem } });

	} else if (operation === 'audit') {
		const esignId = this.getNodeParameter('esignId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'GET', `/esign/${esignId}/audit`);
		returnData.push({ json: response });
	}

	return returnData;
}

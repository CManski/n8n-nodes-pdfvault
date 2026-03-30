import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultApiRequest, downloadPdfResult, pdfVaultApiRequestWithFiles, getBinaryDataBuffer } from '../GenericFunctions';

export const templateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['template'] } },
		options: [
			{ name: 'Delete', value: 'delete', description: 'Delete a template', action: 'Delete a template' },
			{ name: 'Detect Fields', value: 'detect', description: 'Re-detect form fields on a template', action: 'Detect template fields' },
			{ name: 'Generate', value: 'generate', description: 'Fill a template and generate a PDF', action: 'Generate PDF from template' },
			{ name: 'Get', value: 'get', description: 'Get a template and its field schema', action: 'Get template details' },
			{ name: 'List', value: 'list', description: 'List all templates', action: 'List templates' },
			{ name: 'Update', value: 'update', description: 'Update a template', action: 'Update a template' },
			{ name: 'Upload', value: 'upload', description: 'Upload a new PDF template', action: 'Upload a template' },
		],
		default: 'generate',
	},
];

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the template to use',
		displayOptions: { show: { resource: ['template'], operation: ['generate', 'get', 'delete', 'detect', 'update'] } },
	},
	{
		displayName: 'Data (JSON)',
		name: 'templateData',
		type: 'json',
		required: true,
		default: '{}',
		description: 'JSON object mapping field names to values for template generation',
		displayOptions: { show: { resource: ['template'], operation: ['generate'] } },
	},
	// Upload fields
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		description: 'Name of the binary property containing the PDF template file',
		displayOptions: { show: { resource: ['template'], operation: ['upload'] } },
	},
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		default: '',
		description: 'Name for the template',
		displayOptions: { show: { resource: ['template'], operation: ['upload'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['template'], operation: ['upload'] } },
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['template'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Fields (JSON)', name: 'fields', type: 'json', default: '[]', description: 'JSON array of field definitions' },
		],
	},
];

export async function executeTemplateOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'generate') {
		const templateId = this.getNodeParameter('templateId', itemIndex) as string;
		const data = this.getNodeParameter('templateData', itemIndex) as IDataObject;

		const response = await pdfVaultApiRequest.call(
			this,
			'POST',
			`/v1/templates/${templateId}/generate`,
			{ data } as IDataObject,
		);

		if (response.downloadUrl) {
			const pdfBuffer = await downloadPdfResult.call(this, response.downloadUrl as string);
			const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'generated.pdf', 'application/pdf');
			returnData.push({ json: response, binary: { data: binaryItem } });
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'list') {
		const response = await pdfVaultApiRequest.call(this, 'GET', '/v1/templates');
		const templates = (response.templates ?? response) as IDataObject[];
		if (Array.isArray(templates)) {
			for (const t of templates) {
				returnData.push({ json: t });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'get') {
		const templateId = this.getNodeParameter('templateId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'GET', `/v1/templates/${templateId}`);
		returnData.push({ json: response });

	} else if (operation === 'upload') {
		const { buffer, binaryData } = await getBinaryDataBuffer(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex) as string);
		const templateName = this.getNodeParameter('templateName', itemIndex) as string;
		const description = this.getNodeParameter('description', itemIndex) as string;

		const additionalFields: IDataObject = {};
		if (templateName) additionalFields.name = templateName;
		if (description) additionalFields.description = description;

		const response = await pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/templates', [
			{ fieldName: 'file', binaryData, buffer },
		], additionalFields);
		returnData.push({ json: response });

	} else if (operation === 'update') {
		const templateId = this.getNodeParameter('templateId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const response = await pdfVaultApiRequest.call(this, 'PATCH', `/v1/templates/${templateId}`, updateFields);
		returnData.push({ json: response });

	} else if (operation === 'delete') {
		const templateId = this.getNodeParameter('templateId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'DELETE', `/v1/templates/${templateId}`);
		returnData.push({ json: response });

	} else if (operation === 'detect') {
		const templateId = this.getNodeParameter('templateId', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', `/v1/templates/${templateId}/detect`);
		returnData.push({ json: response });
	}

	return returnData;
}

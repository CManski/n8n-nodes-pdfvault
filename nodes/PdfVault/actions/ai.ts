import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultApiRequest } from '../GenericFunctions';

export const aiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ai'] } },
		options: [
			{ name: 'Analyze Contract', value: 'analyzeContract', description: 'Extract parties, obligations, risks from a contract', action: 'Analyze contract' },
			{ name: 'Chat', value: 'chat', description: 'Chat with AI about document content', action: 'Chat with document' },
			{ name: 'Classify', value: 'classify', description: 'Auto-classify a document type', action: 'Classify document' },
			{ name: 'Extract', value: 'extract', description: 'Extract structured JSON data from a document', action: 'Extract data from document' },
			{ name: 'Redact', value: 'redact', description: 'Detect PII for redaction', action: 'Detect PII for redaction' },
			{ name: 'Summarize', value: 'summarize', description: 'Summarize PDF content', action: 'Summarize document' },
			{ name: 'Translate', value: 'translate', description: 'Translate document content', action: 'Translate document' },
		],
		default: 'summarize',
	},
];

export const aiFields: INodeProperties[] = [
	// Shared: Text input
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		description: 'The text content of the PDF to process',
		displayOptions: {
			show: {
				resource: ['ai'],
				operation: ['summarize', 'chat', 'extract', 'classify', 'redact', 'translate', 'analyzeContract'],
			},
		},
	},

	// Model selector (shared by most)
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{ name: 'GPT-4o Mini (8 credits)', value: 'gpt-4o-mini' },
			{ name: 'Claude Haiku (25 credits)', value: 'haiku' },
			{ name: 'Claude Sonnet (100 credits)', value: 'sonnet' },
		],
		default: 'gpt-4o-mini',
		displayOptions: {
			show: {
				resource: ['ai'],
				operation: ['summarize', 'chat', 'extract', 'redact', 'translate', 'analyzeContract'],
			},
		},
	},

	// Summarize: mode
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Brief', value: 'brief' },
			{ name: 'Detailed', value: 'detailed' },
		],
		default: 'brief',
		displayOptions: { show: { resource: ['ai'], operation: ['summarize'] } },
	},

	// Chat: question
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		required: true,
		default: '',
		description: 'The question to ask about the document',
		displayOptions: { show: { resource: ['ai'], operation: ['chat'] } },
	},

	// Extract: schema hints
	{
		displayName: 'Schema Hints (JSON)',
		name: 'schema',
		type: 'json',
		default: '{}',
		description: 'Optional JSON schema hints to guide extraction (e.g., {"invoice_number": "string", "total": "number"})',
		displayOptions: { show: { resource: ['ai'], operation: ['extract'] } },
	},

	// Translate: target language
	{
		displayName: 'Target Language',
		name: 'language',
		type: 'string',
		required: true,
		default: 'Spanish',
		placeholder: 'Spanish',
		description: 'The language to translate the document into',
		displayOptions: { show: { resource: ['ai'], operation: ['translate'] } },
	},
];

export async function executeAiOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	const text = this.getNodeParameter('text', itemIndex) as string;

	if (operation === 'summarize') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const mode = this.getNodeParameter('mode', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/summarize', { text, model, mode } as IDataObject);
		returnData.push({ json: response });

	} else if (operation === 'chat') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const question = this.getNodeParameter('question', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/chat', { text, question, model } as IDataObject);
		returnData.push({ json: response });

	} else if (operation === 'extract') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const schema = this.getNodeParameter('schema', itemIndex) as IDataObject;
		const body: IDataObject = { text, model };
		if (schema && Object.keys(schema).length > 0) {
			body.schema = schema;
		}
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/extract', body);
		returnData.push({ json: response });

	} else if (operation === 'classify') {
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/classify', { text } as IDataObject);
		returnData.push({ json: response });

	} else if (operation === 'redact') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/redact', { text, model } as IDataObject);
		returnData.push({ json: response });

	} else if (operation === 'translate') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const language = this.getNodeParameter('language', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/translate', { text, language, model } as IDataObject);
		returnData.push({ json: response });

	} else if (operation === 'analyzeContract') {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const response = await pdfVaultApiRequest.call(this, 'POST', '/v1/ai/analyze-contract', { text, model } as IDataObject);
		returnData.push({ json: response });
	}

	return returnData;
}

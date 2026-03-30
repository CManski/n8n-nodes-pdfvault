import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { pdfOperations, pdfFields, executePdfOperation } from './actions/pdf';
import { templateOperations, templateFields, executeTemplateOperation } from './actions/template';
import { qrOperations, qrFields, executeQrOperation } from './actions/qr';
import { urlOperations, urlFields, executeUrlOperation } from './actions/url';
import { aiOperations, aiFields, executeAiOperation } from './actions/ai';
import { esignOperations, esignFields, executeEsignOperation } from './actions/esign';
import { webhookOperations, webhookFields, executeWebhookOperation } from './actions/webhook';
import { teamOperations, teamFields, executeTeamOperation } from './actions/team';
import { workspaceOperations, workspaceFields, executeWorkspaceOperation } from './actions/workspace';
import { esignBulkOperations, esignBulkFields, executeEsignBulkOperation } from './actions/esign-bulk';
import { commentOperations, commentFields, executeCommentOperation } from './actions/comment';

export class PdfVault implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF Vault',
		name: 'pdfVault',
		icon: 'file:pdfvault.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Privacy-first PDF toolkit — PDF ops, AI processing, eSign, QR codes, URL shortener, templates, webhooks, teams, workspaces, and comments',
		defaults: {
			name: 'PDF Vault',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'pdfVaultApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'PDF',
						value: 'pdf',
						description: '13 PDF processing operations (merge, split, compress, etc.)',
					},
					{
						name: 'Template',
						value: 'template',
						description: 'Generate PDFs from templates',
					},
					{
						name: 'QR Code',
						value: 'qr',
						description: 'Create and manage dynamic QR codes',
					},
					{
						name: 'Short URL',
						value: 'url',
						description: 'Create and manage short URLs',
					},
					{
						name: 'AI',
						value: 'ai',
						description: 'AI-powered document processing (summarize, chat, extract, translate, etc.)',
					},
					{
						name: 'Comment',
						value: 'comment',
						description: 'Threaded document comments (requires Access Token)',
					},
					{
						name: 'eSign',
						value: 'esign',
						description: 'Electronic signatures — send, track, and download signed documents (requires Access Token)',
					},
					{
						name: 'eSign Bulk',
						value: 'esignBulk',
						description: 'Send a document to multiple recipients for signing (requires Access Token)',
					},
					{
						name: 'Team',
						value: 'team',
						description: 'Manage teams and team members (requires Access Token)',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Manage webhook endpoints for event notifications',
					},
					{
						name: 'Workspace',
						value: 'workspace',
						description: 'Collaborative document workspaces (requires Access Token)',
					},
				],
				default: 'pdf',
			},
			// Operations per resource
			...pdfOperations,
			...templateOperations,
			...qrOperations,
			...urlOperations,
			...aiOperations,
			...esignOperations,
			...webhookOperations,
			...teamOperations,
			...workspaceOperations,
			...esignBulkOperations,
			...commentOperations,
			// Fields per resource + operation
			...pdfFields,
			...templateFields,
			...qrFields,
			...urlFields,
			...aiFields,
			...esignFields,
			...webhookFields,
			...teamFields,
			...workspaceFields,
			...esignBulkFields,
			...commentFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				let results: INodeExecutionData[];

				switch (resource) {
					case 'pdf':
						results = await executePdfOperation.call(this, i);
						break;
					case 'template':
						results = await executeTemplateOperation.call(this, i);
						break;
					case 'qr':
						results = await executeQrOperation.call(this, i);
						break;
					case 'url':
						results = await executeUrlOperation.call(this, i);
						break;
					case 'ai':
						results = await executeAiOperation.call(this, i);
						break;
					case 'esign':
						results = await executeEsignOperation.call(this, i);
						break;
					case 'webhook':
						results = await executeWebhookOperation.call(this, i);
						break;
					case 'team':
						results = await executeTeamOperation.call(this, i);
						break;
					case 'workspace':
						results = await executeWorkspaceOperation.call(this, i);
						break;
					case 'esignBulk':
						results = await executeEsignBulkOperation.call(this, i);
						break;
					case 'comment':
						results = await executeCommentOperation.call(this, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...results);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

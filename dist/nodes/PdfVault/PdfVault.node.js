"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfVault = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const pdf_1 = require("./actions/pdf");
const template_1 = require("./actions/template");
const qr_1 = require("./actions/qr");
const url_1 = require("./actions/url");
const ai_1 = require("./actions/ai");
const esign_1 = require("./actions/esign");
const webhook_1 = require("./actions/webhook");
const team_1 = require("./actions/team");
const workspace_1 = require("./actions/workspace");
const esign_bulk_1 = require("./actions/esign-bulk");
const comment_1 = require("./actions/comment");
class PdfVault {
    constructor() {
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...pdf_1.pdfOperations,
                ...template_1.templateOperations,
                ...qr_1.qrOperations,
                ...url_1.urlOperations,
                ...ai_1.aiOperations,
                ...esign_1.esignOperations,
                ...webhook_1.webhookOperations,
                ...team_1.teamOperations,
                ...workspace_1.workspaceOperations,
                ...esign_bulk_1.esignBulkOperations,
                ...comment_1.commentOperations,
                // Fields per resource + operation
                ...pdf_1.pdfFields,
                ...template_1.templateFields,
                ...qr_1.qrFields,
                ...url_1.urlFields,
                ...ai_1.aiFields,
                ...esign_1.esignFields,
                ...webhook_1.webhookFields,
                ...team_1.teamFields,
                ...workspace_1.workspaceFields,
                ...esign_bulk_1.esignBulkFields,
                ...comment_1.commentFields,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                let results;
                switch (resource) {
                    case 'pdf':
                        results = await pdf_1.executePdfOperation.call(this, i);
                        break;
                    case 'template':
                        results = await template_1.executeTemplateOperation.call(this, i);
                        break;
                    case 'qr':
                        results = await qr_1.executeQrOperation.call(this, i);
                        break;
                    case 'url':
                        results = await url_1.executeUrlOperation.call(this, i);
                        break;
                    case 'ai':
                        results = await ai_1.executeAiOperation.call(this, i);
                        break;
                    case 'esign':
                        results = await esign_1.executeEsignOperation.call(this, i);
                        break;
                    case 'webhook':
                        results = await webhook_1.executeWebhookOperation.call(this, i);
                        break;
                    case 'team':
                        results = await team_1.executeTeamOperation.call(this, i);
                        break;
                    case 'workspace':
                        results = await workspace_1.executeWorkspaceOperation.call(this, i);
                        break;
                    case 'esignBulk':
                        results = await esign_bulk_1.executeEsignBulkOperation.call(this, i);
                        break;
                    case 'comment':
                        results = await comment_1.executeCommentOperation.call(this, i);
                        break;
                    default:
                        throw new Error(`Unknown resource: ${resource}`);
                }
                returnData.push(...results);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
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
exports.PdfVault = PdfVault;
//# sourceMappingURL=PdfVault.node.js.map
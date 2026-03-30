"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookFields = exports.webhookOperations = void 0;
exports.executeWebhookOperation = executeWebhookOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.webhookOperations = [
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
exports.webhookFields = [
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
async function executeWebhookOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    if (operation === 'create') {
        const url = this.getNodeParameter('url', itemIndex);
        const events = this.getNodeParameter('events', itemIndex);
        const description = this.getNodeParameter('description', itemIndex);
        const body = { url, events };
        if (description)
            body.description = description;
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/webhooks', body);
        returnData.push({ json: response });
    }
    else if (operation === 'list') {
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'GET', '/v1/webhooks');
        const webhooks = (response.webhooks ?? response);
        if (Array.isArray(webhooks)) {
            for (const wh of webhooks) {
                returnData.push({ json: wh });
            }
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'update') {
        const webhookId = this.getNodeParameter('webhookId', itemIndex);
        const updateFields = this.getNodeParameter('updateFields', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'PATCH', `/v1/webhooks/${webhookId}`, updateFields);
        returnData.push({ json: response });
    }
    else if (operation === 'delete') {
        const webhookId = this.getNodeParameter('webhookId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'DELETE', `/v1/webhooks/${webhookId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'test') {
        const webhookId = this.getNodeParameter('webhookId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', `/v1/webhooks/${webhookId}/test`);
        returnData.push({ json: response });
    }
    return returnData;
}
//# sourceMappingURL=webhook.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlFields = exports.urlOperations = void 0;
exports.executeUrlOperation = executeUrlOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.urlOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['url'] } },
        options: [
            { name: 'Create', value: 'create', description: 'Create a short URL', action: 'Create a short URL' },
            { name: 'Get', value: 'get', description: 'Get short URL details', action: 'Get short URL details' },
            { name: 'List', value: 'list', description: 'List all short URLs', action: 'List short URLs' },
            { name: 'Delete', value: 'delete', description: 'Delete a short URL', action: 'Delete a short URL' },
            { name: 'Stats', value: 'stats', description: 'Get click analytics for a short URL', action: 'Get short URL stats' },
            { name: 'Update', value: 'update', description: 'Update a short URL', action: 'Update a short URL' },
        ],
        default: 'create',
    },
];
exports.urlFields = [
    // Create
    {
        displayName: 'Destination URL',
        name: 'url',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'https://example.com',
        displayOptions: { show: { resource: ['url'], operation: ['create'] } },
    },
    {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['url'], operation: ['create'] } },
    },
    // Get, Stats — ID
    {
        displayName: 'Short URL ID',
        name: 'urlId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['url'], operation: ['get', 'stats', 'update', 'delete'] } },
    },
    // Stats — Days
    {
        displayName: 'Days',
        name: 'days',
        type: 'number',
        default: 30,
        description: 'Number of days of analytics to retrieve',
        displayOptions: { show: { resource: ['url'], operation: ['stats'] } },
    },
    // Update Fields
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['url'], operation: ['update'] } },
        options: [
            { displayName: 'Destination URL', name: 'url', type: 'string', default: '' },
            { displayName: 'Label', name: 'label', type: 'string', default: '' },
            { displayName: 'Active', name: 'active', type: 'boolean', default: true },
        ],
    },
];
async function executeUrlOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    if (operation === 'create') {
        const url = this.getNodeParameter('url', itemIndex);
        const label = this.getNodeParameter('label', itemIndex);
        const body = { url };
        if (label)
            body.label = label;
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/shorten', body);
        returnData.push({ json: response });
    }
    else if (operation === 'list') {
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'GET', '/v1/urls');
        const urls = (response.urls ?? response);
        if (Array.isArray(urls)) {
            for (const u of urls) {
                returnData.push({ json: u });
            }
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'get') {
        const urlId = this.getNodeParameter('urlId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'GET', `/v1/urls/${urlId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'stats') {
        const urlId = this.getNodeParameter('urlId', itemIndex);
        const days = this.getNodeParameter('days', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'GET', `/v1/urls/${urlId}/stats`, undefined, { days });
        returnData.push({ json: response });
    }
    else if (operation === 'update') {
        const urlId = this.getNodeParameter('urlId', itemIndex);
        const updateFields = this.getNodeParameter('updateFields', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'PATCH', `/v1/urls/${urlId}`, updateFields);
        returnData.push({ json: response });
    }
    else if (operation === 'delete') {
        const urlId = this.getNodeParameter('urlId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'DELETE', `/v1/urls/${urlId}`);
        returnData.push({ json: response });
    }
    return returnData;
}
//# sourceMappingURL=url.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiFields = exports.aiOperations = void 0;
exports.executeAiOperation = executeAiOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.aiOperations = [
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
exports.aiFields = [
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
async function executeAiOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    const text = this.getNodeParameter('text', itemIndex);
    if (operation === 'summarize') {
        const model = this.getNodeParameter('model', itemIndex);
        const mode = this.getNodeParameter('mode', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/summarize', { text, model, mode });
        returnData.push({ json: response });
    }
    else if (operation === 'chat') {
        const model = this.getNodeParameter('model', itemIndex);
        const question = this.getNodeParameter('question', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/chat', { text, question, model });
        returnData.push({ json: response });
    }
    else if (operation === 'extract') {
        const model = this.getNodeParameter('model', itemIndex);
        const schema = this.getNodeParameter('schema', itemIndex);
        const body = { text, model };
        if (schema && Object.keys(schema).length > 0) {
            body.schema = schema;
        }
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/extract', body);
        returnData.push({ json: response });
    }
    else if (operation === 'classify') {
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/classify', { text });
        returnData.push({ json: response });
    }
    else if (operation === 'redact') {
        const model = this.getNodeParameter('model', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/redact', { text, model });
        returnData.push({ json: response });
    }
    else if (operation === 'translate') {
        const model = this.getNodeParameter('model', itemIndex);
        const language = this.getNodeParameter('language', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/translate', { text, language, model });
        returnData.push({ json: response });
    }
    else if (operation === 'analyzeContract') {
        const model = this.getNodeParameter('model', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/ai/analyze-contract', { text, model });
        returnData.push({ json: response });
    }
    return returnData;
}
//# sourceMappingURL=ai.js.map
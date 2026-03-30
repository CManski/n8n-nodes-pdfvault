"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfVaultApiRequest = pdfVaultApiRequest;
exports.pdfVaultApiRequestWithFiles = pdfVaultApiRequestWithFiles;
exports.downloadPdfResult = downloadPdfResult;
exports.pdfVaultBearerRequest = pdfVaultBearerRequest;
exports.pdfVaultBearerRequestWithFiles = pdfVaultBearerRequestWithFiles;
exports.getBinaryDataBuffer = getBinaryDataBuffer;
const n8n_workflow_1 = require("n8n-workflow");
const BASE_URL = 'https://api.pdfvault.app';
/**
 * Make an authenticated request to the PDF Vault API.
 */
async function pdfVaultApiRequest(method, path, body, qs, option) {
    const options = {
        method,
        qs: qs ?? {},
        uri: `${BASE_URL}${path}`,
        json: true,
        ...option,
    };
    if (body && Object.keys(body).length > 0) {
        options.body = body;
    }
    try {
        const response = await this.helpers.requestWithAuthentication.call(this, 'pdfVaultApi', options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error.message,
        });
    }
}
/**
 * Make a multipart/form-data request with binary file uploads.
 */
async function pdfVaultApiRequestWithFiles(method, path, binaryItems, additionalFields) {
    const formData = {};
    for (const item of binaryItems) {
        formData[item.fieldName] = {
            value: item.buffer,
            options: {
                filename: item.binaryData.fileName ?? 'file.pdf',
                contentType: item.binaryData.mimeType ?? 'application/pdf',
            },
        };
    }
    if (additionalFields) {
        for (const [key, value] of Object.entries(additionalFields)) {
            if (value !== undefined && value !== null && value !== '') {
                formData[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
        }
    }
    const options = {
        method,
        uri: `${BASE_URL}${path}`,
        formData,
        json: true,
    };
    try {
        const response = await this.helpers.requestWithAuthentication.call(this, 'pdfVaultApi', options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error.message,
        });
    }
}
/**
 * Download a result PDF from a download URL and return it as binary data.
 */
async function downloadPdfResult(downloadUrl) {
    const options = {
        method: 'GET',
        uri: downloadUrl.startsWith('http') ? downloadUrl : `${BASE_URL}${downloadUrl}`,
        encoding: null,
        json: false,
    };
    const response = await this.helpers.request(options);
    return Buffer.from(response, 'binary');
}
/**
 * Make an authenticated request using Bearer token (for eSign, Teams, Workspaces, etc.).
 */
async function pdfVaultBearerRequest(method, path, body, qs) {
    const credentials = await this.getCredentials('pdfVaultApi');
    const accessToken = credentials.accessToken;
    if (!accessToken) {
        throw new Error('Access Token is required for this operation. Add it in your PDF Vault credentials under "Access Token".');
    }
    const options = {
        method,
        qs: qs ?? {},
        uri: `${BASE_URL}${path}`,
        json: true,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    if (body && Object.keys(body).length > 0) {
        options.body = body;
    }
    try {
        const response = await this.helpers.request(options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error.message,
        });
    }
}
/**
 * Make a multipart/form-data request with Bearer token auth.
 */
async function pdfVaultBearerRequestWithFiles(method, path, binaryItems, additionalFields) {
    const credentials = await this.getCredentials('pdfVaultApi');
    const accessToken = credentials.accessToken;
    if (!accessToken) {
        throw new Error('Access Token is required for this operation. Add it in your PDF Vault credentials under "Access Token".');
    }
    const formData = {};
    for (const item of binaryItems) {
        formData[item.fieldName] = {
            value: item.buffer,
            options: {
                filename: item.binaryData.fileName ?? 'file.pdf',
                contentType: item.binaryData.mimeType ?? 'application/pdf',
            },
        };
    }
    if (additionalFields) {
        for (const [key, value] of Object.entries(additionalFields)) {
            if (value !== undefined && value !== null && value !== '') {
                formData[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
        }
    }
    const options = {
        method,
        uri: `${BASE_URL}${path}`,
        formData,
        json: true,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    try {
        const response = await this.helpers.request(options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: error.message,
        });
    }
}
/**
 * Get binary data from an n8n binary property, returning the buffer.
 */
async function getBinaryDataBuffer(execFunctions, itemIndex, propertyName) {
    const binaryData = execFunctions.helpers.assertBinaryData(itemIndex, propertyName);
    const buffer = await execFunctions.helpers.getBinaryDataBuffer(itemIndex, propertyName);
    return { buffer, binaryData };
}
//# sourceMappingURL=GenericFunctions.js.map
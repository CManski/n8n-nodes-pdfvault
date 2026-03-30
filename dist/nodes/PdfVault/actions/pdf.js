"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfFields = exports.pdfOperations = void 0;
exports.executePdfOperation = executePdfOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.pdfOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['pdf'] } },
        options: [
            { name: 'Merge', value: 'merge', description: 'Merge multiple PDFs into one', action: 'Merge PDFs' },
            { name: 'Split', value: 'split', description: 'Split a PDF by page ranges', action: 'Split a PDF' },
            { name: 'Compress', value: 'compress', description: 'Compress a PDF to reduce file size', action: 'Compress a PDF' },
            { name: 'Watermark', value: 'watermark', description: 'Add a text watermark to a PDF', action: 'Watermark a PDF' },
            { name: 'Flatten', value: 'flatten', description: 'Flatten form fields in a PDF', action: 'Flatten a PDF' },
            { name: 'Metadata', value: 'metadata', description: 'Read or set PDF metadata', action: 'Read/set PDF metadata' },
            { name: 'Page Numbers', value: 'pagenumbers', description: 'Add page numbers to a PDF', action: 'Add page numbers' },
            { name: 'Image Stamp', value: 'image', description: 'Stamp an image or signature onto a PDF', action: 'Stamp image on PDF' },
            { name: 'Crop', value: 'crop', description: 'Crop PDF pages', action: 'Crop PDF pages' },
            { name: 'Delete Pages', value: 'deletePages', description: 'Delete specific pages from a PDF', action: 'Delete pages from PDF' },
            { name: 'Rotate', value: 'rotate', description: 'Rotate PDF pages', action: 'Rotate PDF pages' },
            { name: 'Image to PDF', value: 'imageToPdf', description: 'Convert images to a PDF', action: 'Convert images to PDF' },
            { name: 'URL to PDF', value: 'urlToPdf', description: 'Convert a URL to a PDF', action: 'Convert URL to PDF' },
        ],
        default: 'merge',
    },
];
exports.pdfFields = [
    // ── Merge ──
    {
        displayName: 'Binary Properties',
        name: 'binaryProperties',
        type: 'string',
        default: 'data,data1',
        description: 'Comma-separated names of binary properties containing the PDFs to merge (minimum 2)',
        displayOptions: { show: { resource: ['pdf'], operation: ['merge'] } },
    },
    // ── Split ──
    {
        displayName: 'Binary Property',
        name: 'binaryProperty',
        type: 'string',
        default: 'data',
        description: 'Name of the binary property containing the PDF file',
        displayOptions: { show: { resource: ['pdf'], operation: ['split', 'compress', 'watermark', 'flatten', 'metadata', 'pagenumbers', 'image', 'crop', 'deletePages', 'rotate'] } },
    },
    {
        displayName: 'Page Ranges',
        name: 'ranges',
        type: 'string',
        default: '1-3,5,7-10',
        placeholder: '1-3,5,7-10',
        description: 'Comma-separated page ranges to extract',
        displayOptions: { show: { resource: ['pdf'], operation: ['split'] } },
    },
    // ── Compress ──
    {
        displayName: 'Quality',
        name: 'quality',
        type: 'options',
        options: [
            { name: 'Screen (smallest)', value: 'screen' },
            { name: 'Low', value: 'low' },
            { name: 'Medium', value: 'medium' },
            { name: 'High (largest)', value: 'high' },
        ],
        default: 'medium',
        description: 'Compression quality level. Lower quality = smaller file size.',
        displayOptions: { show: { resource: ['pdf'], operation: ['compress'] } },
    },
    // ── Watermark ──
    {
        displayName: 'Watermark Text',
        name: 'text',
        type: 'string',
        default: 'CONFIDENTIAL',
        displayOptions: { show: { resource: ['pdf'], operation: ['watermark'] } },
    },
    {
        displayName: 'Additional Options',
        name: 'watermarkOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['pdf'], operation: ['watermark'] } },
        options: [
            { displayName: 'Opacity', name: 'opacity', type: 'number', default: 0.3, typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 }, description: 'Watermark opacity (0-1)' },
            { displayName: 'Font Size', name: 'fontSize', type: 'number', default: 50, description: 'Font size of the watermark text' },
            { displayName: 'Rotation', name: 'rotation', type: 'number', default: 45, description: 'Rotation angle in degrees' },
            { displayName: 'Color', name: 'color', type: 'string', default: '#808080', description: 'Watermark color as hex string' },
        ],
    },
    // ── Metadata ──
    {
        displayName: 'Metadata Fields',
        name: 'metadataFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['pdf'], operation: ['metadata'] } },
        options: [
            { displayName: 'Title', name: 'title', type: 'string', default: '' },
            { displayName: 'Author', name: 'author', type: 'string', default: '' },
            { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
            { displayName: 'Keywords', name: 'keywords', type: 'string', default: '' },
            { displayName: 'Creator', name: 'creator', type: 'string', default: '' },
            { displayName: 'Producer', name: 'producer', type: 'string', default: '' },
        ],
    },
    // ── Page Numbers ──
    {
        displayName: 'Additional Options',
        name: 'pageNumberOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['pdf'], operation: ['pagenumbers'] } },
        options: [
            { displayName: 'Position', name: 'position', type: 'options', options: [
                    { name: 'Bottom Center', value: 'bottom-center' },
                    { name: 'Bottom Left', value: 'bottom-left' },
                    { name: 'Bottom Right', value: 'bottom-right' },
                    { name: 'Top Center', value: 'top-center' },
                    { name: 'Top Left', value: 'top-left' },
                    { name: 'Top Right', value: 'top-right' },
                ], default: 'bottom-center' },
            { displayName: 'Font Size', name: 'fontSize', type: 'number', default: 12 },
            { displayName: 'Start Number', name: 'startNumber', type: 'number', default: 1 },
            { displayName: 'Format', name: 'format', type: 'string', default: 'Page {n}', description: 'Page number format. Use {n} for the number.' },
        ],
    },
    // ── Image Stamp ──
    {
        displayName: 'Image Binary Property',
        name: 'imageBinaryProperty',
        type: 'string',
        default: 'image',
        description: 'Name of the binary property containing the image to stamp',
        displayOptions: { show: { resource: ['pdf'], operation: ['image'] } },
    },
    {
        displayName: 'Placements (JSON)',
        name: 'placements',
        type: 'json',
        default: '[{"page": 1, "x": 50, "y": 50, "width": 20, "height": 10}]',
        description: 'JSON array of placement objects with page, x, y, width, height (percentages)',
        displayOptions: { show: { resource: ['pdf'], operation: ['image'] } },
    },
    {
        displayName: 'Opacity',
        name: 'imageOpacity',
        type: 'number',
        default: 1,
        typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
        displayOptions: { show: { resource: ['pdf'], operation: ['image'] } },
    },
    // ── Crop ──
    {
        displayName: 'Crop Box (JSON)',
        name: 'cropBox',
        type: 'json',
        default: '{"left": 10, "bottom": 10, "right": 90, "top": 90}',
        description: 'Crop box as percentages: left, bottom, right, top',
        displayOptions: { show: { resource: ['pdf'], operation: ['crop'] } },
    },
    {
        displayName: 'Pages',
        name: 'cropPages',
        type: 'string',
        default: 'all',
        placeholder: 'all or 1,3,5',
        description: 'Pages to crop: "all" or comma-separated page numbers',
        displayOptions: { show: { resource: ['pdf'], operation: ['crop'] } },
    },
    // ── Delete Pages ──
    {
        displayName: 'Pages to Delete',
        name: 'pages',
        type: 'string',
        default: '1,3',
        placeholder: '1,3,5',
        description: 'Comma-separated page numbers to delete',
        displayOptions: { show: { resource: ['pdf'], operation: ['deletePages'] } },
    },
    // ── Rotate ──
    {
        displayName: 'Angle',
        name: 'angle',
        type: 'options',
        options: [
            { name: '90 degrees', value: 90 },
            { name: '180 degrees', value: 180 },
            { name: '270 degrees', value: 270 },
        ],
        default: 90,
        displayOptions: { show: { resource: ['pdf'], operation: ['rotate'] } },
    },
    {
        displayName: 'Pages',
        name: 'rotatePages',
        type: 'string',
        default: 'all',
        placeholder: 'all or 1,3,5',
        description: 'Pages to rotate: "all" or comma-separated page numbers',
        displayOptions: { show: { resource: ['pdf'], operation: ['rotate'] } },
    },
    // ── Image to PDF ──
    {
        displayName: 'Image Binary Properties',
        name: 'imageBinaryProperties',
        type: 'string',
        default: 'data',
        description: 'Comma-separated names of binary properties containing images',
        displayOptions: { show: { resource: ['pdf'], operation: ['imageToPdf'] } },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'options',
        options: [
            { name: 'A4', value: 'A4' },
            { name: 'Letter', value: 'Letter' },
            { name: 'Legal', value: 'Legal' },
            { name: 'Fit to Image', value: 'fit' },
        ],
        default: 'A4',
        displayOptions: { show: { resource: ['pdf'], operation: ['imageToPdf'] } },
    },
    // ── URL to PDF ──
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com',
        description: 'URL to convert to PDF',
        displayOptions: { show: { resource: ['pdf'], operation: ['urlToPdf'] } },
    },
    {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
            { name: 'A4', value: 'A4' },
            { name: 'Letter', value: 'Letter' },
            { name: 'Legal', value: 'Legal' },
        ],
        default: 'A4',
        displayOptions: { show: { resource: ['pdf'], operation: ['urlToPdf'] } },
    },
];
async function executePdfOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    if (operation === 'merge') {
        const binaryProps = this.getNodeParameter('binaryProperties', itemIndex)
            .split(',')
            .map((s) => s.trim());
        const files = [];
        for (let i = 0; i < binaryProps.length; i++) {
            const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, binaryProps[i]);
            files.push({ fieldName: `file${i === 0 ? '' : i}`, binaryData, buffer });
        }
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/merge', files);
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'merged.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'split') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const ranges = this.getNodeParameter('ranges', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/split', [
            { fieldName: 'file', binaryData, buffer },
        ], { ranges });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'split.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'compress') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const quality = this.getNodeParameter('quality', itemIndex, 'medium');
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/compress', [
            { fieldName: 'file', binaryData, buffer },
        ], { quality });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'compressed.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'watermark') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const text = this.getNodeParameter('text', itemIndex);
        const options = this.getNodeParameter('watermarkOptions', itemIndex, {});
        const additionalFields = { text, ...options };
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/watermark', [
            { fieldName: 'file', binaryData, buffer },
        ], additionalFields);
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'watermarked.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'flatten') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/flatten', [
            { fieldName: 'file', binaryData, buffer },
        ]);
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'flattened.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'metadata') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const metadataFields = this.getNodeParameter('metadataFields', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/metadata', [
            { fieldName: 'file', binaryData, buffer },
        ], metadataFields);
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'metadata.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'pagenumbers') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const options = this.getNodeParameter('pageNumberOptions', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/pagenumbers', [
            { fieldName: 'file', binaryData, buffer },
        ], options);
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'numbered.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'image') {
        const binaryProp = this.getNodeParameter('binaryProperty', itemIndex);
        const imageProp = this.getNodeParameter('imageBinaryProperty', itemIndex);
        const placements = this.getNodeParameter('placements', itemIndex);
        const opacity = this.getNodeParameter('imageOpacity', itemIndex);
        const { buffer: pdfBuffer, binaryData: pdfBinary } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, binaryProp);
        const { buffer: imgBuffer, binaryData: imgBinary } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, imageProp);
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/image', [
            { fieldName: 'file', binaryData: pdfBinary, buffer: pdfBuffer },
            { fieldName: 'image', binaryData: imgBinary, buffer: imgBuffer },
        ], { placements, opacity: String(opacity) });
        if (response.downloadUrl) {
            const resultBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(resultBuffer, 'stamped.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'crop') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const cropBox = this.getNodeParameter('cropBox', itemIndex);
        const pages = this.getNodeParameter('cropPages', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/crop', [
            { fieldName: 'file', binaryData, buffer },
        ], { cropBox, pages });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'cropped.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'deletePages') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const pages = this.getNodeParameter('pages', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/delete-pages', [
            { fieldName: 'file', binaryData, buffer },
        ], { pages });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'modified.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'rotate') {
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('binaryProperty', itemIndex));
        const angle = this.getNodeParameter('angle', itemIndex);
        const pages = this.getNodeParameter('rotatePages', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/rotate', [
            { fieldName: 'file', binaryData, buffer },
        ], { angle: String(angle), pages });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'rotated.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'imageToPdf') {
        const binaryProps = this.getNodeParameter('imageBinaryProperties', itemIndex)
            .split(',')
            .map((s) => s.trim());
        const pageSize = this.getNodeParameter('pageSize', itemIndex);
        const files = [];
        for (let i = 0; i < binaryProps.length; i++) {
            const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, binaryProps[i]);
            files.push({ fieldName: `image${i === 0 ? '' : i}`, binaryData, buffer });
        }
        const response = await GenericFunctions_1.pdfVaultApiRequestWithFiles.call(this, 'POST', '/v1/image-to-pdf', files, { pageSize });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'converted.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'urlToPdf') {
        const url = this.getNodeParameter('url', itemIndex);
        const format = this.getNodeParameter('format', itemIndex);
        const response = await GenericFunctions_1.pdfVaultApiRequest.call(this, 'POST', '/v1/url-to-pdf', { url, format });
        if (response.downloadUrl) {
            const pdfBuffer = await GenericFunctions_1.downloadPdfResult.call(this, response.downloadUrl);
            const binaryItem = await this.helpers.prepareBinaryData(pdfBuffer, 'page.pdf', 'application/pdf');
            returnData.push({ json: response, binary: { data: binaryItem } });
        }
        else {
            returnData.push({ json: response });
        }
    }
    return returnData;
}
//# sourceMappingURL=pdf.js.map
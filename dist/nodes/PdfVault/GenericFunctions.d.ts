import type { IExecuteFunctions, IHttpRequestMethods, IDataObject, IRequestOptions, IBinaryData } from 'n8n-workflow';
/**
 * Make an authenticated request to the PDF Vault API.
 */
export declare function pdfVaultApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, path: string, body?: IDataObject, qs?: IDataObject, option?: Partial<IRequestOptions>): Promise<IDataObject>;
/**
 * Make a multipart/form-data request with binary file uploads.
 */
export declare function pdfVaultApiRequestWithFiles(this: IExecuteFunctions, method: IHttpRequestMethods, path: string, binaryItems: Array<{
    fieldName: string;
    binaryData: IBinaryData;
    buffer: Buffer;
}>, additionalFields?: IDataObject): Promise<IDataObject>;
/**
 * Download a result PDF from a download URL and return it as binary data.
 */
export declare function downloadPdfResult(this: IExecuteFunctions, downloadUrl: string): Promise<Buffer>;
/**
 * Make an authenticated request using Bearer token (for eSign, Teams, Workspaces, etc.).
 */
export declare function pdfVaultBearerRequest(this: IExecuteFunctions, method: IHttpRequestMethods, path: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject>;
/**
 * Make a multipart/form-data request with Bearer token auth.
 */
export declare function pdfVaultBearerRequestWithFiles(this: IExecuteFunctions, method: IHttpRequestMethods, path: string, binaryItems: Array<{
    fieldName: string;
    binaryData: IBinaryData;
    buffer: Buffer;
}>, additionalFields?: IDataObject): Promise<IDataObject>;
/**
 * Get binary data from an n8n binary property, returning the buffer.
 */
export declare function getBinaryDataBuffer(execFunctions: IExecuteFunctions, itemIndex: number, propertyName: string): Promise<{
    buffer: Buffer;
    binaryData: IBinaryData;
}>;
//# sourceMappingURL=GenericFunctions.d.ts.map
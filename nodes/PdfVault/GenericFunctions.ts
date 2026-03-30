import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
	IRequestOptions,
	IBinaryData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.pdfvault.app';

/**
 * Make an authenticated request to the PDF Vault API.
 */
export async function pdfVaultApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
	qs?: IDataObject,
	option?: Partial<IRequestOptions>,
): Promise<IDataObject> {
	const options: IRequestOptions = {
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
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'pdfVaultApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as JsonObject).message as string | undefined,
		});
	}
}

/**
 * Make a multipart/form-data request with binary file uploads.
 */
export async function pdfVaultApiRequestWithFiles(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	binaryItems: Array<{ fieldName: string; binaryData: IBinaryData; buffer: Buffer }>,
	additionalFields?: IDataObject,
): Promise<IDataObject> {
	const formData: IDataObject = {};

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

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${path}`,
		formData,
		json: true,
	};

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'pdfVaultApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as JsonObject).message as string | undefined,
		});
	}
}

/**
 * Download a result PDF from a download URL and return it as binary data.
 */
export async function downloadPdfResult(
	this: IExecuteFunctions,
	downloadUrl: string,
): Promise<Buffer> {
	const options: IRequestOptions = {
		method: 'GET',
		uri: downloadUrl.startsWith('http') ? downloadUrl : `${BASE_URL}${downloadUrl}`,
		encoding: null,
		json: false,
	};

	const response = await this.helpers.request(options);
	return Buffer.from(response as string, 'binary');
}

/**
 * Make an authenticated request using Bearer token (for eSign, Teams, Workspaces, etc.).
 */
export async function pdfVaultBearerRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('pdfVaultApi');
	const accessToken = credentials.accessToken as string;
	if (!accessToken) {
		throw new Error(
			'Access Token is required for this operation. Add it in your PDF Vault credentials under "Access Token".',
		);
	}

	const options: IRequestOptions = {
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
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as JsonObject).message as string | undefined,
		});
	}
}

/**
 * Make a multipart/form-data request with Bearer token auth.
 */
export async function pdfVaultBearerRequestWithFiles(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	binaryItems: Array<{ fieldName: string; binaryData: IBinaryData; buffer: Buffer }>,
	additionalFields?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('pdfVaultApi');
	const accessToken = credentials.accessToken as string;
	if (!accessToken) {
		throw new Error(
			'Access Token is required for this operation. Add it in your PDF Vault credentials under "Access Token".',
		);
	}

	const formData: IDataObject = {};

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

	const options: IRequestOptions = {
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
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as JsonObject).message as string | undefined,
		});
	}
}

/**
 * Get binary data from an n8n binary property, returning the buffer.
 */
export async function getBinaryDataBuffer(
	execFunctions: IExecuteFunctions,
	itemIndex: number,
	propertyName: string,
): Promise<{ buffer: Buffer; binaryData: IBinaryData }> {
	const binaryData = execFunctions.helpers.assertBinaryData(itemIndex, propertyName);
	const buffer = await execFunctions.helpers.getBinaryDataBuffer(itemIndex, propertyName);
	return { buffer, binaryData };
}

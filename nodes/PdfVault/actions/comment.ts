import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { pdfVaultBearerRequest } from '../GenericFunctions';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['comment'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Add a comment to a document', action: 'Create a comment' },
			{ name: 'Delete', value: 'delete', description: 'Delete a comment', action: 'Delete a comment' },
			{ name: 'List', value: 'list', description: 'List comments for a document (threaded)', action: 'List comments' },
			{ name: 'Reply', value: 'reply', description: 'Reply to an existing comment', action: 'Reply to a comment' },
			{ name: 'Resolve', value: 'resolve', description: 'Resolve or unresolve a comment', action: 'Resolve a comment' },
			{ name: 'Update', value: 'update', description: 'Edit a comment', action: 'Update a comment' },
		],
		default: 'list',
	},
];

export const commentFields: INodeProperties[] = [
	// List — File ID
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		description: 'The vault file ID or workspace file ID',
		displayOptions: { show: { resource: ['comment'], operation: ['list', 'create'] } },
	},

	// Create — Content
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
	},
	{
		displayName: 'Position (Optional)',
		name: 'position',
		type: 'collection',
		placeholder: 'Add Position',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
		options: [
			{ displayName: 'Page Number', name: 'pageNumber', type: 'number', default: 1 },
			{ displayName: 'X Position (%)', name: 'xPosition', type: 'number', default: 0 },
			{ displayName: 'Y Position (%)', name: 'yPosition', type: 'number', default: 0 },
		],
	},

	// Reply — Parent Comment ID + content
	{
		displayName: 'Parent Comment ID',
		name: 'parentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['reply'] } },
	},
	{
		displayName: 'File ID',
		name: 'replyFileId',
		type: 'string',
		required: true,
		default: '',
		description: 'The file ID the comment belongs to',
		displayOptions: { show: { resource: ['comment'], operation: ['reply'] } },
	},
	{
		displayName: 'Content',
		name: 'replyContent',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['reply'] } },
	},

	// Comment ID for update, delete, resolve
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['update', 'delete', 'resolve'] } },
	},

	// Update — Content
	{
		displayName: 'Content',
		name: 'updateContent',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['update'] } },
	},

	// Resolve — resolved status
	{
		displayName: 'Resolved',
		name: 'resolved',
		type: 'boolean',
		default: true,
		description: 'Whether to resolve (true) or unresolve (false) the comment',
		displayOptions: { show: { resource: ['comment'], operation: ['resolve'] } },
	},
];

export async function executeCommentOperation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const returnData: INodeExecutionData[] = [];

	if (operation === 'list') {
		const fileId = this.getNodeParameter('fileId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'GET', '/v1/comments', undefined, { fileId });
		const comments = Array.isArray(response) ? response : (response.comments ?? response) as IDataObject[];
		if (Array.isArray(comments)) {
			for (const c of comments) {
				returnData.push({ json: c as IDataObject });
			}
		} else {
			returnData.push({ json: response });
		}

	} else if (operation === 'create') {
		const fileId = this.getNodeParameter('fileId', itemIndex) as string;
		const content = this.getNodeParameter('content', itemIndex) as string;
		const position = this.getNodeParameter('position', itemIndex, {}) as IDataObject;

		const body: IDataObject = { fileId, content };
		if (position.pageNumber) body.pageNumber = position.pageNumber;
		if (position.xPosition) body.xPosition = position.xPosition;
		if (position.yPosition) body.yPosition = position.yPosition;

		const response = await pdfVaultBearerRequest.call(this, 'POST', '/v1/comments', body);
		returnData.push({ json: response });

	} else if (operation === 'reply') {
		const fileId = this.getNodeParameter('replyFileId', itemIndex) as string;
		const parentId = this.getNodeParameter('parentId', itemIndex) as string;
		const content = this.getNodeParameter('replyContent', itemIndex) as string;

		const response = await pdfVaultBearerRequest.call(this, 'POST', '/v1/comments', { fileId, content, parentId });
		returnData.push({ json: response });

	} else if (operation === 'update') {
		const commentId = this.getNodeParameter('commentId', itemIndex) as string;
		const content = this.getNodeParameter('updateContent', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'PATCH', `/v1/comments/${commentId}`, { content });
		returnData.push({ json: response });

	} else if (operation === 'delete') {
		const commentId = this.getNodeParameter('commentId', itemIndex) as string;
		const response = await pdfVaultBearerRequest.call(this, 'DELETE', `/v1/comments/${commentId}`);
		returnData.push({ json: response });

	} else if (operation === 'resolve') {
		const commentId = this.getNodeParameter('commentId', itemIndex) as string;
		const resolved = this.getNodeParameter('resolved', itemIndex) as boolean;
		const response = await pdfVaultBearerRequest.call(this, 'PATCH', `/v1/comments/${commentId}`, { resolved });
		returnData.push({ json: response });
	}

	return returnData;
}

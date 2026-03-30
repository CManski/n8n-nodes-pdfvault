"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceFields = exports.workspaceOperations = void 0;
exports.executeWorkspaceOperation = executeWorkspaceOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.workspaceOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['workspace'] } },
        options: [
            { name: 'Accept Invite', value: 'acceptInvite', description: 'Accept a workspace invite', action: 'Accept workspace invite' },
            { name: 'Create', value: 'create', description: 'Create a new workspace', action: 'Create a workspace' },
            { name: 'Delete', value: 'delete', description: 'Delete a workspace', action: 'Delete a workspace' },
            { name: 'Delete File', value: 'deleteFile', description: 'Delete a file from a workspace', action: 'Delete workspace file' },
            { name: 'Download File', value: 'downloadFile', description: 'Download a file from a workspace', action: 'Download workspace file' },
            { name: 'Invite Member', value: 'inviteMember', description: 'Invite a member to a workspace', action: 'Invite workspace member' },
            { name: 'List', value: 'list', description: 'List all workspaces', action: 'List workspaces' },
            { name: 'List Files', value: 'listFiles', description: 'List files in a workspace', action: 'List workspace files' },
            { name: 'Remove Member', value: 'removeMember', description: 'Remove a member from a workspace', action: 'Remove workspace member' },
            { name: 'Update', value: 'update', description: 'Update a workspace', action: 'Update a workspace' },
            { name: 'Update Member', value: 'updateMember', description: 'Update member role', action: 'Update workspace member' },
            { name: 'Upload File', value: 'uploadFile', description: 'Upload a file to a workspace', action: 'Upload workspace file' },
        ],
        default: 'list',
    },
];
exports.workspaceFields = [
    // Workspace ID — used by most operations except create/list
    {
        displayName: 'Workspace ID',
        name: 'workspaceId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['update', 'delete', 'inviteMember', 'removeMember', 'updateMember', 'acceptInvite', 'uploadFile', 'listFiles', 'deleteFile', 'downloadFile'] } },
    },
    // Create — name + description
    {
        displayName: 'Name',
        name: 'workspaceName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['create'] } },
    },
    {
        displayName: 'Description',
        name: 'workspaceDescription',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['create'] } },
    },
    // Update fields
    {
        displayName: 'Update Fields',
        name: 'workspaceUpdateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['workspace'], operation: ['update'] } },
        options: [
            { displayName: 'Name', name: 'name', type: 'string', default: '' },
            { displayName: 'Description', name: 'description', type: 'string', default: '' },
        ],
    },
    // Invite Member — email + role
    {
        displayName: 'Email',
        name: 'memberEmail',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'member@example.com',
        displayOptions: { show: { resource: ['workspace'], operation: ['inviteMember'] } },
    },
    {
        displayName: 'Role',
        name: 'memberRole',
        type: 'options',
        options: [
            { name: 'Editor', value: 'editor' },
            { name: 'Viewer', value: 'viewer' },
        ],
        default: 'editor',
        displayOptions: { show: { resource: ['workspace'], operation: ['inviteMember'] } },
    },
    // Member ID for remove/update
    {
        displayName: 'Member ID',
        name: 'workspaceMemberId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['removeMember', 'updateMember'] } },
    },
    // Update Member — role
    {
        displayName: 'New Role',
        name: 'newMemberRole',
        type: 'options',
        options: [
            { name: 'Editor', value: 'editor' },
            { name: 'Viewer', value: 'viewer' },
        ],
        default: 'editor',
        displayOptions: { show: { resource: ['workspace'], operation: ['updateMember'] } },
    },
    // Accept Invite — token
    {
        displayName: 'Invite Token',
        name: 'workspaceInviteToken',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['acceptInvite'] } },
    },
    // Upload File — binary
    {
        displayName: 'Binary Property',
        name: 'fileBinaryProperty',
        type: 'string',
        default: 'data',
        description: 'Name of the binary property containing the file to upload',
        displayOptions: { show: { resource: ['workspace'], operation: ['uploadFile'] } },
    },
    // File ID for delete/download
    {
        displayName: 'File ID',
        name: 'workspaceFileId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workspace'], operation: ['deleteFile', 'downloadFile'] } },
    },
];
async function executeWorkspaceOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    if (operation === 'create') {
        const name = this.getNodeParameter('workspaceName', itemIndex);
        const description = this.getNodeParameter('workspaceDescription', itemIndex);
        const body = { name };
        if (description)
            body.description = description;
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', '/v1/workspaces', body);
        returnData.push({ json: response });
    }
    else if (operation === 'list') {
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'GET', '/v1/workspaces');
        returnData.push({ json: response });
    }
    else if (operation === 'update') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const updateFields = this.getNodeParameter('workspaceUpdateFields', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'PATCH', `/v1/workspaces/${workspaceId}`, updateFields);
        returnData.push({ json: response });
    }
    else if (operation === 'delete') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'DELETE', `/v1/workspaces/${workspaceId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'inviteMember') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const email = this.getNodeParameter('memberEmail', itemIndex);
        const role = this.getNodeParameter('memberRole', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', `/v1/workspaces/${workspaceId}/members`, { email, role });
        returnData.push({ json: response });
    }
    else if (operation === 'removeMember') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const memberId = this.getNodeParameter('workspaceMemberId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'DELETE', `/v1/workspaces/${workspaceId}/members/${memberId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'updateMember') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const memberId = this.getNodeParameter('workspaceMemberId', itemIndex);
        const role = this.getNodeParameter('newMemberRole', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'PATCH', `/v1/workspaces/${workspaceId}/members/${memberId}`, { role });
        returnData.push({ json: response });
    }
    else if (operation === 'acceptInvite') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const token = this.getNodeParameter('workspaceInviteToken', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', `/v1/workspaces/${workspaceId}/accept-invite`, { token });
        returnData.push({ json: response });
    }
    else if (operation === 'uploadFile') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const { buffer, binaryData } = await (0, GenericFunctions_1.getBinaryDataBuffer)(this, itemIndex, this.getNodeParameter('fileBinaryProperty', itemIndex));
        const response = await GenericFunctions_1.pdfVaultBearerRequestWithFiles.call(this, 'POST', `/v1/workspaces/${workspaceId}/files`, [
            { fieldName: 'file', binaryData, buffer },
        ]);
        returnData.push({ json: response });
    }
    else if (operation === 'listFiles') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'GET', `/v1/workspaces/${workspaceId}/files`);
        const files = (response.files ?? response);
        if (Array.isArray(files)) {
            for (const f of files) {
                returnData.push({ json: f });
            }
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'deleteFile') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const fileId = this.getNodeParameter('workspaceFileId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'DELETE', `/v1/workspaces/${workspaceId}/files/${fileId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'downloadFile') {
        const workspaceId = this.getNodeParameter('workspaceId', itemIndex);
        const fileId = this.getNodeParameter('workspaceFileId', itemIndex);
        const fileBuffer = await GenericFunctions_1.downloadPdfResult.call(this, `/v1/workspaces/${workspaceId}/files/${fileId}/download`);
        const binaryItem = await this.helpers.prepareBinaryData(fileBuffer, 'download.pdf', 'application/pdf');
        returnData.push({ json: { success: true }, binary: { data: binaryItem } });
    }
    return returnData;
}
//# sourceMappingURL=workspace.js.map
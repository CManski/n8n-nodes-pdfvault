"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamFields = exports.teamOperations = void 0;
exports.executeTeamOperation = executeTeamOperation;
const GenericFunctions_1 = require("../GenericFunctions");
exports.teamOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['team'] } },
        options: [
            { name: 'Accept Invite', value: 'acceptInvite', description: 'Accept a team invite', action: 'Accept team invite' },
            { name: 'Create', value: 'create', description: 'Create a new team', action: 'Create a team' },
            { name: 'Get', value: 'get', description: 'Get team details and pending invites', action: 'Get team details' },
            { name: 'Invite Member', value: 'inviteMember', description: 'Invite a team member by email', action: 'Invite team member' },
            { name: 'List Members', value: 'listMembers', description: 'List all team members', action: 'List team members' },
            { name: 'Remove Member', value: 'removeMember', description: 'Remove a team member', action: 'Remove team member' },
            { name: 'Update', value: 'update', description: 'Update team name', action: 'Update team' },
            { name: 'Update Member', value: 'updateMember', description: 'Update a member\'s role or limits', action: 'Update team member' },
        ],
        default: 'get',
    },
];
exports.teamFields = [
    // Create / Update — Team Name
    {
        displayName: 'Team Name',
        name: 'teamName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['team'], operation: ['create', 'update'] } },
    },
    // Invite Member — Email
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'member@example.com',
        displayOptions: { show: { resource: ['team'], operation: ['inviteMember'] } },
    },
    {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
            { name: 'Admin', value: 'admin' },
            { name: 'Member', value: 'member' },
        ],
        default: 'member',
        displayOptions: { show: { resource: ['team'], operation: ['inviteMember'] } },
    },
    // Member ID for update/remove
    {
        displayName: 'Member ID',
        name: 'memberId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['team'], operation: ['updateMember', 'removeMember'] } },
    },
    // Update Member fields
    {
        displayName: 'Update Fields',
        name: 'memberUpdateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['team'], operation: ['updateMember'] } },
        options: [
            {
                displayName: 'Role',
                name: 'role',
                type: 'options',
                options: [
                    { name: 'Admin', value: 'admin' },
                    { name: 'Member', value: 'member' },
                ],
                default: 'member',
            },
            { displayName: 'Storage Limit (MB)', name: 'storage_limit', type: 'number', default: 0 },
            { displayName: 'Credit Limit', name: 'credit_limit', type: 'number', default: 0 },
            { displayName: 'QR Limit', name: 'qr_limit', type: 'number', default: 0 },
            { displayName: 'URL Limit', name: 'url_limit', type: 'number', default: 0 },
        ],
    },
    // Accept Invite — Token
    {
        displayName: 'Invite Token',
        name: 'inviteToken',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['team'], operation: ['acceptInvite'] } },
    },
];
async function executeTeamOperation(itemIndex) {
    const operation = this.getNodeParameter('operation', itemIndex);
    const returnData = [];
    if (operation === 'create') {
        const name = this.getNodeParameter('teamName', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', '/v1/teams', { name });
        returnData.push({ json: response });
    }
    else if (operation === 'get') {
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'GET', '/v1/teams');
        returnData.push({ json: response });
    }
    else if (operation === 'update') {
        const name = this.getNodeParameter('teamName', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'PATCH', '/v1/teams', { name });
        returnData.push({ json: response });
    }
    else if (operation === 'inviteMember') {
        const email = this.getNodeParameter('email', itemIndex);
        const role = this.getNodeParameter('role', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', '/v1/teams/members', { email, role });
        returnData.push({ json: response });
    }
    else if (operation === 'listMembers') {
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'GET', '/v1/teams/members');
        const members = (response.members ?? response);
        if (Array.isArray(members)) {
            for (const m of members) {
                returnData.push({ json: m });
            }
        }
        else {
            returnData.push({ json: response });
        }
    }
    else if (operation === 'updateMember') {
        const memberId = this.getNodeParameter('memberId', itemIndex);
        const updateFields = this.getNodeParameter('memberUpdateFields', itemIndex, {});
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'PATCH', `/v1/teams/members/${memberId}`, updateFields);
        returnData.push({ json: response });
    }
    else if (operation === 'removeMember') {
        const memberId = this.getNodeParameter('memberId', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'DELETE', `/v1/teams/members/${memberId}`);
        returnData.push({ json: response });
    }
    else if (operation === 'acceptInvite') {
        const token = this.getNodeParameter('inviteToken', itemIndex);
        const response = await GenericFunctions_1.pdfVaultBearerRequest.call(this, 'POST', '/v1/teams/accept-invite', { token });
        returnData.push({ json: response });
    }
    return returnData;
}
//# sourceMappingURL=team.js.map
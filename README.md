# n8n-nodes-pdfvault

[n8n](https://n8n.io/) community node for [PDF Vault](https://pdfvault.app) — a privacy-first PDF toolkit API.

82 operations across 11 resources: PDF processing, AI document intelligence, electronic signatures, QR codes, URL shortener, templates, webhooks, teams, workspaces, bulk eSign, and document comments.

## Installation

In your n8n instance:

1. Go to **Settings > Community Nodes**
2. Select **Install a community node**
3. Enter `n8n-nodes-pdfvault`
4. Click **Install**

Or install via CLI:

```bash
cd ~/.n8n
npm install n8n-nodes-pdfvault
```

## Credentials

You need a **PDF Vault API Key** (required) and optionally an **Access Token** for eSign/Team/Workspace operations.

| Field | Required | Where to get it |
|-------|----------|----------------|
| **API Key** | Yes | [pdfvault.app](https://pdfvault.app) > API Dashboard > Create Key |
| **Access Token** | For eSign, Teams, Workspaces, Bulk eSign, Comments | Supabase auth session token |

The API Key is validated automatically against `GET /v1/balance` when you save credentials.

## Resources & Operations

### PDF (13 operations) — API Key auth

| Operation | Description | Credits |
|-----------|-------------|---------|
| Merge | Combine multiple PDFs into one | 2/page |
| Split | Extract page ranges from a PDF | 1/page |
| Compress | Reduce file size (screen/low/medium/high quality) | 3/page |
| Watermark | Add text watermark with opacity, rotation, color | 2/page |
| Flatten | Flatten form fields | 1/page |
| Metadata | Read or set title, author, subject, keywords | 1 flat |
| Page Numbers | Add page numbers with position and format | 2/page |
| Image Stamp | Stamp image/signature at percentage coordinates | 2/page |
| Crop | Crop pages with percentage-based crop box | 2/page |
| Delete Pages | Remove specific pages | 1/page |
| Rotate | Rotate pages 90/180/270 degrees | 1/page |
| Image to PDF | Convert images to PDF (A4/Letter/Legal/fit) | 1/image |
| URL to PDF | Convert webpage to PDF via headless browser | 10 flat |

### AI (7 operations) — API Key auth

| Operation | Description | Credits |
|-----------|-------------|---------|
| Summarize | Brief or detailed summary | 8-100 |
| Chat | Ask questions about document content | 8-100 |
| Extract | Structured JSON extraction with optional schema | 8-100 |
| Classify | Auto-categorize into 14 document types | 8-100 |
| Redact | Detect PII (SSN, email, phone, etc.) | 8-100 |
| Translate | Translate to 50+ languages | 8-100 |
| Analyze Contract | Extract parties, obligations, risks, deadlines | 8-100 |

Model options: GPT-4o Mini (8cr), Claude Haiku (25cr), Claude Sonnet (100cr).

### Template (7 operations) — API Key auth

| Operation | Description | Credits |
|-----------|-------------|---------|
| Upload | Upload a PDF template | Free |
| List | List all templates | Free |
| Get | Get template and field schema | Free |
| Update | Update template name, description, fields | Free |
| Delete | Delete a template | Free |
| Detect Fields | Re-detect form fields | Free |
| Generate | Fill template with data, produce PDF | 5 |

### QR Code (7 operations) — API Key auth

| Operation | Description | Credits |
|-----------|-------------|---------|
| Create | Create dynamic or static QR code | 1-2 |
| List | List all QR codes | Free |
| Get | Get QR code details | Free |
| Get Image | Download QR code as SVG | Free |
| Update | Update destination URL, label, active status | Free |
| Stats | Scan analytics for a QR code | 1 |
| Delete | Delete a QR code | Free |

### Short URL (6 operations) — API Key auth

| Operation | Description | Credits |
|-----------|-------------|---------|
| Create | Create a short URL | 1 |
| List | List all short URLs | Free |
| Get | Get short URL details | Free |
| Update | Update destination, label, active | Free |
| Stats | Click analytics | 1 |
| Delete | Delete a short URL | Free |

### Webhook (5 operations) — API Key auth

| Operation | Description |
|-----------|-------------|
| Create | Register a webhook endpoint for events |
| List | List all webhooks |
| Update | Update URL, events, active status |
| Delete | Delete a webhook |
| Test | Send a test event |

Events: `esign.signed`, `esign.completed`, `vault.shared`, `vault.accessed`, `qr.scanned`, `url.clicked`, `api.processed`, `template.generated`

### eSign (6 operations) — Access Token required

| Operation | Description |
|-----------|-------------|
| Create | Upload PDF with signing zones, send to recipient(s) |
| List | List all eSign requests |
| Cancel | Cancel a pending eSign request |
| Download Signed | Download the signed PDF (optional certificate append) |
| Download Certificate | Download standalone certificate of completion |
| Audit Trail | Get full audit log for a request |

Supports multi-signer (up to 6) with sequential or parallel signing modes.

### Team (8 operations) — Access Token required

| Operation | Description |
|-----------|-------------|
| Create | Create a new team |
| Get | Get team details and pending invites |
| Update | Update team name |
| Invite Member | Invite by email with role (admin/member) |
| List Members | List all team members |
| Update Member | Update role and resource limits |
| Remove Member | Remove a team member |
| Accept Invite | Accept a team invite by token |

### Workspace (12 operations) — Access Token required

| Operation | Description |
|-----------|-------------|
| Create | Create a collaborative workspace |
| List | List all workspaces (owned + member) |
| Update | Update name and description |
| Delete | Delete a workspace |
| Invite Member | Invite by email (editor/viewer) |
| Remove Member | Remove a member |
| Update Member | Change member role |
| Accept Invite | Accept workspace invite |
| Upload File | Upload a file to workspace |
| List Files | List files in workspace |
| Download File | Download a workspace file |
| Delete File | Delete a workspace file |

### eSign Bulk (5 operations) — Access Token required

| Operation | Description |
|-----------|-------------|
| Create | Send document to up to 100 recipients |
| List | List all bulk send jobs |
| Get | Get job details with recipient statuses |
| Remind | Remind unsigned recipients |
| Cancel | Cancel a bulk send job |

### Comment (6 operations) — Access Token required

| Operation | Description |
|-----------|-------------|
| Create | Add a comment to a document (with optional position) |
| List | List threaded comments for a file |
| Reply | Reply to an existing comment |
| Update | Edit a comment |
| Delete | Delete a comment |
| Resolve | Resolve or unresolve a comment |

## Example Workflow

**Merge invoices and email the result:**

1. **Trigger** (e.g., webhook, schedule, or manual)
2. **HTTP Request** — fetch PDF files
3. **PDF Vault** — Merge operation with binary properties `data,data1`
4. **Send Email** — attach the merged PDF from binary output

**AI-powered document processing:**

1. **Trigger** — new file in cloud storage
2. **PDF Vault** — AI Classify to detect document type
3. **IF** — route by classification (invoice, contract, receipt...)
4. **PDF Vault** — AI Extract for structured data
5. **Google Sheets / Database** — store extracted fields

## API Documentation

Full API docs: [pdfvault.app](https://pdfvault.app) (API Dashboard > Documentation tab)

OpenAPI spec: `https://pdfvault.app/openapi.json`

## Credit System

Most operations cost credits. Check your balance anytime with `GET /v1/balance`. Plans:

| Plan | Monthly Credits | Price |
|------|----------------|-------|
| Free | 50 | $0 |
| Pro | 5,000 | $5/mo |
| Power | 25,000 | $19/mo |
| Complete | 75,000 | $39/mo |

## License

MIT

## Links

- [PDF Vault](https://pdfvault.app)
- [API Documentation](https://pdfvault.app)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

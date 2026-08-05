# 📧 Cloudflare SuperMail

<div align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**One platform. Infinite possibilities.**

*Disposable throwaways for signups. Professional addresses for your business. Developer inboxes for testing. All under your domain, all free.*

[Features](#-features) • [Quick Start](#-quick-start) • [Use Cases](#-use-cases) • [Deployment](#-deployment) • [Configuration](#-configuration)

</div>

---

## 🌟 What is SuperMail?

**SuperMail** is a self-hosted email platform that runs 100% free on Cloudflare.

**Use it your way:**
- 🎭 **Disposable addresses** — sign up anywhere without revealing your real email
- 💼 **Business email** — professional addresses for your startup or side project
- 🧪 **Developer testing** — generate inboxes on the fly for QA and automation
- 🤖 **Automation** — receive notifications via Telegram, integrate with webhooks
- 📦 **Bulk operations** — create hundreds of addresses in seconds

**Why SuperMail?**
- ✉️ **Send & receive** — full bidirectional email, not just a inbox viewer
- 📎 **Attachments** — send and receive files
- 🔍 **Search & export** — find anything, backup everything
- 💰 **100% free** — no credit card, no surprise bills, ever
- 🔒 **Your data stays yours** — self-hosted, no tracking, no ads

---

## 🎯 Use Cases

### 🎭 Privacy Shield
Use disposable addresses for signups. Keep your real inbox clean. Delete the address when you're done.

### 💼 Small Business Email
Professional email on your domain without paying for Google Workspace or Microsoft 365. `hello@yourbusiness.com`, `support@yourbusiness.com` — all free.

### 🧪 Developer Testing
Generate test inboxes instantly. Perfect for QA, CI/CD pipelines, and testing email flows. No more `test+random@gmail.com` hacks.

### 🤖 Automation & Notifications
Receive alerts via Telegram. Forward emails via webhooks. Build workflows that react to incoming mail.

### 📦 Bulk Operations
Need 100 addresses? 1000? Create them in seconds with fake names or custom patterns. Export credentials in one click.

---

## ✨ Features

### 📬 Complete Email Solution
- **Send & Receive** — Full bidirectional email support
- **Unlimited Addresses** — Create as many disposable addresses as you need
- **Attachments** — Receive and download files (S3/R2 storage)
- **Export** — Download emails as EML, CSV, or JSON
- **Search & Filter** — Find emails by sender, subject, or date
- **Auto-Refresh** — Inbox updates automatically

### 🤖 Smart Integrations
- **Telegram Bot** — Get instant notifications for new emails
- **Global Push** — Notify for ALL incoming emails, not just bound ones
- **Bulk Bind** — Connect multiple addresses to Telegram at once
- **Webhook Support** — Forward emails to external services

### 👨‍💼 Admin Power Tools
- **Bulk Create** — Generate 100s of addresses with fake names
- **Batch Management** — Select and manage multiple addresses
- **Statistics** — View email counts and activity
- **One-Click Copy** — Copy emails, JWTs, or both in batch

### 🌐 Modern Experience
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode** — Easy on the eyes (default theme)
- **Multi-language** — 6 languages supported
- **No Signup** — Start using immediately

### 🔒 Enterprise-Grade Security
- **JWT Auth** — Secure API authentication
- **Admin Protection** — Password-protected admin panel
- **Address Passwords** — Optional per-address security
- **No Tracking** — Your privacy is our priority

---

## 💰 100% Free to Run

**SuperMail runs entirely on Cloudflare's free tier.** No credit card needed, no surprise charges.

| Service | Free Limit |
|---------|------------|
| Workers | 100,000 requests/day |
| D1 Database | 5 GB storage |
| KV Storage | 1 GB |
| R2 Storage | 10 GB (no egress fees!) |
| Email Receiving | **Unlimited** |
| Email Sending | 100/day |

👉 **See [DEPLOYMENT.md](DEPLOYMENT.md#-keeping-it-free---important-limits) for tips on staying free**

---

## 🚀 Quick Start

### For Non-Technical Users

👉 **See [DEPLOYMENT.md](DEPLOYMENT.md) for a step-by-step guide with screenshots**

### For Developers

#### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) (free plan works)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

#### 1. Clone & Install

```bash
git clone https://github.com/michaelxer/cloudflare_supermail.git
cd cloudflare_supermail

# Install worker dependencies
cd worker && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

#### 2. Configure & Deploy

```bash
# Copy and edit config
cd ../worker
cp wrangler.toml.template wrangler.toml
# Edit wrangler.toml with your settings

# Create resources
npx wrangler d1 create supermail-db
npx wrangler kv namespace create KV

# Deploy worker
npx wrangler deploy

# Deploy frontend
cd ../frontend
echo "VITE_API_BASE=https://your-worker-url" > .env
npm run build
npx wrangler pages deploy dist --project-name=supermail --branch=production
```

---

## 🛠️ Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## ⚙️ Configuration

### Worker Variables (wrangler.toml)

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for JWT tokens | `your-random-secret` |
| `ADMIN_PASSWORDS` | Admin panel passwords | `["your-password"]` |
| `DEFAULT_DOMAINS` | Default email domains | `["yourdomain.com"]` |
| `DOMAINS` | All available domains | `["yourdomain.com"]` |
| `PREFIX` | Email address prefix | `tmp` |
| `TITLE` | Site title | `Cloudflare SuperMail` |
| `COPYRIGHT` | Footer copyright | `Your Name` |
| `DEFAULT_LANG` | Default language | `en` |

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `ENABLE_USER_CREATE_EMAIL` | Allow users to create addresses | `true` |
| `ENABLE_USER_DELETE_EMAIL` | Allow users to delete emails | `true` |
| `ENABLE_AUTO_REPLY` | Enable auto-reply feature | `false` |
| `ENABLE_TG_PUSH_ATTACHMENT` | Send attachments via Telegram | `true` |
| `ENABLE_MAIL_GZIP` | Compress emails in database | `true` |

---

## ➕ Adding More Domains

After your initial deployment, you can add additional domains to SuperMail.

### Steps to Add a New Domain

1. **Add domain to Cloudflare Dashboard**
   - Add your domain to Cloudflare (DNS → Add a domain)
   - Update nameservers at your registrar
   - Wait for Active status

2. **Enable Email Routing**
   - Dashboard → Your domain → Email → Email Routing → Get started
   - Cloudflare will add MX records automatically → Click "Add records and enable"

3. **Set catch-all rule**
   - Email Routing → Routing rules → Catch-all address
   - Action: `Send to a Worker`
   - Destination: `supermail-worker`
   - Toggle: Enabled → Save

4. **Update wrangler.toml**
   - Edit `worker/wrangler.toml`
   - Add your new domain to these 3 lines:
   ```toml
   SEND_MAIL_DOMAINS = ["domain1.com", "domain2.com", "newdomain.com"]
   DEFAULT_DOMAINS = ["domain1.com", "domain2.com", "newdomain.com"]
   DOMAINS = ["domain1.com", "domain2.com", "newdomain.com"]
   ```

5. **Deploy worker**
   ```bash
   cd worker
   npx wrangler deploy
   ```

That's it! The new domain will appear in the dropdown automatically. No frontend rebuild needed.

### Optional: Email Sending Setup

To send emails from the new domain (with verified badge, better deliverability):

1. Dashboard → Your domain → Email → Email Sending → Add domain
2. Cloudflare adds DKIM/SPF records → Click "Add records"
3. Wait for "Verified" status (~5-10 minutes)

**Note:** You can skip this if you only want to receive emails. Sending works without it, but may land in spam.

---

## 📡 API Reference

### Authentication
```http
POST /api/address_login
Content-Type: application/json
{ "address": "user@yourdomain.com", "password": "optional" }
```

### List Emails
```http
GET /api/mails?limit=20&offset=0&subject=search
Authorization: Bearer <token>
```

### Send Email
```http
POST /api/send_mail
Authorization: Bearer <token>
Content-Type: application/json
{ "from": "sender@yourdomain.com", "to": ["recipient@example.com"], "subject": "Hello", "text": "Body" }
```

### Export Emails
```http
GET /api/export?format=json&limit=100
Authorization: Bearer <token>
```

### 🤖 External Integration (For Agents & Automation Scripts)

SuperMail provides a clean API for external AI agents, automation scripts, and other workflows to create disposable email addresses, read parsed mails, and delete addresses programmatically — no IMAP, no browser automation, no Turnstile.

> **In-app reference**: Open the admin panel → **Mail API** tab for full interactive documentation with copy-paste curl/Python/JavaScript examples.

#### Authentication

| Gate | Header | Scope |
|------|--------|-------|
| Admin password | `x-admin-auth: <ADMIN_PASSWORDS[0]>` | All `/admin/*` routes |
| Address JWT | `Authorization: Bearer <jwt>` | All `/api/*` routes |

The JWT is returned **inline** in the create-address response — no separate login step needed.

#### Live Endpoints

**1. Create address** (returns JWT inline)
```http
POST /admin/new_address
x-admin-auth: <admin-password>
Content-Type: application/json
{ "name": "agent123", "domain": "yourdomain.com", "enablePrefix": false, "enableRandomSubdomain": false }
```
Response:
```json
{ "jwt": "eyJ...", "address": "agent123@yourdomain.com", "password": null, "address_id": 1234 }
```

**2. Read parsed mails** (MIME pre-parsed server-side)
```http
GET /api/parsed_mails?limit=20&offset=0
Authorization: Bearer <jwt>
```
Response:
```json
{
  "results": [
    { "id": 5678, "address": "...", "sender": "no-reply@example.com",
      "subject": "Your verification code", "text": "Your code is 482-915. ...",
      "html": "<html>...", "attachments": [], "created_at": "..." }
  ],
  "count": 1
}
```
The `text` field is pre-parsed plaintext — regex OTPs directly from it, no MIME parsing needed on the client side.

**3. Delete address** (cascading deletes handled server-side)
```http
DELETE /admin/delete_address/<address_id>
x-admin-auth: <admin-password>
```

#### Full Workflow Example (curl)

```bash
# 1. Create address → get JWT
curl -X POST https://your-worker.workers.dev/admin/new_address \
  -H "x-admin-auth: <admin-password>" \
  -H "Content-Type: application/json" \
  -d '{"name":"agent123","domain":"yourdomain.com","enablePrefix":false,"enableRandomSubdomain":false}'

# 2. Poll for parsed mails (use JWT from step 1)
curl "https://your-worker.workers.dev/api/parsed_mails?limit=20&offset=0" \
  -H "Authorization: Bearer eyJ..."

# 3. Delete address when done
curl -X DELETE https://your-worker.workers.dev/admin/delete_address/1234 \
  -H "x-admin-auth: <admin-password>"
```

Python and JavaScript examples are available in the **Mail API** tab in the admin panel.

#### Planned Endpoints (Nice-to-have, Not Blocking)

| Priority | Feature | Endpoint | Est. LOC |
|----------|---------|----------|----------|
| HIGH | Bulk create addresses | `POST /admin/bulk_new_address` | ~40 |
| HIGH | Filter parsed mails by sender | `GET /api/parsed_mails?sender=x.ai` | ~10 |
| MEDIUM | Webhook push at creation | `POST /admin/new_address` accepts `webhook_url` | ~15 |
| LOW | Delete address by name | `DELETE /admin/delete_address/:idorName` | ~5 |
| LOW | List available domains | `GET /api/domains` | ~3 |

See [`HANDOFF_DOC/SUPERMAIL-API-REQUIREMENTS.md`](HANDOFF_DOC/SUPERMAIL-API-REQUIREMENTS.md) for the full integration spec.

#### ⚠️ Anti-patterns (Do NOT Break These)

- **Do NOT add Turnstile to `/admin/new_address`** — automation scripts cannot solve Turnstile. The admin path must stay token-only.
- **Do NOT require `ENABLE_ADDRESS_PASSWORD = true` for admin create** — the admin path returns JWT without a password. `ENABLE_ADDRESS_PASSWORD` only gates the user-facing `/api/address_login`.
- **Do NOT remove the `jwt` field from `POST /admin/new_address` response** — external scripts depend on it being inline.
- **Do NOT change the `parsed_mails` response shape** — the `text` field being pre-parsed plaintext is the core value. Moving it to a different field or requiring a follow-up call breaks every polling loop.

#### Integration Prompt for Other Agents

Copy this to any AI agent (Cursor, ChatGPT, Claude, etc) that needs to integrate with SuperMail:

```text
I have a SuperMail email platform running on Cloudflare with a clean API 
for external integration. You can use it for disposable email addresses, 
OTP retrieval, or any automation workflow needing email.

PRODUCTION URL: https://production.supermail-5oe.pages.dev
ADMIN PASSWORD: <set in wrangler.toml ADMIN_PASSWORDS>

QUICK START — 3 endpoints:
1. POST /admin/new_address (header: x-admin-auth) → returns {jwt, address, address_id}
2. GET /api/parsed_mails?limit=20 (header: Authorization: Bearer <jwt>) → returns pre-parsed mails with "text" field
3. DELETE /admin/delete_address/<address_id> (header: x-admin-auth)

The "text" field in parsed_mails is pre-parsed plaintext — regex OTPs 
directly, no MIME parsing needed client-side.

Full docs: open admin panel → Mail API tab.
Spec: HANDOFF_DOC/SUPERMAIL-API-REQUIREMENTS.md
```

---

## 📁 Project Structure

```
cloudflare_supermail/
├── worker/                    # Cloudflare Worker backend
│   ├── src/
│   │   ├── mails_api/        # Email API endpoints
│   │   ├── user_api/         # User management API
│   │   ├── admin_api/        # Admin panel API
│   │   ├── telegram_api/     # Telegram bot integration
│   │   ├── email/            # Email processing
│   │   └── i18n/             # Translations
│   └── wrangler.toml.template
├── frontend/                  # Vue.js frontend
│   ├── src/
│   │   ├── views/            # Page views
│   │   ├── components/       # Vue components
│   │   ├── api/              # API client
│   │   └── i18n/             # Translations
│   └── package.json
├── DEPLOYMENT.md              # Non-technical deployment guide
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Naive UI](https://www.naiveui.com/) - Vue 3 component library
- [Hono](https://hono.dev/) - Ultrafast web framework for the Edge

---

## ✨ Credits

This project was built with inspiration from these excellent open-source projects:

- **[cloudflare_temp_email](https://github.com/dreamhunter2333/cloudflare_temp_email)** by [dreamhunter2333](https://github.com/dreamhunter2333) - The original Cloudflare temp email implementation
- **[cloud-mail](https://github.com/maillab/cloud-mail)** by [maillab](https://github.com/maillab) - Additional features and architecture inspiration

We've cherry-picked the best features from both projects and added our own improvements including bulk account management, fake name generation, enhanced Telegram integration, and more.

---

<div align="center">

**[⬆ Back to Top](#-cloudflare-supermail)**

</div>

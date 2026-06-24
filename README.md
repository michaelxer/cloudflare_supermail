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

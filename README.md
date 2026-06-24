# 📧 Cloudflare SuperMail

<div align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**Full-featured temporary email service powered by Cloudflare Workers**

*Receive emails • Send emails • Telegram notifications • Bulk management • Export • Search*

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Configuration](#-configuration) • [API Reference](#-api-reference)

</div>

---

## ✨ Features

### 📬 Email Management
- **Unlimited Disposable Addresses** - Create as many temp email addresses as you need
- **Send Emails** - Reply to received emails or compose new ones from your temp addresses
- **Receive Attachments** - View and download email attachments
- **Export Emails** - Download as EML, CSV, or JSON for backup
- **Search & Filter** - Find emails by sender, subject, or date range
- **Auto-Refresh** - Inbox updates automatically every 5-10 seconds

### 🤖 Telegram Integration
- **Telegram Bot** - Receive email notifications via Telegram (@savelokalbot)
- **Global Mail Push** - Get notified for ALL incoming emails
- **Bulk Bind** - Bind multiple addresses to Telegram at once
- **Mobile Friendly** - Read emails directly in Telegram

### 👨‍💼 Admin Panel
- **Bulk Create Accounts** - Generate multiple addresses with fake names
- **Bulk Management** - Select and manage multiple addresses at once
- **Statistics Dashboard** - View total addresses, emails, and activity
- **One-Click Copy** - Copy emails, JWTs, or both in batch

### 🌐 User Experience
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark Mode** - Easy on the eyes (default theme)
- **Multi-language** - English, Chinese, Japanese, German, Spanish, Portuguese
- **No Registration** - Start using immediately, no signup required

### 🔐 Security & Privacy
- **JWT Authentication** - Secure API access with tokens
- **Admin Password** - Protected admin panel
- **Address Passwords** - Optional password protection for addresses
- **No Tracking** - Your privacy is respected

---

## 🚀 Quick Start

### For Non-Technical Users

👉 **See [DEPLOYMENT.md](DEPLOYMENT.md) for a step-by-step guide with screenshots**

### For Developers

#### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) (free plan works)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

#### 1. Clone the Repository

```bash
git clone https://github.com/michaelxer/cloudflare_supermail.git
cd cloudflare_supermail
```

#### 2. Install Dependencies

```bash
# Install worker dependencies
cd worker
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 3. Configure Environment

```bash
# Copy example config
cd worker
cp wrangler.toml.template wrangler.toml

# Edit wrangler.toml with your settings:
# - JWT_SECRET (any random string)
# - ADMIN_PASSWORDS (your admin password)
# - DEFAULT_DOMAINS (your domain)
# - DOMAINS (your domain)
```

#### 4. Deploy

```bash
# Create D1 database
npx wrangler d1 create supermail-db
# Copy the database_id to wrangler.toml

# Create KV namespace
npx wrangler kv namespace create KV
# Copy the id to wrangler.toml

# Set Telegram bot token (optional)
echo "YOUR_BOT_TOKEN" | npx wrangler secret put TELEGRAM_BOT_TOKEN

# Deploy worker
npx wrangler deploy

# Build and deploy frontend
cd ../frontend
echo "VITE_API_BASE=https://your-worker.your-domain.com" > .env
npm run build
npx wrangler pages deploy dist --project-name=supermail --branch=production
```

---

## 🛠️ Deployment

### Detailed Deployment Guide

1. **Create Cloudflare Resources**
   ```bash
   # Create D1 database
   npx wrangler d1 create supermail-db
   # Note the database_id from output
   
   # Create KV namespace
   npx wrangler kv namespace create KV
   # Note the id from output
   ```

2. **Update wrangler.toml**
   - Set `database_id` from step 1
   - Set `id` from step 1
   - Set `JWT_SECRET` to any random string
   - Set `ADMIN_PASSWORDS` to your desired password
   - Set `DEFAULT_DOMAINS` and `DOMAINS` to your domain

3. **Set Secrets**
   ```bash
   # Telegram bot token (optional)
   echo "YOUR_BOT_TOKEN" | npx wrangler secret put TELEGRAM_BOT_TOKEN
   ```

4. **Deploy Worker**
   ```bash
   cd worker
   npx wrangler deploy
   ```

5. **Configure Frontend**
   ```bash
   cd frontend
   echo "VITE_API_BASE=https://your-worker-url" > .env
   npm run build
   ```

6. **Deploy Frontend**
   ```bash
   npx wrangler pages deploy dist --project-name=supermail --branch=production
   ```

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
| `COPYRIGHT` | Footer copyright text | `Your Name` |
| `DEFAULT_LANG` | Default language | `en` |
| `TG_MAX_ADDRESS` | Max Telegram addresses | `9999` |

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

{
  "address": "user@yourdomain.com",
  "password": "optional-password"
}
```

### List Emails

```http
GET /api/mails?limit=20&offset=0&subject=search&source=sender@example.com
Authorization: Bearer <token>
```

### Send Email

```http
POST /api/send_mail
Authorization: Bearer <token>
Content-Type: application/json

{
  "from": "sender@yourdomain.com",
  "to": ["recipient@example.com"],
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>"
}
```

### Export Emails

```http
GET /api/export?format=json&limit=100&offset=0
Authorization: Bearer <token>
```

**Formats:** `json`, `csv`, `eml`

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

<div align="center">

**[⬆ Back to Top](#-cloudflare-supermail)**

</div>

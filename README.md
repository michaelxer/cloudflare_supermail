# 📧 Cloudflare SuperMail

<div align="center">

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**Full-featured temporary email service powered by Cloudflare Workers**

*Receive emails • Send emails • OAuth2 • Passkey • S3 attachments • Telegram bot • Multi-language*

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Configuration](#-configuration) • [API Reference](#-api-reference)

</div>

---

## ✨ Features

### 🔐 Authentication & Security
- **User Login System** - Email/password registration and login
- **OAuth2 Support** - Google, GitHub, Discord, and custom OAuth2 providers
- **Passkey (WebAuthn)** - Passwordless authentication with hardware keys
- **Address Password** - Optional password protection for email addresses
- **JWT Tokens** - Secure API authentication

### 📬 Email Management
- **Receive Emails** - Unlimited disposable email addresses
- **Send Emails** - Multiple backends (Cloudflare Email, Resend, SMTP)
- **Auto Reply** - Configurable auto-reply rules
- **Search & Filter** - Server-side search by subject, sender, date range
- **Export Emails** - Export to JSON, CSV, or EML format
- **Auto-Refresh** - Real-time inbox updates with configurable intervals

### 📎 Attachments
- **S3 Storage** - Receive and store attachments via S3-compatible storage
- **Presigned URLs** - Secure direct upload/download
- **Multiple Providers** - AWS S3, R2, MinIO, and more

### 🤖 Integrations
- **Telegram Bot** - Receive and manage emails via Telegram
- **Webhook Support** - Forward emails to external services
- **SMTP/IMAP Proxy** - Access via standard email clients

### 🌐 User Experience
- **Responsive Design** - Works on desktop and mobile
- **Dark/Light Theme** - Automatic or manual theme switching
- **Multi-language** - English, Chinese, Japanese, German, Spanish, Portuguese
- **Bulk Operations** - Select and download/delete multiple emails

### 👨‍💼 Admin Panel
- **User Management** - View and manage all users
- **Address Management** - Create, edit, delete addresses
- **Statistics Dashboard** - Email counts, user activity
- **System Settings** - Configure domains, features, limits

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### 1. Clone the Repository

```bash
git clone https://github.com/michaelxer/cloudflare_supermail.git
cd cloudflare_supermail
```

### 2. Install Dependencies

```bash
# Install worker dependencies
cd worker
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment

```bash
# Copy example config
cp wrangler.toml.template wrangler.toml

# Edit wrangler.toml with your settings
# - CLOUDFLARE_ACCOUNT_ID
# - CLOUDFLARE_API_TOKEN
# - JWT_SECRET
# - S3 credentials (optional)
```

### 4. Deploy

```bash
# Deploy worker
cd worker
npm run deploy

# Build and deploy frontend
cd ../frontend
npm run build
# Deploy to Cloudflare Pages or your preferred hosting
```

---

## 🛠️ Deployment

### Worker Deployment

1. **Create D1 Database**
   ```bash
   wrangler d1 create supermail-db
   ```

2. **Update wrangler.toml** with your database ID

3. **Run Database Migrations**
   ```bash
   wrangler d1 migrations apply supermail-db
   ```

4. **Deploy Worker**
   ```bash
   npm run deploy
   ```

### Frontend Deployment

**Option A: Cloudflare Pages**
```bash
cd frontend
npm run build
wrangler pages deploy dist
```

**Option B: Vercel/Netlify**
```bash
cd frontend
npm run build
# Upload dist/ folder to your hosting provider
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `S3_BUCKET` | S3 bucket for attachments | No |
| `S3_REGION` | S3 region | No |
| `S3_ACCESS_KEY_ID` | S3 access key | No |
| `S3_SECRET_ACCESS_KEY` | S3 secret key | No |
| `RESEND_API_KEY` | Resend API key for sending | No |
| `SMTP_HOST` | SMTP server host | No |
| `SMTP_PORT` | SMTP server port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `ENABLE_USER_CREATE_EMAIL` | Allow users to create addresses | `true` |
| `ENABLE_USER_DELETE_EMAIL` | Allow users to delete emails | `true` |
| `ENABLE_AUTO_REPLY` | Enable auto-reply feature | `false` |
| `ENABLE_ATTACHMENT` | Enable S3 attachments | `false` |
| `ENABLE_WEBHOOK` | Enable webhook support | `false` |
| `ENABLE_ADDRESS_PASSWORD` | Require password for addresses | `false` |

---

## 📡 API Reference

### Authentication

```http
POST /api/address_login
Content-Type: application/json

{
  "address": "user@example.com",
  "password": "optional-password"
}
```

### List Emails

```http
GET /api/mails?limit=20&offset=0&subject=search&source=sender@example.com&date_from=2024-01-01&date_to=2024-12-31
Authorization: Bearer <token>
```

### Export Emails

```http
GET /api/export?format=json&limit=100&offset=0
Authorization: Bearer <token>
```

**Formats:** `json`, `csv`, `eml`

### Send Email

```http
POST /api/send_mail
Authorization: Bearer <token>
Content-Type: application/json

{
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>"
}
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
│   │   ├── common.ts         # Shared utilities
│   │   └── index.ts          # Main entry point
│   └── wrangler.toml.template
├── frontend/                  # Vue.js frontend
│   ├── src/
│   │   ├── components/       # Vue components
│   │   ├── views/            # Page views
│   │   ├── api/              # API client
│   │   └── i18n/             # Translations
│   └── package.json
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

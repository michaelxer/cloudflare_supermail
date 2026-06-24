# 🚀 Cloudflare SuperMail - Deployment Guide for Beginners

**No coding experience needed!** This guide will walk you through setting up your own temporary email service step by step.

---

## 📋 What You'll Need

1. **A Cloudflare Account** (free) - [Sign up here](https://dash.cloudflare.com/sign-up)
2. **A Domain Name** - You can buy one from Cloudflare, Namecheap, or GoDaddy
3. **A Computer** - Windows, Mac, or Linux
4. **30 Minutes** - That's it!

---

## 🎯 What You'll Get

- Your own email service (like Gmail, but private!)
- Unlimited disposable email addresses
- Send and receive emails
- **Attachments support** (stored in R2)
- Telegram notifications for new emails
- Admin panel to manage everything
- Export emails as backup

---

## 📝 Step 1: Create a Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Enter your email and create a password
3. Click **"Create Account"**
4. Verify your email address

---

## 🌐 Step 2: Add Your Domain to Cloudflare

1. In Cloudflare dashboard, click **"Add a Site"**
2. Enter your domain name (e.g., `yourdomain.com`)
3. Select **"Free"** plan
4. Click **"Continue"**
5. Cloudflare will give you **2 nameservers**
6. Go to your domain registrar (where you bought the domain)
7. Change the nameservers to the ones Cloudflare gave you
8. Wait 5-10 minutes for DNS to propagate

---

## 💻 Step 3: Install Required Software

### Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (left button)
3. Run the installer
4. Click "Next" through everything
5. Restart your computer

### Install Wrangler (Cloudflare CLI)

1. Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux)
2. Type this and press Enter:
   ```bash
   npm install -g wrangler
   ```
3. Wait for it to finish

---

## 🔑 Step 4: Login to Cloudflare

1. Open **Command Prompt** or **Terminal**
2. Type this and press Enter:
   ```bash
   wrangler login
   ```
3. A browser window will open
4. Click **"Allow"** to authorize Wrangler
5. Go back to the terminal

---

## 📥 Step 5: Download the Project

1. Go to [https://github.com/michaelxer/cloudflare_supermail](https://github.com/michaelxer/cloudflare_supermail)
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to your Desktop

---

## ⚙️ Step 6: Configure the Project

### Open the project folder

1. Open **Command Prompt** or **Terminal**
2. Navigate to the project folder:
   ```bash
   cd Desktop/cloudflare_supermail
   ```

### Create your configuration file

1. Go to the `worker` folder:
   ```bash
   cd worker
   ```
2. Copy the template:
   ```bash
   copy wrangler.toml.template wrangler.toml
   ```
   (On Mac/Linux: `cp wrangler.toml.template wrangler.toml`)

3. Open `wrangler.toml` in **Notepad** (Windows) or **TextEdit** (Mac)
4. Find and change these lines:

   ```toml
   # Change this to your domain
   DEFAULT_DOMAINS = ["yourdomain.com"]
   DOMAINS = ["yourdomain.com"]
   
   # Change this to your desired admin password
   ADMIN_PASSWORDS = ["your-password-here"]
   
   # Change this to any random string (for security)
   JWT_SECRET = "make-up-any-random-string-here"
   
   # Change this to your site title
   TITLE = "My Temp Email"
   ```

5. Save the file

---

## 🗄️ Step 7: Create Database

1. In **Command Prompt** or **Terminal** (make sure you're in the `worker` folder):
   ```bash
   wrangler d1 create supermail-db
   ```

2. You'll see something like:
   ```
   ✅ Created D1 database 'supermail-db'
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

3. **Copy the database_id** (the text in quotes)

4. Open `wrangler.toml` again and replace `xxx` with your database_id:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "supermail-db"
   database_id = "paste-your-database-id-here"
   ```

5. Save the file

---

## 🔑 Step 8: Create Storage (KV)

1. In **Command Prompt** or **Terminal**:
   ```bash
   wrangler kv namespace create KV
   ```

2. You'll see something like:
   ```
   ✅ Created KV namespace 'KV'
   id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

3. **Copy the id** (the text in quotes)

4. Open `wrangler.toml` and replace `xxx` with your id:
   ```toml
   [[kv_namespaces]]
   binding = "KV"
   id = "paste-your-id-here"
   ```

5. Save the file

---

## 📎 Step 9: Create R2 Storage for Attachments (Optional)

**Skip this if you don't need attachment support**

1. In **Command Prompt** or **Terminal** (make sure you're in the `worker` folder):
   ```bash
   wrangler r2 bucket create supermail-attachments
   ```

2. You'll see:
   ```
   ✅ Created bucket 'supermail-attachments'
   ```

3. Open `wrangler.toml` and add this at the end:
   ```toml
   [[r2_buckets]]
   binding = "S3_BUCKET"
   bucket_name = "supermail-attachments"
   ```

4. Save the file

---

## 🤖 Step 10: Setup Telegram Bot (Optional)

**Skip this if you don't want Telegram notifications**

### Create a Telegram Bot

1. Open Telegram on your phone
2. Search for **@BotFather**
3. Send `/newbot`
4. Enter a name for your bot (e.g., "My Email Bot")
5. Enter a username (must end in `bot`, e.g., `myemailbot`)
6. **Copy the bot token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Set the Bot Token

1. In **Command Prompt** or **Terminal** (in the `worker` folder):
   ```bash
   echo YOUR_BOT_TOKEN | wrangler secret put TELEGRAM_BOT_TOKEN
   ```
   Replace `YOUR_BOT_TOKEN` with the token you copied

2. Press Enter

### Get Your Chat ID

1. In Telegram, search for **@userinfobot**
2. Send `/start`
3. **Copy your ID** (a number like `123456789`)

### Configure Telegram Settings

1. Open `wrangler.toml`
2. Add this line under `[vars]`:
   ```toml
   TG_MAX_ADDRESS = 9999
   ```

---

## 🚀 Step 11: Deploy the Worker

1. In **Command Prompt** or **Terminal** (in the `worker` folder):
   ```bash
   wrangler deploy
   ```

2. Wait for it to finish (1-2 minutes)

3. You'll see something like:
   ```
   ✨ Success! Uploaded supermail-worker
   Deployed supermail-worker triggers
     api.yourdomain.com (custom domain)
   ```

4. **Copy the URL** (e.g., `api.yourdomain.com`)

---

## 🎨 Step 12: Deploy the Frontend

1. Go to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Create the environment file:
   ```bash
   echo VITE_API_BASE=https://api.yourdomain.com > .env
   ```
   Replace `api.yourdomain.com` with your worker URL from Step 10

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the frontend:
   ```bash
   npm run build
   ```

5. Create a Pages project:
   ```bash
   wrangler pages project create supermail --production-branch=main
   ```

6. Deploy the frontend:
   ```bash
   wrangler pages deploy dist --project-name=supermail --branch=production
   ```

7. You'll see something like:
   ```
   ✨ Deployment complete!
   https://supermail-xxx.pages.dev
   ```

8. **Save this URL** - this is your email service!

---

## ✅ Step 13: Test Your Email Service

1. Open your browser
2. Go to your frontend URL (from Step 11)
3. You should see the email service homepage
4. Click **"Create Address"** to create your first temp email
5. Send a test email to that address
6. Check if it appears in your inbox!

---

## 🎉 Congratulations!

You now have your own temporary email service! 

### Your Admin Panel

- **URL**: `https://supermail-xxx.pages.dev/en/admin`
- **Password**: Whatever you set in Step 6

### What You Can Do

- ✅ Create unlimited email addresses
- ✅ Receive emails instantly
- ✅ Send emails from your temp addresses
- ✅ **Send and receive attachments**
- ✅ Get Telegram notifications
- ✅ Export emails as backup
- ✅ Search and filter emails
- ✅ Manage everything from admin panel

---

## 🆘 Troubleshooting

### "Worker not found" error
- Make sure you're in the `worker` folder when running `wrangler deploy`

### "Database not found" error
- Double-check the `database_id` in `wrangler.toml`

### Frontend shows "Nothing here yet"
- Wait 2-3 minutes for deployment to complete
- Make sure you deployed to production branch

### Emails not arriving
- Check if Email Routing is enabled in Cloudflare dashboard
- Go to your domain → Email → Email Routing
- Make sure "Catch-all" is enabled and points to your worker

### Telegram not working
- Make sure you set the bot token secret correctly
- Check that your chat ID is correct

---

## 📞 Need Help?

- Open an issue on GitHub: [https://github.com/michaelxer/cloudflare_supermail/issues](https://github.com/michaelxer/cloudflare_supermail/issues)

---

## 🔄 Updating Your Deployment

When new versions are released:

1. Download the new ZIP
2. Extract and replace your files
3. Run these commands:
   ```bash
   cd worker
   wrangler deploy
   cd ../frontend
   npm run build
   wrangler pages deploy dist --project-name=supermail --branch=production
   ```

---

## 🛡️ Security Tips

- Use a strong admin password
- Don't share your `wrangler.toml` file
- Keep your `.env` file private
- Regularly check for updates

---

**Enjoy your new email service! 🎊**

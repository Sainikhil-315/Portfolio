# EmailJS to Resend Migration Guide

This guide explains how to complete the migration from EmailJS to Resend for your portfolio contact form.

## What Changed

- ✅ Removed `@emailjs/browser` dependency
- ✅ Created a backend API server (`/server`) with Express.js
- ✅ Updated Contact.tsx to call the backend API
- ✅ Added environment configuration files

## Setup Instructions

### 1. Get Your Resend API Key

1. Visit [https://resend.com](https://resend.com)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key (you'll get 200 requests/day on free tier)
5. Copy the API key

### 2. Configure Backend Environment

Create a `.env` file in the `/server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file:

```
RESEND_API_KEY=your_actual_resend_api_key_here
RECIPIENT_EMAIL=sainikhilmullapudi1604@gmail.com
CLIENT_URL=http://localhost:5173
PORT=3001
```

Replace:
- `your_actual_resend_api_key_here` with your Resend API key
- `sainikhilmullapudi1604@gmail.com` with your email address (where form submissions will be sent)

### 3. Install Backend Dependencies

```bash
cd server
npm install
# or
bun install
```

### 4. Verify Frontend Configuration

The frontend (`.env.local`) is already configured:

```
VITE_API_URL=http://localhost:3001
```

For production, update this to your deployed server URL.

### 5. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
# or
bun run dev
```

Should see: `Email server running on port 3001`

**Terminal 2 - Frontend (in project root):**
```bash
npm run dev
# or
bun run dev
```

### 6. Test the Contact Form

1. Open http://localhost:5173 in your browser
2. Navigate to the Contact section
3. Fill out the form and click "Send Message"
4. You should see a modal with "Send via Email" option
5. Click "Send via Email" to test
6. You should receive an email at the configured recipient email address

## Resend Email Format

The email template is HTML-formatted with:
- Sender information (name, email, phone)
- Message content displayed cleanly
- Professional styling
- Reply-to set to the form submitter's email

## Features

✨ **200 requests/day** on Resend free tier - perfect for a portfolio
🚀 **Production-ready** - Use same service in production
📧 **Professional emails** - Pre-formatted HTML templates
🔒 **Secure** - API key kept on backend, never exposed to frontend
⚡ **Fast** - Email delivery in seconds

## Troubleshooting

### "Connection refused" or can't reach API
- Make sure backend server is running on port 3001
- Check `VITE_API_URL` in frontend `.env.local`
- Verify CORS is configured correctly (CLIENT_URL in backend .env)

### "Failed to send email"
- Verify your Resend API key is correct
- Check that you're within the 200 requests/day limit (free tier)
- Ensure RECIPIENT_EMAIL is set correctly in server `.env`

### Email not received
- Check your spam/junk folder
- Verify the recipient email address in server `.env`
- Check Resend dashboard for delivery status

## Production Deployment

### Deploying Backend

Options:
1. **Vercel** - Deploy Express server easily
2. **Railway** - Simple Node.js hosting
3. **Render** - Free tier available
4. **Heroku** - Paid option

Update these for production:
1. Set `RESEND_API_KEY` in production environment
2. Update `VITE_API_URL` in frontend to your production backend URL
3. Update `CLIENT_URL` in backend for CORS

### Verifying First Email

After setup, test with the form. Your first email should arrive within seconds.

## File Structure

```
Portfolio/
├── src/
│   └── components/
│       └── Contact.tsx (updated to use API)
├── server/
│   ├── server.js (Express + Resend)
│   ├── package.json
│   └── .env (create this)
├── .env.local (created)
└── .env.example (created)
```

## API Documentation

### POST /api/send-email

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 234 567 8900",
  "message": "Your message here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "id": "email_id_from_resend"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **Express Docs**: https://expressjs.com
- **Error in logs**: Check server terminal output for detailed errors

---

Happy emailing! 🚀

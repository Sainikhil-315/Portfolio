import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiters
const emailLimiter = rateLimit({
  windowMs: parseInt(process.env.EMAIL_RATE_WINDOW || '3600000'), // default: 1 hour in ms
  max: parseInt(process.env.EMAIL_RATE_MAX || '5'), // Max 5 emails per hour per IP
  message: 'Too many emails sent from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.GENERAL_RATE_WINDOW || '900000'), // default: 15 min in ms
  max: parseInt(process.env.GENERAL_RATE_MAX || '100'), // Max 100 requests per 15 min per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// Send email endpoint (with stricter rate limit)
app.post('/api/send-email', emailLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message'
      });
    }

    // Send email using Resend
    const result = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use your domain email after verifying in Resend
      to: process.env.RECIPIENT_EMAIL || 'sainikhilmullapudi1604@gmail.com',
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <p><strong style="color: #374151;">Name:</strong> ${escapeHtml(name)}</p>
            <p><strong style="color: #374151;">Email:</strong> ${escapeHtml(email)}</p>
            <p><strong style="color: #374151;">Phone:</strong> ${phone ? escapeHtml(phone) : 'Not provided'}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p><strong style="color: #374151;">Message:</strong></p>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">This email was sent from your portfolio contact form.</p>
        </div>
      `
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email'
      });
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      id: result.data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
  console.log(`CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

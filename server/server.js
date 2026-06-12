import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const emailLimiter = rateLimit({
  windowMs: parseInt(process.env.EMAIL_RATE_WINDOW || '3600000'),
  max: parseInt(process.env.EMAIL_RATE_MAX || '5'),
  message: 'Too many emails sent from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.GENERAL_RATE_WINDOW || '900000'),
  max: parseInt(process.env.GENERAL_RATE_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      process.env.CLIENT_URL || 'https://portfoliosainikhil.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/', generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

app.post('/api/send-email', emailLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, email, and message' });
    }
    const result = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
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
      return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
    res.json({ success: true, message: 'Email sent successfully', id: result.data.id });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

let leetcodeCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 6 * 60 * 60 * 1000,
};

app.get('/api/leetcode-stats', async (req, res) => {
  try {
    const username = process.env.LEETCODE_USERNAME || 'Sai_Nikhil_315';

    if (leetcodeCache.data && leetcodeCache.timestamp) {
      const now = Date.now();
      if (now - leetcodeCache.timestamp < leetcodeCache.CACHE_DURATION) {
        console.log('Returning cached LeetCode stats');
        return res.json({
          success: true,
          data: leetcodeCache.data,
          cached: true,
          lastUpdated: new Date(leetcodeCache.timestamp)
        });
      }
    }

    // Single query fetching everything including contest history
    const query = `{
      matchedUser(username: "${username}") {
        username
        profile {
          userAvatar
          realName
          aboutMe
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        userCalendar {
          submissionCalendar
        }
      }
      userContestRanking(username: "${username}") {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      userContestRankingHistory(username: "${username}") {
        attended
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }`;

    console.log('Fetching LeetCode stats for:', username);

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com/'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LeetCode API error - Status: ${response.status}, Response:`, errorText);
      throw new Error(`LeetCode API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('LeetCode GraphQL errors:', result.errors);
      throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
    }

    if (!result.data?.matchedUser) {
      console.error('No matchedUser in response:', result.data);
      return res.status(404).json({ success: false, error: 'LeetCode user not found' });
    }

    const userData = result.data.matchedUser;
    const contestData = result.data.userContestRanking;
    const contestHistory = result.data.userContestRankingHistory || [];

    const allItem = userData.submitStats?.acSubmissionNum?.find(item => item.difficulty === 'All') || { count: 0, submissions: 0 };
    const easyItem = userData.submitStats?.acSubmissionNum?.find(item => item.difficulty === 'Easy') || { count: 0, submissions: 0 };
    const mediumItem = userData.submitStats?.acSubmissionNum?.find(item => item.difficulty === 'Medium') || { count: 0, submissions: 0 };
    const hardItem = userData.submitStats?.acSubmissionNum?.find(item => item.difficulty === 'Hard') || { count: 0, submissions: 0 };

    let totalSubmissions = 0;
    if (userData.userCalendar?.submissionCalendar) {
      const calendar = JSON.parse(userData.userCalendar.submissionCalendar);
      totalSubmissions = Object.values(calendar).reduce((sum, count) => sum + count, 0);
    }

    const stats = {
      username: userData.username,
      avatar: userData.profile?.userAvatar,
      realName: userData.profile?.realName,
      aboutMe: userData.profile?.aboutMe,
      problemsSolved: {
        total: allItem.count,
        easy: easyItem.count,
        medium: mediumItem.count,
        hard: hardItem.count,
        easySub: easyItem.submissions,
        mediumSub: mediumItem.submissions,
        hardSub: hardItem.submissions
      },
      submissions: {
        total: allItem.submissions,
        calendar: userData.userCalendar?.submissionCalendar || '{}'
      },
      contest: {
        attended: contestData?.attendedContestsCount || 0,
        rating: Math.round(contestData?.rating * 100) / 100 || 0,
        ranking: contestData?.globalRanking || 0,
        totalParticipants: contestData?.totalParticipants || 0,
        topPercentage: Math.round(contestData?.topPercentage * 100) / 100 || 0
      },
      // Only include attended contests with valid ratings, sorted by time
      contestHistory: contestHistory
        .filter(h => h.attended && h.rating > 0)
        .sort((a, b) => a.contest.startTime - b.contest.startTime),
      stats: {
        totalSubmissions,
      }
    };

    console.log('Successfully fetched LeetCode stats. Contest history entries:', stats.contestHistory.length);

    leetcodeCache.data = stats;
    leetcodeCache.timestamp = Date.now();

    res.json({
      success: true,
      data: stats,
      cached: false,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('LeetCode stats error:', error);

    if (leetcodeCache.data) {
      return res.json({
        success: true,
        data: leetcodeCache.data,
        cached: true,
        stale: true,
        lastUpdated: new Date(leetcodeCache.timestamp),
        error: error instanceof Error ? error.message : 'Using stale cache due to fetch error'
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch LeetCode stats'
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
  console.log(`CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
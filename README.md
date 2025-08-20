# ROAR – Mini Mining App (Next.js + MongoDB)

## Quick Start
1. `npm install`
2. Create `.env.local` (see below)
3. `npm run dev`

### Environment Variables (.env.local)
```
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_digit_app_password
CLAIM_INTERVAL=14400
```

## Features
- Splash (animated logo + ROAR) → Login (Email OTP+Password / Google) → App UI
- Mining: **+8 ROAR** per claim, every **4h** (configurable via `CLAIM_INTERVAL` seconds)
- Referrals: **+4 ROAR** to referrer when user signs up via `?ref=CODE`
- Friends Leaderboard: sorted **by number of referrals**
- Challenges: Daily/Weekly tasks with rewards
- MongoDB (Mongoose), JWT, NextAuth (Google), Gmail SMTP (Nodemailer)

## Seed a Challenge (optional)
Insert in `challenges` collection:
```
{ "title":"Claim 3 times", "description":"Claim 3 times in a day", "reward":5, "type":"daily", "active":true }
```

## Deploy on Vercel
- Push to GitHub → Import on Vercel
- Add **Environment Variables**
- Deploy 🚀

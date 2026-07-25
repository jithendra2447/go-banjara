# 🚀 Go Banjara 2.0 — Complete Production Setup & Operating Guide

Welcome to **Go Banjara 2.0**, an end-to-end travel booking and lifestyle e-commerce platform built with Next.js 15, TypeScript, MongoDB Atlas, Prisma ORM, and Razorpay.

---

## 🛠️ 1. Tech Stack Overview

- **Framework**: Next.js 15.2 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS & Modern Glassmorphism Design System
- **Database**: MongoDB Atlas (`gobanjara` cluster) via Prisma ORM v6
- **Payments**: Razorpay Gateway (Client SDK + HMAC SHA-256 Signature Verification API)
- **Authentication**: Password Authentication, Cryptographic 6-Digit Mobile OTP, Google OAuth 2.0
- **Cloud Storage**: Cloudflare R2 Storage (Zero-Egress Bandwidth)
- **Hosting & CDN**: Vercel Production (`https://go-banjara-1pvk.vercel.app`)

---

## ⚙️ 2. Environment Variables (`.env`)

Create or verify a `.env` file in the root directory:

```env
# MongoDB Atlas Database Connection
DATABASE_URL="mongodb+srv://<username>:<password>@gobanjara.yfluy0w.mongodb.net/gobanjara?retryWrites=true&w=majority"

# NextAuth & Secret Keys
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay Payment Credentials
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Google OAuth Credentials
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Cloudflare R2 Storage Credentials
R2_BUCKET_NAME="your_r2_bucket_name"
R2_ACCESS_KEY_ID="your_r2_access_key_id"
R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
```

---

## 🚀 3. Local Development Setup

### Step 1: Install Project Dependencies
Open your terminal in the project directory:
```bash
cd "/Users/jv/Go Banjara 2.0"
npm install
```

### Step 2: Sync Prisma Database Models
Generate the Prisma Client matching your MongoDB Atlas schema:
```bash
npx prisma generate
```

### Step 3: Run the Development Server
Start the local server:
```bash
npm run dev
```
Open your browser and visit: **`http://localhost:3000`**

---

## 🗄️ 4. Managing Database & Live Data (Prisma Studio)

To inspect, edit, or search live database documents (Users, Orders, Bookings, Contact Submissions, Newsletter Subscribers):
```bash
npx prisma studio
```
This opens the interactive **Prisma Studio GUI** at `http://localhost:5555`.

---

## 📦 5. Building & Deploying to Production (Vercel)

### Step 1: Run Local Production Build Check
```bash
npm run build
```

### Step 2: Re-link Project to Active Vercel Deployment
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx vercel link --yes --project go-banjara-1pvk
```

### Step 3: Deploy to Vercel Production
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx vercel --prod --yes
```

---

## 🔐 6. Updating Razorpay Keys for Live Transactions

When ready to take live payment transactions:
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Account Settings** → **API Keys** → Generate active key pair.
3. Update `.env`:
   - `RAZORPAY_KEY_ID="your_active_key_id"`
   - `RAZORPAY_KEY_SECRET="your_active_key_secret"`
4. Push environment variables to Vercel:
   ```bash
   NODE_TLS_REJECT_UNAUTHORIZED=0 npx vercel env add RAZORPAY_KEY_ID production <<< "your_active_key_id"
   NODE_TLS_REJECT_UNAUTHORIZED=0 npx vercel env add RAZORPAY_KEY_SECRET production <<< "your_active_key_secret"
   ```
5. Re-deploy with `npx vercel --prod`.

---

## 👑 7. Admin Panel & Account Access

- **Official Live Website**: [https://go-banjara-1pvk.vercel.app](https://go-banjara-1pvk.vercel.app)
- **Super Admin Email**: `gobanjara.trd@gmail.com`
- **Admin Management Portal**: [https://go-banjara-1pvk.vercel.app/admin](https://go-banjara-1pvk.vercel.app/admin)
- **My Profile & Orders**: [https://go-banjara-1pvk.vercel.app/profile](https://go-banjara-1pvk.vercel.app/profile)

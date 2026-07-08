# 🔮 Flash Portal - Free Fire Auto Like Bot SaaS Platform

A premium, highly secure, and performance-optimized web platform exclusively dedicated to the **Free Fire Automatic Likes System** (~220 Likes/day automatic delivery). Players can instantly authenticate using their numerical Free Fire In-Game User ID (UID), inspect auto-like plan tiers, subscribe, and manage deliveries.

---

## 🎨 Visual Identity & Brand Design Core

* **Primary Background**: Matte Deep Charcoal (`#0B0B0F`). Strictly no pure black (`#000000`).
* **Container Surfaces**: Elevated Dark Slate (`#16161F`).
* **Core Accent Tints**: High-Contrast Premium Solid Pink (`#FF2E93`) and Warning/Pending Gold (`#FFD600`).
* **Status Flags**: Success Emerald Green (`#00E676`).
* **Visual Constraint**: Under no circumstances should cheap glowing neon text effects, flashing multi-colored arcade buttons, or low-contrast text structures be introduced. The user interface mimics a premium Fintech SaaS product.
* **Motion Mechanics**: Fluid entry reveals and viewport transitions built with Framer Motion.

---

## 🚀 Key Functional Features

### 1. Passwordless UID Authentication Pipeline
Standard users do not need an email or password to log in.
* **Flow**:
  1. The user inputs their numerical Free Fire UID (8-12 digits) on the landing page hero zone.
  2. The input triggers a micro-scale bounce effect, and a pink circular loader turns.
  3. An internal serverless API route `/api/player-info` is contacted to verify the UID.
  4. The API queries data sources or generates a deterministic gaming nickname (e.g. `〆 Ｔ Ｏ Ｘ Ｉ Ｃ RAX YT 〆`) and region (e.g. `India`, `Bangladesh`, `Singapore`) based on the UID hash.
  5. The profile automatically signs up/syncs with Supabase, generating a secure JWT cookie session and redirecting the user to their dashboard. Banned accounts are blocked instantly.

### 2. Dual Payment Gateway Architecture
* **Channel Alpha (Automated Razorpay)**:
  * Standard client-side checkout overlay pop-up.
  * Serverless webhook (`payment.captured`) updates the subscription status to `active` and calculates the expiration window.
* **Channel Beta (Manual UPI Escrow)**:
  * Renders a clean QR code reflecting the target plan's precise INR amount.
  * Captures a mandatory 12-digit alphanumeric UTR Number.
  * Features a drag-and-drop file uploader that streams screenshot files into the Supabase Storage Bucket `payment-proofs/`.
  * Freezes the subscription status as `pending` until administrative validation.

### 3. Sleek Dark PDF Invoice Canvas
* Compiles transactional data (Transaction Hash/UTR, Plan Name, User UID, Timestamp) into a downloadable, dark-themed invoice PDF immediately upon payment completion.

### 4. Hidden Admin Management Console
To keep the layout clean, admin login access is **hidden from standard users** (no links or buttons exist in public headers/footers).
* **Routes**:
  * `/admin`: Index path that performs client-side session checks and redirects to either `/admin/dashboard` or `/admin/login`.
  * `/admin/login`: Dedicated secure login form for administrators.
  * `/admin/dashboard`: Secure admin control console.
* **Authorized Access**:
  * Default Admin Email: `shekara727@gmail.com`
  * Default Admin Password: `shekara727@gmail.com`
* **Features**:
  * **User Ledger**: Filter users by nickname/UID. Apply Temporary Bans (using a calendar selector) or Permanent Bans. Apply manual plan overrides.
  * **Payment Approval Desk**: Queue showing pending UPI payments. Clicking an item opens a side-by-side verification overlay: UTR on the left, screenshot proof image on the right. Verify with binary buttons: Approve or Reject.
  * **Proofs Showcase Terminal**: File-drop uploader to add screenshots/Mp4 video proofs directly onto the public landing page gallery.
  * **Admin Onboarding**: Create secondary administrator credentials securely through an internal API route `/api/admin/create-user` without disrupting the current admin session.

---

## 🛠️ Database Schema Structure

The database executes relationships across three primary tables:

### 1. `profiles`
* `id` (UUID, Primary Key, references auth.users)
* `uid` (Text, Unique, numerical Free Fire ID)
* `nickname` (Text, Free Fire player name)
* `region` (Text, Player region)
* `avatar_url` (Text, profile icon link)
* `role` (Text, 'user' or 'admin')
* `is_banned` (Boolean)
* `banned_until` (Timestamp, Nullable)
* `hide_profile` (Boolean, Default: True)
* `created_at` (Timestamp)

### 2. `subscriptions`
* `id` (UUID, Primary Key)
* `user_id` (UUID, references profiles.id)
* `plan_id` (UUID, references plans.id)
* `activated_at` (Timestamp)
* `expires_at` (Timestamp)
* `status` (Text, 'active' or 'expired')
* `created_at` (Timestamp)

### 3. `orders`
* `id` (UUID, Primary Key)
* `user_id` (UUID, references profiles.id)
* `plan_id` (UUID, references plans.id)
* `amount` (Numeric)
* `payment_method` (Text, 'razorpay' or 'upi')
* `status` (Text, 'pending', 'approved', 'rejected', 'success')
* `razorpay_order_id` (Text, Nullable)
* `razorpay_payment_id` (Text, Nullable)
* `utr_number` (Text, Nullable)
* `screenshot_url` (Text, Nullable)
* `rejection_reason` (Text, Nullable)
* `created_at` (Timestamp)
* `verified_at` (Timestamp, Nullable)

---

## 📦 Local Boot & Setup Instructions

### 1. Run Schema Setup
Execute the SQL instructions inside `schema.sql` (or subsequent migrations) in your Supabase SQL editor to create the tables, triggers, and RPC functions.

### 2. Configure Environment Keys
Create a `.env.local` file in your root folder:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# SMTP E-mail Configurations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Flash Autolike Bot" <your-email@gmail.com>
```

### 3. Launch Development Server
```bash
npm install
npm run dev
```

### 4. Build Validation
To verify static compilation rules and formatting compatibility:
```bash
npm run build
npm run lint
```
"# Flash-Autolike-Bot" 

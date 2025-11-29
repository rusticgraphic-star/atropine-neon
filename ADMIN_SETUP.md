# Admin Setup Guide

## Setting Up Your First Admin Account

To create your admin account and start managing orders:

### Step 1: Sign Up
1. Go to the `/login` page
2. Since there's no signup UI yet, you'll need to create an account via the backend
3. Open your Cloud tab → Database → Tables
4. Click on `auth.users` and insert a new user record, OR use the Auth UI in Cloud

### Step 2: Create Admin Role
After creating your user account:

1. Open Cloud tab → Database → Tables
2. Find the `user_roles` table
3. Insert a new row:
   - `user_id`: Copy your user ID from auth.users table
   - `role`: Select `admin` from dropdown

### Step 3: Login
1. Go to `/login`
2. Enter your email and password
3. You'll now see the "Admin" link in the navigation
4. Click Admin to access the dashboard

## Admin Features

### Order Management
- View all orders (pending and verified)
- Upload payment screenshots
- Add TradingView activation links
- Verify orders and auto-send WhatsApp confirmation

### QR & Settings Management  
- Update UPI ID (default: atropine@ybl)
- Upload new QR code images
- QR codes are automatically displayed on checkout

## Default Credentials Reference
For testing, you mentioned:
- ID: atropine@2854
- Password: Dio@2854

Remember to create this account in the auth system first!

## Features Implemented

### (A) Scroll to Top
✓ All pages auto-scroll to top on load

### (B) "Subscribe Now" Text
✓ Changed from "Buy Now" to "Subscribe Now" everywhere
✓ Logic remains one-time payment

### (C) UPI ID & QR Upload
✓ Default UPI ID: atropine@ybl
✓ Admin can upload custom QR codes
✓ QR displayed on CheckoutQR page

### (D) Removed Plans from Checkout
✓ Plans pre-selected on product page
✓ Checkout only shows selected plan (read-only)
✓ No plan selector on checkout page

### (E) 2-Step Checkout Flow
✓ Step 1: Customer info form (/checkout)
✓ Step 2: QR payment page (/checkout-qr)
✓ Screenshot upload on QR page
✓ Final submit button on QR page

### (F) Paid Indicators First
✓ Home page shows paid first, then free
✓ Shop page shows paid first, then free

### (G) Admin System
✓ Admin login at /login
✓ Integrated admin dashboard at /admin
✓ Order management with verification
✓ QR and UPI management
✓ Auto-WhatsApp confirmation
✓ View payment screenshots

### (H) Email System
⏸️ Skipped for now (as per your selection)
Can be added later with Resend integration

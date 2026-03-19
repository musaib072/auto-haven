# EmailJS Email Integration Setup Guide

This guide explains how to set up email functionality for both service bookings and contact form submissions using EmailJS.

## Overview

EmailJS handles two types of emails:

1. **Service Booking Emails** - When customers book a service
   - Booking details are sent directly from the frontend to EmailJS
   - EmailJS sends a formatted email to **Autoflexiiii@gmail.com**

2. **Contact Form Emails** - When customers submit the contact form
   - Contact details are sent directly from the frontend to EmailJS
   - EmailJS sends a formatted email to **Autoflexiiii@gmail.com**

Both confirmations are shown to the user after submission.

## Why EmailJS?

- ✅ **Free**: 200 emails/month (perfect for small businesses)
- ✅ **No backend needed**: Works directly from frontend
- ✅ **Easy setup**: Takes 5 minutes
- ✅ **Reliable**: Professional email delivery

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email

## Step 2: Set Up Email Service

### Option A: Use Gmail (Recommended)

1. In EmailJS dashboard, go to **Email Services**
2. Click **"Add Service"**
3. Select **Gmail**
4. Follow the instructions to connect your Gmail account
5. Note the **Service ID** (e.g., `service_xxxxx`)

### Option B: Use Your Custom Email

1. Go to **Email Services → Add Service**
2. Select your email provider (Outlook, Custom SMTP, etc.)
3. Configure accordingly

## Step 3: Create Email Templates

### Template 1: Service Booking Template (template_booking)

1. In EmailJS dashboard, go to **Email Templates**
2. Click **"Create New Template"**
3. Name it: `template_booking`
4. Use this template content:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
      .content { background: white; padding: 20px; }
      .section { margin-bottom: 20px; }
      .section h3 { color: #667eea; margin-top: 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .detail-label { font-weight: bold; color: #555; }
      .detail-value { color: #333; }
      .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🚗 Service Booking Confirmation</h1>
        <p>Thank you for booking with AutoFlexxii!</p>
      </div>
      <div class="content">
        <div class="section">
          <h3>Booking Details</h3>
          <div class="detail-row">
            <span class="detail-label">Service Type:</span>
            <span class="detail-value">{{service_name}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{booking_date}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">{{booking_time}}</span>
          </div>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{customer_name}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">{{customer_phone}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{customer_email}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Vehicle:</span>
            <span class="detail-value">{{vehicle_info}}</span>
          </div>
        </div>

        <div class="section">
          <h3>Additional Notes</h3>
          <p>{{notes}}</p>
        </div>

        <p style="color: #666; margin-top: 20px;">
          Our team will contact you shortly to confirm your appointment.
        </p>
      </div>
      <div class="footer">
        <p>AutoFlexxii © 2026 | All rights reserved</p>
      </div>
    </div>
  </body>
</html>
```

5. In the template:
   - Set **To Email** to: `{{to_email}}`
   - Set **Subject** to: `New Service Booking - {{service_name}}`
   - Set **HTML** to the template above
6. Click **Save**
7. Copy the **Template ID** from the template settings (e.g., `template_booking`)

### Template 2: Contact Form Template (template_contact)

1. Create another new template
2. Name it: `template_contact`
3. Use this template content:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
      .content { background: white; padding: 20px; }
      .section { margin-bottom: 20px; }
      .section h3 { color: #667eea; margin-top: 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .detail-label { font-weight: bold; color: #555; width: 120px; }
      .detail-value { color: #333; flex: 1; }
      .message-box { background: #f5f5f5; padding: 12px; border-left: 4px solid #667eea; margin-top: 10px; }
      .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📧 New Contact Form Submission</h1>
        <p>You have a new message from your website</p>
      </div>
      <div class="content">
        <div class="section">
          <h3>Sender Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{from_name}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{from_email}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">{{phone}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Subject:</span>
            <span class="detail-value">{{subject}}</span>
          </div>
        </div>

        <div class="section">
          <h3>Message</h3>
          <div class="message-box">{{message}}</div>
        </div>

        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          You can reply directly to this email to respond to the sender.
        </p>
      </div>
      <div class="footer">
        <p>AutoFlexxii © 2026 | All rights reserved</p>
      </div>
    </div>
  </body>
</html>
```

4. In the template:
   - Set **To Email** to: `{{to_email}}`
   - Set **Subject** to: `New Contact Form - {{subject}}`
   - Set **HTML** to the template above
5. Click **Save**
6. Copy the **Template ID** (should be `template_contact`)

## Step 4: Get Your Public Key

1. Go to **Account → API Keys**
2. Copy your **Public Key** (starts with something like `xxxxx`)

## Step 5: Update Environment Variables

1. Open (or create) `.env.local` in your project root
2. Add these variables:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=service_autoflexxii
VITE_EMAILJS_TEMPLATE_ID=template_booking
```

Replace:
- `your_public_key_here` with your EmailJS Public Key
- `service_autoflexxii` with your Service ID if different
- `template_booking` with your Template ID if different

## Step 6: Test It

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Test **Service Booking**:
   - Go to `/service`
   - Book a service and check if the email arrives at **Autoflexiiii@gmail.com**

3. Test **Contact Form**:
   - Go to `/contact`
   - Fill out and submit the contact form
   - Verify the email arrives at **Autoflexiiii@gmail.com**

## Troubleshooting

### Issue: "EmailJS is not configured"

- Check that `.env.local` has `VITE_EMAILJS_PUBLIC_KEY` set
- Restart the dev server after adding environment variables

### Issue: Email not received

1. Check your spam/junk folder
2. Verify the recipient email is correct: `Autoflexiiii@gmail.com`
3. Check EmailJS dashboard for failed requests
4. Verify Service ID and Template ID match your setup

### Issue: "Service/Template not found"

- Verify Service ID and Template ID in `.env.local`
- Check EmailJS dashboard to confirm they exist
- Use the exact IDs from your account
- Make sure template names are exactly: `template_booking` and `template_contact`

### Issue: Variables show as "{{variable_name}}" in email

- Make sure all template variables are spelled correctly and match the code
- Service booking variables: `to_email`, `customer_name`, `customer_email`, `customer_phone`, `service_name`, `booking_date`, `booking_time`, `vehicle_info`, `notes`
- Contact form variables: `to_email`, `from_name`, `from_email`, `phone`, `subject`, `message`

## Free Tier Limits

- **200 emails/month**: Perfect for small businesses
- No credit card required
- Upgrade anytime if you need more

## Production Deployment (Vercel)

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add Environment Variables:
     - `VITE_EMAILJS_PUBLIC_KEY`
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`

2. Redeploy your site

## Support

- EmailJS docs: https://www.emailjs.com/docs/
- Email template variables: https://www.emailjs.com/docs/user-guide/dynamic-content/


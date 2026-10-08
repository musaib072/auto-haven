# Email setup — form submissions → Autoflexiiii@gmail.com

Every form on the website emails the business inbox through **EmailJS** (free tier: 200 emails/month).
Each submission gets a reference like `AFX-SPA-261008-7R3C` that the customer sees and that appears in the email subject.

| Form | Page(s) | EmailJS template |
|---|---|---|
| Buy a Car | Home, /buy | `VITE_EMAILJS_CONTACT_TEMPLATE_ID` |
| Sell Your Car (+ photos) | Home, /sell | `VITE_EMAILJS_CONTACT_TEMPLATE_ID` |
| Contact | /contact | `VITE_EMAILJS_CONTACT_TEMPLATE_ID` |
| Door-to-Door Car Spa | Home, /car-spa | `VITE_EMAILJS_BOOKING_TEMPLATE_ID` |
| Inspectify booking | /inspectify | `VITE_EMAILJS_BOOKING_TEMPLATE_ID` |

Only **two** templates are needed — the same two the project already used. Your existing templates keep working with no changes; the new forms put their extra fields into `{{message}}` / `{{notes}}`.

As a safety net, every submission is also saved to the Supabase `enquiries` table (after you apply the migration — see step 5), so a lead is never lost if an email fails. Admins can see them at `/admin` → *Recent enquiries*.

---

## 1. Check the environment variables (most common problem)

The site **cannot send email without `VITE_EMAILJS_PUBLIC_KEY`**. When this audit was done, the local `.env` file did **not** contain any EmailJS keys — so emails will not send locally until you add them.

Add these to **`.env`** (local) **and** to **Vercel → Project → Settings → Environment Variables** (tick Production and Preview), then **redeploy** — Vite bakes them in at build time:

```
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx        # EmailJS → Account → General → Public Key
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx        # EmailJS → Email Services
VITE_EMAILJS_BOOKING_TEMPLATE_ID=template_xxx  # EmailJS → Email Templates (booking)
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_xxx  # EmailJS → Email Templates (contact)
```

> If you previously set `VITE_EMAILJS_TEMPLATE_ID` in Vercel, it is not used — set the two template IDs above.

## 2. Email service

EmailJS → **Email Services → Add Service → Gmail** → connect `Autoflexiiii@gmail.com`. Copy the Service ID.

## 3. Templates

In each template's **Settings** tab:

* **To Email:** `{{to_email}}` (or just type `Autoflexiiii@gmail.com`)
* **Reply To:** leave empty, or `{{reply_to}}`
* **Subject:** see below

### Booking template (Car Spa + Inspectify)

Subject: `{{subject}}`

```html
<div style="background:#0a0a0b;padding:24px;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#111113;border:1px solid #3a3122;border-radius:10px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #3a3122">
      <div style="color:#c9a467;font-size:12px;letter-spacing:3px">AUTOFLEXII · NEW BOOKING</div>
      <div style="color:#f2ede4;font-size:20px;margin-top:6px">{{service_name}}</div>
      <div style="color:#9a8f7a;font-size:12px;margin-top:4px">Ref {{reference}}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:10px 24px;color:#9a8f7a;width:140px">Date</td><td style="padding:10px 24px;color:#f2ede4">{{booking_date}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Time</td><td style="padding:10px 24px;color:#f2ede4">{{booking_time}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Name</td><td style="padding:10px 24px;color:#f2ede4">{{customer_name}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Phone</td><td style="padding:10px 24px;color:#f2ede4">{{customer_phone}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Email</td><td style="padding:10px 24px;color:#f2ede4">{{customer_email}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Vehicle</td><td style="padding:10px 24px;color:#f2ede4">{{vehicle_info}}</td></tr>
    </table>
    <div style="padding:16px 24px 24px;color:#d8d2c6;font-size:13px;line-height:1.6">{{{notes_html}}}</div>
  </div>
</div>
```

### Contact template (Contact, Buy, Sell)

Subject: `{{subject}}`

```html
<div style="background:#0a0a0b;padding:24px;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#111113;border:1px solid #3a3122;border-radius:10px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #3a3122">
      <div style="color:#c9a467;font-size:12px;letter-spacing:3px">AUTOFLEXII · NEW ENQUIRY</div>
      <div style="color:#f2ede4;font-size:18px;margin-top:6px">{{subject}}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:10px 24px;color:#9a8f7a;width:140px">Name</td><td style="padding:10px 24px;color:#f2ede4">{{from_name}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Phone</td><td style="padding:10px 24px;color:#f2ede4">{{phone}}</td></tr>
      <tr><td style="padding:10px 24px;color:#9a8f7a">Email</td><td style="padding:10px 24px;color:#f2ede4">{{from_email}}</td></tr>
    </table>
    <div style="padding:16px 24px 24px;color:#d8d2c6;font-size:13px;line-height:1.6">{{{message_html}}}</div>
  </div>
</div>
```

`{{{triple braces}}}` render the pre-formatted details (one per line, HTML-escaped by the site).
Old templates using `{{message}}` / `{{notes}}` still work — the details just appear on one line in some mail clients.

### All variables sent

* **Booking:** `to_email, reply_to, reference, subject, customer_name, customer_email, customer_phone, service_name, booking_date, booking_time, vehicle_info, notes, notes_html`
* **Contact:** `to_email, reply_to, reference, subject, from_name, from_email, phone, message, message_html`

## 4. Lock it down (recommended)

EmailJS → **Account → Security**:

* **Allowed origins / domains:** add your live domain(s) (e.g. `autoflexii.com`, `your-project.vercel.app`) so nobody can use your public key from another site.
* Optionally enable **reCAPTCHA** and a monthly limit.

The site already adds spam protection: a hidden honeypot field, a minimum fill time, a 30-second per-form cooldown, EmailJS headless-browser blocking and rate limiting.

## 5. Supabase (enquiry backup + seller photos + admin security)

Apply `supabase/migrations/20261008120000_production_hardening.sql` (either `supabase db push` or paste it into **Supabase → SQL Editor → Run**). It:

* creates the `enquiries` table (visitors can insert only; admins can read),
* creates the public `sell-requests` bucket for seller photos (photo links are included in the email),
* restricts editing car listings and car photos to users in `admin_users` (previously **anyone who signed up** could edit or delete listings),
* adds `Autoflexiiii@gmail.com` as an admin if that Supabase Auth user exists.

To add another admin, run in the SQL editor:

```sql
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('someone@example.com');
```

Admin sign-up on the website has been removed — create admin users in **Supabase → Authentication → Users → Add user**.

## 6. Test

1. `npm run dev` → open http://localhost:8080
2. Submit each form (Home: Buy / Sell / Car Spa; /inspectify; /contact).
3. You should see a green "Request received!" toast with a reference number, and the email in `Autoflexiiii@gmail.com` within a minute (check Spam the first time and mark *Not spam*).
4. In the browser console (F12) a warning `VITE_EMAILJS_PUBLIC_KEY is not set` means step 1 is missing.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Red toast "We couldn't send your request right now" | EmailJS keys missing/wrong **and** the Supabase migration isn't applied. Check the console for `EmailJS 4xx:` details. |
| `EmailJS 400: The Public Key is invalid` | Wrong `VITE_EMAILJS_PUBLIC_KEY`; redeploy after fixing. |
| `EmailJS 400: The service ID / template ID not found` | IDs don't match the dashboard. |
| `EmailJS 403` | Request blocked by an EmailJS security setting — usually the domain isn't in *Allowed origins*. |
| `EmailJS 429` / quota message | Rate limit or monthly quota reached — wait or upgrade the EmailJS plan. |
| Works locally, not on Vercel | Variables not added in Vercel, or not redeployed after adding. |
| Seller photos missing from email | Apply the Supabase migration (creates the `sell-requests` bucket). |

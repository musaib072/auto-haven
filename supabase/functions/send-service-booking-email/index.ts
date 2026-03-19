import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface BookingDetails {
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  carInfo: string;
  notes?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const bookingDetails: BookingDetails = await req.json();

    // Format the email body
    const emailHtml = `
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
                  <span class="detail-value">${bookingDetails.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${bookingDetails.date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${bookingDetails.time}</span>
                </div>
              </div>

              <div class="section">
                <h3>Customer Information</h3>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${bookingDetails.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">${bookingDetails.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${bookingDetails.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Vehicle:</span>
                  <span class="detail-value">${bookingDetails.carInfo}</span>
                </div>
              </div>

              ${
                bookingDetails.notes
                  ? `
              <div class="section">
                <h3>Additional Notes</h3>
                <p>${bookingDetails.notes}</p>
              </div>
              `
                  : ""
              }

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
    `;

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@autoflexxii.com",
        to: "Autoflexiiii@gmail.com",
        subject: `New Service Booking - ${bookingDetails.serviceName}`,
        html: emailHtml,
        reply_to: bookingDetails.email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        emailId: data.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

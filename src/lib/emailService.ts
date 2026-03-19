import emailjs from "@emailjs/browser";

// Initialize EmailJS (replace with your public key from EmailJS dashboard)
// Get it from: https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_autoflexxii";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_booking";

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface BookingEmailData {
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  carInfo: string;
  notes?: string;
}

export const sendServiceBookingEmail = async (
  bookingData: BookingEmailData
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_PUBLIC_KEY) {
      throw new Error(
        "EmailJS is not configured. Please set VITE_EMAILJS_PUBLIC_KEY in your .env file."
      );
    }

    // Format the template variables
    const templateParams = {
      to_email: "Autoflexiiii@gmail.com",
      customer_name: bookingData.name,
      customer_email: bookingData.email,
      customer_phone: bookingData.phone,
      service_name: bookingData.serviceName,
      booking_date: bookingData.date,
      booking_time: bookingData.time,
      vehicle_info: bookingData.carInfo,
      notes: bookingData.notes || "No additional notes",
    };

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send booking email:", error);
    throw error;
  }
};

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const sendContactFormEmail = async (
  contactData: ContactFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!EMAILJS_PUBLIC_KEY) {
      throw new Error(
        "EmailJS is not configured. Please set VITE_EMAILJS_PUBLIC_KEY in your .env file."
      );
    }

    // Format the template variables
    const templateParams = {
      to_email: "Autoflexiiii@gmail.com",
      from_name: contactData.name,
      from_email: contactData.email,
      phone: contactData.phone || "Not provided",
      subject: contactData.subject || "Contact Form Inquiry",
      message: contactData.message,
    };

    // Send email via EmailJS (using a different template for contact form)
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      "template_contact", // Different template for contact form
      templateParams
    );

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    throw error;
  }
};

"use server";

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
}

const WEB3FORMS_ACCESS_KEY = "9e01b73b-a474-4764-ae51-b1743c17eab4";

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  // Get form values
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  // Honeypot check - bot protection
  const honeypot = formData.get("botcheck") as string;
  if (honeypot) {
    // Bot detected - silently pretend success
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  }

  // Validate required fields
  const errors: ContactFormState["errors"] = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email || !isValidEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!subject || subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters";
  }

  if (!message || message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors,
    };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: name.trim(),
        email: email.trim(),
        subject: `[Malta Calculator] ${subject.trim()}`,
        message: message.trim(),
        from_name: "Malta Calculator Contact Form",
      }),
    });

    // Check if response is ok
    if (!response.ok) {
      console.error(
        "Web3Forms API error:",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        message: `Server error (${response.status}). Please try again later.`,
      };
    }

    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(
        "Web3Forms returned non-JSON response:",
        text.substring(0, 200),
      );
      return {
        success: false,
        message: "Unexpected server response. Please try again later.",
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message:
          "Thank you for your message! We'll get back to you within 24-48 hours.",
      };
    }

    return {
      success: false,
      message:
        result.message || "Something went wrong. Please try again later.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Sends an SMS message to a specific number
 * @param {string} to - The recipient's phone number
 * @param {string} message - The message body
 */
const sendSMS = async (to, message) => {
  if (!accountSid || !authToken || !fromNumber || accountSid.includes('YOUR_')) {
    console.warn("⚠️ [Twilio] Skipping SMS: Credentials not configured in .env");
    return { success: false, message: "Twilio not configured" };
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });
    console.log(`✅ [Twilio] SMS sent to ${to}. SID: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error(`❌ [Twilio] SMS failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };

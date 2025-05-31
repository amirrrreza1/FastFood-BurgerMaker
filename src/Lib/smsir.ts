import axios from "axios";

export const sendVerificationSMS = async (mobile: string, code: string) => {
  try {
    const res = await axios.post(
      "https://api.sms.ir/v1/send/verify",
      {
        mobile, 
        templateId: 123456,
        parameters: [{ name: "code", value: code }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": process.env.SMSIR_API_KEY!,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("SMS.ir error:", error.response?.data || error.message);
    throw new Error("ارسال پیامک ناموفق بود");
  }
};

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'الطريقة غير مدعومة' });
  }

  // هنا قمنا بتغيير html إلى otpCode لاستقبال الرمز فقط من الواجهة الأمامية
  const { to, otpCode } = request.body;

  try {
    const data = await resend.emails.send({
      // 1. تغيير الإيميل ليكون الدومين الخاص بك
      from: 'Al Saif Ephone <support@alsaifephone.shop>',
      to: [to],
      subject: 'رمز التحقق لتسجيل الدخول - السيف للهواتف',
      // 2. وضع قالب الـ HTML المنسق
      html: `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <title>رمز التحقق - السيف للهواتف</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Tahoma, Arial, sans-serif;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px 0;">
              <tr>
                  <td align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                          <tr>
                              <td align="center" style="background-color: #111111; padding: 25px 0;">
                                  <h1 style="color: #ffffff; margin: 0; font-size: 22px;">السيف للهواتف | Al Saif Ephone</h1>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 40px 30px; text-align: right;">
                                  <h2 style="color: #333333; font-size: 20px; margin-top: 0;">مرحباً بك،</h2>
                                  <p style="color: #555555; font-size: 15px; line-height: 1.6;">تلقينا طلباً لتسجيل الدخول أو تأكيد حسابك على متجرنا. استخدم رمز التحقق أدناه لإتمام العملية:</p>
                                  
                                  <div style="text-align: center; margin: 30px 0;">
                                      <span style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #007bff; color: #007bff; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 12px 30px; border-radius: 6px;">
                                          ${otpCode}
                                      </span>
                                  </div>
                                  
                                  <p style="color: #777777; font-size: 13px; line-height: 1.5;">إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.</p>
                              </td>
                          </tr>
                          <tr>
                              <td align="center" style="background-color: #f8f9fa; padding: 20px; color: #999999; font-size: 12px;">
                                  جميع الحقوق محفوظة © 2026 متجر السيف للهواتف<br>
                                  <a href="http://alsaifephone.shop" style="color: #007bff; text-decoration: none;" target="_blank">alsaifephone.shop</a>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `
    });

    return response.status(200).json({ success: true, data });
  } catch (error) {
    return response.status(500).json({ error });
  }
}

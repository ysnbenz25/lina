// Vercel Serverless Function handler for /api/settings/d17
// Handles D17 settings retrieval and updates on Vercel deployments

let cachedPhone = '+216 27610626';

export default function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token, x-admin-password'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      d17Settings: {
        recipientPhone: cachedPhone,
        recipientName: 'متجر لينا شوب - Lina Shop Perfumes',
        instructions: 'يرجى إرسال المبلغ الإجمالي عبر تطبيق D17 ثم إدخال رقم العملية (Transaction ID) في الخانة أدناه لتأكيد الطلب.',
      },
    });
  }

  if (req.method === 'PATCH' || req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { recipientPhone } = body;
    if (recipientPhone) {
      cachedPhone = String(recipientPhone);
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث إعدادات D17 بنجاح',
      d17Settings: {
        recipientPhone: cachedPhone,
        recipientName: 'متجر لينا شوب - Lina Shop Perfumes',
        instructions: 'يرجى إرسال المبلغ الإجمالي عبر تطبيق D17 ثم إدخال رقم العملية (Transaction ID) في الخانة أدناه لتأكيد الطلب.',
      },
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

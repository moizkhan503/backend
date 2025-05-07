import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST requests allowed' });
  }

  const { senderEmail, subject, message, pdfBase64, fileName } = req.body;

  if (!senderEmail || !subject || !message || !pdfBase64) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gc.abdullah.nauman@gmail.com',
      pass: 'xfpv jlda giwl lrmv' // App Password (must be generated from Gmail)
    }
  });

  const mailOptions = {
    from: senderEmail, // This is who the email appears to be from
    to: 'gc.abdullah.nauman@gmail.com', // Your Gmail to receive the PDF
    subject,
    text: `Message from ${senderEmail}:\n\n${message}`,
    replyTo: senderEmail,
    attachments: [
      {
        filename: fileName || 'attachment.pdf',
        content: pdfBase64,
        encoding: 'base64'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

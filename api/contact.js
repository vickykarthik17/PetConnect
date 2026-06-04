const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mail = {
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL, // must be a verified sender in SendGrid
    subject: `Contact form: ${subject || 'No subject'}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || '-'}
Subject: ${subject || '-'}
Message:
${message}
    `,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '-'}</p>
      <p><strong>Subject:</strong> ${subject || '-'}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `
  };

  try {
    await sgMail.send(mail);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SendGrid error', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
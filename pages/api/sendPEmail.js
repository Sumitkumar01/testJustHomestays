const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const formData = req.body;
  console.log(formData);

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "hello@crisscrosslab.com", // generated ethereal user
      pass: "Ccl@2022", // generated ethereal password
    },
  });

  // Email content
  const mailOptions = {
    from: "hello@crisscrosslab.com",
    to: "priyanshu@justhomestay.in,info@justhomestay.in", // recipient email
    subject: "Interest - JHS Partner with us",
    text: `
    Name: ${formData.Name},
    Email ID: ${formData["Email ID"]},
    Mobile: ${formData.Mobile},
    City: ${formData.City},
    Type: ${formData.Type},
    Description: ${formData.Description},
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

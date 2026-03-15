import nodemailer from "nodemailer";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",       // Use your actual SMTP provider
  port: 587,
  secure: false,                // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (email, name, password, role) => {
  try {
    await transporter.sendMail({
      from: `"Enigma Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Enigma Account Credentials",
      text: `
Hello ,

Your account has been created.

Team Id:${name}
Password: ${password}


Regards,
Enigma Team
`,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
  }
};

// Collect all rows first, then send emails sequentially
const rows = [];

fs.createReadStream("./scripts/credentials.csv")
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
  .on("error", (error) => {
    console.error("Error reading CSV file:", error.message);
  })
  .on("end", async () => {
    console.log(`Found ${rows.length} recipients. Sending emails...`);
    for (const row of rows) {
      try {
        console.log(row);
        await sendMail(row.Email, row.Name, row.Password, row.Role);
      } catch (error) {
        console.error(`Failed to send email to ${row.Email}:`, error.message);
      }
    }
    console.log("All emails sent.");
  });

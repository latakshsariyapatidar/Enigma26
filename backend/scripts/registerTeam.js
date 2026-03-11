import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Team from "../src/models/teamModel.js";

dotenv.config();

let teamCount = 1;
let adminCount = 1;

const generatePassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < 12; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return password;
};

const run = async () => {
  await mongoose.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
  );
  console.log("Connected to MongoDB");
  const results = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream("./scripts/teams.csv")
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ''),
        mapValues: ({ value }) => value.trim(),
      }))
      .on("data", (data) => {
        console.log("Parsed row:", data);
        results.push(data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Read ${results.length} entries from CSV`);

  const createdUsers = [];
  const failedUsers = [];

  for (const user of results) {
    const { email, role } = user;

    if (!email || !role) {
      console.log("Skipping entry with missing email or role");
      continue;
    }

    const password = generatePassword();
    let name;

    if (role.toString().trim() === "admin") {
      name = `admin${adminCount}`;
      adminCount++;
    } else {
      name = `team${teamCount}`;
      teamCount++;
    }

    try {
      // Check if email already exists
      const existing = await Team.findOne({ email });
      if (existing) {
        console.log(`${email} already exists, skipping`);
        continue;
      }

      // Team.create() triggers the pre("save") hook → password gets hashed in DB
      await Team.create({ name, email, password, role: role.trim() });

      // Store plain-text password for the CSV backup (DB has the hashed version)
      createdUsers.push({ name, email, password, role: role.trim() });
      console.log(`${name} (${email}) — created`);
    } catch (error) {
      console.log(`${name} (${email}) — FAILED: ${error.message}`);
      failedUsers.push({ name, email, error: error.message });
    }
  }

  // Write credentials CSV backup
  let csvContent = "Name,Email,Password,Role\n";
  for (const user of createdUsers) {
    csvContent += `${user.name},${user.email},${user.password},${user.role}\n`;
  }
  fs.writeFileSync("./scripts/credentials.csv", csvContent);
  console.log(`\n credentials.csv written with ${createdUsers.length} entries`);

  if (failedUsers.length > 0) {
    console.log(`\n ${failedUsers.length} users failed:`);
    failedUsers.forEach((u) => console.log(`   - ${u.name}: ${u.error}`));
  }

  console.log(`\n Done! ${createdUsers.length} users created, ${failedUsers.length} failed`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
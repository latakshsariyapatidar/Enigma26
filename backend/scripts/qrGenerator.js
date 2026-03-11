import mongoose from "mongoose";
import dotenv from "dotenv";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Location from "../src/models/locationModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure env config since scripts are run from the backend root folder
dotenv.config({ path: path.join(__dirname, "../.env") });

const generateQRCodes = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_NAME;

        if (!mongoUrl || !dbName) {
            throw new Error("MONGODB_URI or MONGODB_NAME not found in environment variables.");
        }

        await mongoose.connect(`${mongoUrl}/${dbName}`);
        console.log("Connected to MongoDB");

        // Fetch all locations
        const locations = await Location.find({});

        if (locations.length === 0) {
            console.log("No locations found in the database.");
            process.exit(0);
        }

        // Create qrcodes directory if it doesn't exist
        const qrDir = path.join(__dirname, "../qrcodes");
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir);
        }

        // The QR code content: A full link for the frontend to handle the scan.
        // It uses process.env.CORS_ORIGIN or a fallback to your frontend URL.
        //const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";
        
        for (const loc of locations) {
            const qrData = `${loc._id.toString()}`;

            // Sanitize filename to remove invalid characters
            const safeName = loc.name.toLowerCase();
            const filePath = path.join(qrDir, `${safeName}_qrcode.png`);

            // Generate QR Code as PNG
            await QRCode.toFile(filePath, qrData, {
                color: {
                    dark: '#000000',  // Black dots
                    light: '#FFFFFF' // White background
                },
                width: 300,
                margin: 2
            });

            console.log(`Generated QR for Location: ${loc.name} -> ${filePath}`);
        }

        console.log("All QR codes generated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error generating QR codes:", error);
        process.exit(1);
    }
};

generateQRCodes();

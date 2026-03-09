import "dotenv/config"; // MUST be the first import so env vars are loaded before app.js
import { connectDB } from "./db/index.js";
import app from "./app.js";

console.log("NODE_ENV =", process.env.NODE_ENV);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

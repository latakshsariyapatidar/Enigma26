import dotev from "dotenv";
import { connectDB } from "./db/index.js";
import app from "./app.js";

dotev.config({
  path: "./.env",
});

console.log("NODE_ENV =", process.env.NODE_ENV);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

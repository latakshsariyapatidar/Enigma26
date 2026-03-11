//logic to assign locations to teams
import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../src/models/teamModel.js";
import Location from "../src/models/locationModel.js";
import TeamProgress from "../src/models/teamProgressModel.js";
import { numberOfRounds } from "../src/constant.js";


dotenv.config();

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const run = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
    );
    console.log("Connected to MongoDB");

    const teams = await Team.find({ role: "participant" });
    const locations = await Location.find();

    if (locations.length < numberOfRounds) {
      console.error(
        `Not enough locations! Need at least ${numberOfRounds}, found ${locations.length}`
      );
      process.exit(1);
    }

    console.log(
      `Assigning ${numberOfRounds} locations to ${teams.length} teams from ${locations.length} available locations`
    );

    // Track how many times each location has been assigned
    const locCount = new Map();
    for (const loc of locations) {
      locCount.set(loc._id.toString(), 0);
    }

    let created = 0;
    let skipped = 0;

    for (const team of teams) {
      // Check if this team already has progress assigned
      const existing = await TeamProgress.findOne({ teamId: team._id });
      if (existing) {
        console.log(`${team.name} — already has locations assigned, skipping`);
        skipped++;
        continue;
      }

      // Pick the 8 least-assigned locations
      const sorted = [...locCount.entries()]
        .sort((a, b) => a[1] - b[1])       // sort by count ascending
        .slice(0, numberOfRounds)            // take the 8 least used
        .map(([id]) => id);                  // extract just the IDs

      // Shuffle so the order is random for each team
      const assignedIds = shuffle(sorted);

      // Increment counters for the picked locations
      for (const id of assignedIds) {
        locCount.set(id, locCount.get(id) + 1);
      }

      // Create TeamProgress
      await TeamProgress.create({
        teamId: team._id,
        currentRound: 1,
        currentLocation: assignedIds[0],
        assignedLocations: assignedIds.map((id) => ({
          location: id,
        })),
      });

      console.log(`${team.name} — assigned ${assignedIds.length} locations`);
      created++;
    }

    // Print location usage stats
    console.log("\nLocation usage:");
    for (const loc of locations) {
      const count = locCount.get(loc._id.toString());
      console.log(`  ${loc.name}: assigned ${count} times`);
    }

    console.log(
      `\nDone! ${created} teams assigned, ${skipped} skipped (already had progress)`
    );

    await mongoose.disconnect();
  } catch (err) {
    console.error("Script failed:", err);
    process.exit(1);
  }
};

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
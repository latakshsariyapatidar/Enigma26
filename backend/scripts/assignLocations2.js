/**
 * assignLocations2.js
 *
 * Bucket-based location assignment with PREDEFINED buckets.
 *
 * Buckets (circular order: 1 → 2 → 3 → ... → 8 → 1):
 *   1. temporary ground, main gate, kv school, helipad
 *   2. H1, mess
 *   3. Middle ground in front of krdc
 *   4. ICF, wellness, amenities
 *   5. CIF, A1, A2
 *   6. Swimming pool
 *   7. ESS1, ESS2, ESS3
 *   8. F600
 *
 * Rules:
 *   - Each team gets exactly 8 locations, ONE from each bucket.
 *   - Bucket order is circular: the starting bucket is evenly distributed
 *     across teams so ~same number of teams begin at each bucket.
 *   - Within each bucket, locations are assigned as equally as possible
 *     (greedy least-used with random tie-breaking).
 *   - Location names are matched using trim().toLowerCase().
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../src/models/teamModel.js";
import Location from "../src/models/locationModel.js";
import TeamProgress from "../src/models/teamProgressModel.js";
import { numberOfRounds } from "../src/constant.js";
dotenv.config();

const NUM_BUCKETS = numberOfRounds; // 8

// ── Predefined bucket names (matched via trim + lowercase) ──────────────
// const BUCKET_NAMES = [
//   // Bucket 1
//   ["temporary ground", "main gate", "kv school", "helipad"],
//   // Bucket 2
//   ["H1", "mess"],
//   // Bucket 3
//   ["KRDC"],
//   // Bucket 4
//   ["Indoor Common Facility", "wellness", "amenities"],
//   // Bucket 5
//   ["CIF", "a1", "a2"],
//   // Bucket 6
//   ["Swimming Pool"],
//   // Bucket 7
//   ["ESS-1", "ESS-2", "ESS-3"],
//   // Bucket 8
//   ["F600"],
// ];
const BUCKET_NAMES = [
  // Bucket 1
  ["helipad"],
  // Bucket 2
  ["H1"],
  // Bucket 3
  ["KRDC"],
  // Bucket 4
  ["Indoor Common Facility"],
  // Bucket 5
  ["CIF"],
  // Bucket 6
  ["Swimming Pool"],
  // Bucket 7
  ["ESS-1"],
  // Bucket 8
  ["F600"],
];

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

    // ── 1. Fetch teams & locations ──────────────────────────────────────
    const teams = await Team.find({ role: "participant" });
    const allLocations = await Location.find();

    // Build a lookup: normalized name → location doc
    const locByName = new Map();
    for (const loc of allLocations) {
      locByName.set(loc.name.trim().toLowerCase(), loc);
    }

    // ── 2. Resolve predefined buckets to actual location docs ───────────
    const buckets = []; // array of arrays of location docs
    let hasError = false;

    for (let b = 0; b < BUCKET_NAMES.length; b++) {
      const bucket = [];
      for (const name of BUCKET_NAMES[b]) {
        const normalized = name.trim().toLowerCase();
        const loc = locByName.get(normalized);
        if (!loc) {
          console.error(
            `❌ Bucket ${b + 1}: location "${name}" not found in DB! (searched for "${normalized}")`
          );
          hasError = true;
        } else {
          bucket.push(loc);
        }
      }
      buckets.push(bucket);
    }

    if (hasError) {
      console.error(
        "\n⚠️  Some locations were not found. Please check the names above."
      );
      console.log("\nAvailable locations in DB:");
      for (const loc of allLocations) {
        console.log(`  - "${loc.name}"`);
      }
      process.exit(1);
    }

    if (buckets.length !== NUM_BUCKETS) {
      console.error(
        `Expected ${NUM_BUCKETS} buckets, but got ${buckets.length}`
      );
      process.exit(1);
    }

    console.log("\n📦 Bucket breakdown:");
    buckets.forEach((bucket, i) => {
      console.log(
        `  Bucket ${i + 1} (${bucket.length} location${bucket.length !== 1 ? "s" : ""}): [${bucket.map((l) => l.name).join(", ")}]`
      );
    });

    // ── 3. Track per-location assignment count in each bucket ───────────
    // bucketCounts[b] = Map<locationIdString, count>
    const bucketCounts = buckets.map((bucket) => {
      const m = new Map();
      for (const loc of bucket) {
        m.set(loc._id.toString(), 0);
      }
      return m;
    });

    // Track how many teams start from each bucket
    const startBucketCounts = new Array(NUM_BUCKETS).fill(0);

    // ── 4. Filter out teams that already have progress ──────────────────
    const teamsToAssign = [];
    let skipped = 0;

    for (const team of teams) {
      const existing = await TeamProgress.findOne({ teamId: team._id });
      if (existing) {
        console.log(`⏭  ${team.name} — already assigned, skipping`);
        skipped++;
        continue;
      }
      teamsToAssign.push(team);
    }

    // Shuffle teams so every run produces a different assignment
    const shuffledTeams = shuffle(teamsToAssign);

    console.log(
      `\n🏁 Assigning ${NUM_BUCKETS} locations to ${shuffledTeams.length} teams (${skipped} skipped)\n`
    );

    // ── 5. Assign locations ─────────────────────────────────────────────
    let created = 0;

    for (let t = 0; t < shuffledTeams.length; t++) {
      const team = shuffledTeams[t];

      // ── 5a. Determine starting bucket (pick the one with fewest starts)
      let startBucket = 0;
      let minStartCount = Infinity;
      const candidateOrder = shuffle(
        Array.from({ length: NUM_BUCKETS }, (_, i) => i)
      );
      for (const b of candidateOrder) {
        if (startBucketCounts[b] < minStartCount) {
          minStartCount = startBucketCounts[b];
          startBucket = b;
        }
      }
      startBucketCounts[startBucket]++;

      // ── 5b. Build circular bucket visit order starting from startBucket
      // e.g., startBucket=3 → [3, 4, 5, 6, 7, 0, 1, 2]
      const bucketOrder = Array.from(
        { length: NUM_BUCKETS },
        (_, i) => (startBucket + i) % NUM_BUCKETS
      );

      // ── 5c. From each bucket, pick the least-assigned location
      const assignedIds = [];
      for (const b of bucketOrder) {
        const counts = bucketCounts[b];

        // Find the minimum count in this bucket
        let minCount = Infinity;
        for (const c of counts.values()) {
          if (c < minCount) minCount = c;
        }

        // Collect all locations with the minimum count
        const candidates = [];
        for (const [locId, c] of counts.entries()) {
          if (c === minCount) candidates.push(locId);
        }

        // Pick one at random from the least-used candidates
        const picked =
          candidates[Math.floor(Math.random() * candidates.length)];
        counts.set(picked, counts.get(picked) + 1);
        assignedIds.push(picked);
      }

      // ── 5d. Create TeamProgress ───────────────────────────────────────
      await TeamProgress.create({
        teamId: team._id,
        currentRound: 0,
        currentLocation: assignedIds[assignedIds.length - 1],
        assignedLocations: assignedIds.map((id) => ({
          location: id,
        })),
      });

      console.log(
        `✅ ${team.name} — start bucket ${startBucket + 1}, locations: [${assignedIds
          .map((id) => {
            const loc = allLocations.find((l) => l._id.toString() === id);
            return loc ? loc.name : id;
          })
          .join(", ")}]`
      );
      created++;
    }

    // ── 6. Print stats ──────────────────────────────────────────────────
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Location assignment distribution:\n");
    for (let b = 0; b < NUM_BUCKETS; b++) {
      console.log(`  Bucket ${b + 1}:`);
      const counts = bucketCounts[b];
      for (const [locId, count] of counts.entries()) {
        const loc = allLocations.find((l) => l._id.toString() === locId);
        console.log(
          `    ${loc ? loc.name : locId}: assigned ${count} time(s)`
        );
      }
    }

    console.log("\n📊 Starting bucket distribution:");
    for (let b = 0; b < NUM_BUCKETS; b++) {
      console.log(
        `  Bucket ${b + 1}: ${startBucketCounts[b]} team(s) start here`
      );
    }

    console.log(
      `\n🎉 Done! ${created} teams assigned, ${skipped} skipped (already had progress)`
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

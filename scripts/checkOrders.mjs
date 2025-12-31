#!/usr/bin/env node

/**
 * Check what orders exist in Firestore
 * Run with: node scripts/checkOrders.mjs
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkOrders() {
  console.log("🔍 Checking Firestore for orders...\n");

  try {
    // Check users collection
    console.log("📋 Checking users collection...");
    const usersSnapshot = await db.collection("users").get();
    console.log(`✓ Found ${usersSnapshot.size} users\n`);

    if (usersSnapshot.size > 0) {
      console.log("Users:");
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${data.email} (ID: ${doc.id})`);
      });
      console.log();
    }

    // Check orders collection
    console.log("📦 Checking orders collection...");
    const ordersSnapshot = await db.collection("orders").get();
    console.log(`✓ Found ${ordersSnapshot.size} orders\n`);

    if (ordersSnapshot.size === 0) {
      console.log("❌ NO ORDERS FOUND!");
      console.log("\nTo create orders, run:");
      console.log("  npm run seed-data");
    } else {
      console.log("Orders:");
      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - Order ${doc.id.substring(0, 8)}`);
        console.log(`    User: ${data.userEmail}`);
        console.log(`    Total: $${data.total}`);
        console.log(`    Status: ${data.status}`);
        console.log(
          `    Created: ${data.createdAt?.toDate?.() || data.createdAt}`
        );
        console.log();
      });
    }

    console.log("\n✅ Check complete!");
  } catch (error) {
    console.error("❌ Error checking Firestore:", error);
    console.error("\nPossible issues:");
    console.error("1. Internet connection");
    console.error("2. Firebase project configuration");
    console.error("3. Missing serviceAccountKey.json file");
  }

  process.exit(0);
}

checkOrders();

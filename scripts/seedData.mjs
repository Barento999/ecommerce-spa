#!/usr/bin/env node

/**
 * Seed sample data for development
 * Run with: node scripts/seedData.mjs
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
const auth = admin.auth();

// Sample customer data
const sampleCustomers = [
  {
    email: "john.doe@example.com",
    password: "password123",
    displayName: "John Doe",
    phoneNumber: "+1-555-0101",
    shippingAddress: {
      address1: "123 Main St",
      address2: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
  },
  {
    email: "jane.smith@example.com",
    password: "password123",
    displayName: "Jane Smith",
    phoneNumber: "+1-555-0102",
    shippingAddress: {
      address1: "456 Oak Ave",
      address2: "",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
  },
  {
    email: "bob.johnson@example.com",
    password: "password123",
    displayName: "Bob Johnson",
    phoneNumber: "+1-555-0103",
    shippingAddress: {
      address1: "789 Pine Rd",
      address2: "Suite 200",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
  },
  {
    email: "alice.williams@example.com",
    password: "password123",
    displayName: "Alice Williams",
    phoneNumber: "+1-555-0104",
    shippingAddress: {
      address1: "321 Elm St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77001",
      country: "USA",
    },
  },
  {
    email: "charlie.brown@example.com",
    password: "password123",
    displayName: "Charlie Brown",
    phoneNumber: "+1-555-0105",
    shippingAddress: {
      address1: "654 Maple Dr",
      address2: "Unit 12",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "USA",
    },
  },
];

// Sample products
const sampleProducts = [
  {
    id: "prod_1",
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Electronics",
    stock: 50,
  },
  {
    id: "prod_2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics",
    stock: 30,
  },
  {
    id: "prod_3",
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Accessories",
    stock: 100,
  },
  {
    id: "prod_4",
    name: "Coffee Maker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
    category: "Home",
    stock: 25,
  },
];

// Generate random date within last 90 days
function randomDate(daysAgo = 90) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  return admin.firestore.Timestamp.fromDate(date);
}

// Generate random order status
function randomStatus() {
  const statuses = [
    "processing",
    "shipped",
    "delivered",
    "delivered",
    "delivered",
  ]; // More delivered orders
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Create sample orders for a customer
function generateOrders(userId, userEmail, userName, count = 3) {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product =
        sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
      const itemTotal = product.price * quantity;

      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        productId: product.id,
      });

      subtotal += itemTotal;
    }

    const shipping = 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    orders.push({
      userId,
      userEmail,
      userName,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: randomStatus(),
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      createdAt: randomDate(),
      updatedAt: randomDate(30),
      shippingAddress: {
        name: userName,
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA",
        phone: "+1-555-0100",
      },
      trackingNumber:
        Math.random() > 0.5
          ? `TRK${Math.random().toString(36).substring(2, 11).toUpperCase()}`
          : null,
      notes: "",
    });
  }

  return orders;
}

// Main seeding function
async function seedData() {
  console.log("🌱 Starting data seeding...\n");

  try {
    // Create customers and their orders
    for (const customer of sampleCustomers) {
      console.log(`Creating customer: ${customer.email}`);

      let userId = null;

      try {
        // Create auth user
        const userRecord = await auth.createUser({
          email: customer.email,
          password: customer.password,
          displayName: customer.displayName,
          emailVerified: true,
        });

        userId = userRecord.uid;

        // Create user profile in Firestore
        await db
          .collection("users")
          .doc(userId)
          .set({
            displayName: customer.displayName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            emailVerified: true,
            status: "active",
            createdAt: randomDate(180), // Account created in last 180 days
            updatedAt: admin.firestore.Timestamp.now(),
            lastLogin: randomDate(7), // Last login within 7 days
            shippingAddress: customer.shippingAddress,
            billingAddress: customer.shippingAddress,
            photoURL: null,
            preferences: {
              newsletter: true,
              notifications: true,
            },
          });

        console.log(`✓ Created user profile for ${customer.email}`);
      } catch (error) {
        if (error.code === "auth/email-already-exists") {
          console.log(`⚠ User ${customer.email} already exists`);
          // Get existing user by email
          try {
            const userRecord = await auth.getUserByEmail(customer.email);
            userId = userRecord.uid;
            console.log(`✓ Found existing user ID for ${customer.email}`);
          } catch (getUserError) {
            console.error(
              `✗ Could not get user ${customer.email}:`,
              getUserError.message
            );
            continue;
          }
        } else {
          console.error(`✗ Error creating ${customer.email}:`, error.message);
          continue;
        }
      }

      // Generate 2-5 orders for this customer (whether new or existing)
      if (userId) {
        const orderCount = Math.floor(Math.random() * 4) + 2;
        const orders = generateOrders(
          userId,
          customer.email,
          customer.displayName,
          orderCount
        );

        // Create orders
        for (const order of orders) {
          await db.collection("orders").add(order);
        }

        console.log(`✓ Created ${orderCount} orders for ${customer.email}\n`);
      }
    }

    console.log("✅ Data seeding completed successfully!");
    console.log("\nSample credentials:");
    console.log("Email: john.doe@example.com");
    console.log("Password: password123");
    console.log("\n(All sample users have the same password: password123)");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }

  process.exit(0);
}

// Run the seeding
seedData();

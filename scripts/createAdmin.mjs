import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecommerce-55491-default-rtdb.firebaseio.com'
});

const email = 'admin@example.com';
const password = 'Admin@123'; // Strong password

async function createAdminUser() {
  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('User already exists, updating admin privileges...');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user if doesn't exist
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          emailVerified: true,
        });
        console.log('✅ Successfully created new admin user');
      } else {
        throw error;
      }
    }

    // Set custom admin claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    console.log('\n✅ Success! Admin user has been configured.\n');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);
    console.log('You can now log in to the admin dashboard with these credentials.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the function
createAdminUser();

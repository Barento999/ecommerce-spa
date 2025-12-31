const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // In production, you should verify the request is coming from an admin
  // For now, we'll allow any authenticated user to make someone an admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to add an admin role'
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { 
      message: `Success! ${data.email} has been made an admin.` 
    };
  } catch (error) {
    console.error('Error adding admin role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error adding admin role',
      error.message
    );
  }
});

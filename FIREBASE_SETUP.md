# Firebase Setup Guide

This guide will help you set up Firebase for your e-commerce application with proper security rules and sample data.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Configure Firebase

Your Firebase configuration is already set in `src/firebase.js`. Make sure the credentials match your Firebase project.

## Step 2: Deploy Firestore Security Rules

1. Login to Firebase CLI:

```bash
firebase login
```

2. Initialize Firebase in your project (if not already done):

```bash
firebase init firestore
```

3. Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

The security rules in `firestore.rules` provide:

- Users can only read/write their own data
- Admins can access all data
- Orders are protected and only visible to the customer who created them or admins
- Public read access for products and categories

## Step 3: Set Up Firestore Indexes

For optimal query performance, create these indexes in the Firebase Console:

### Orders Collection Indexes

1. **Index for user orders**:

   - Collection: `orders`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

2. **Index for date-filtered orders**:

   - Collection: `orders`
   - Fields: `createdAt` (Descending), `status` (Ascending)

3. **Index for admin order queries**:
   - Collection: `orders`
   - Fields: `status` (Ascending), `createdAt` (Descending)

### Users Collection Indexes

1. **Index for customer list**:
   - Collection: `users`
   - Fields: `createdAt` (Descending), `status` (Ascending)

You can create these indexes:

- Automatically: Firebase will prompt you with a link when you run queries that need indexes
- Manually: Go to Firebase Console → Firestore Database → Indexes

## Step 4: Seed Sample Data

Run the seeding script to populate your database with sample customers and orders:

```bash
npm run seed-data
```

This will create:

- 5 sample customers with realistic profiles
- 2-5 orders per customer with various statuses
- Sample shipping addresses and order details

Sample login credentials:

- Email: `john.doe@example.com`
- Password: `password123`

(All sample users have the same password: `password123`)

## Step 5: Create Admin User

To create an admin user, you need to set up Firebase Functions:

1. Navigate to the functions directory:

```bash
cd functions
```

2. Install dependencies:

```bash
npm install
```

3. Deploy the functions:

```bash
firebase deploy --only functions
```

4. Create an admin user:

```bash
npm run create-admin
```

Follow the prompts to enter the email address of the user you want to make an admin.

## Firestore Data Structure

### Users Collection (`users/{userId}`)

```javascript
{
  displayName: string,
  email: string,
  phoneNumber: string,
  photoURL: string | null,
  emailVerified: boolean,
  status: 'active' | 'inactive',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLogin: Timestamp,
  shippingAddress: {
    address1: string,
    address2: string,
    city: string,
    state: string,
    zip: string,
    country: string
  },
  billingAddress: { /* same as shippingAddress */ },
  preferences: {
    newsletter: boolean,
    notifications: boolean
  }
}
```

### Orders Collection (`orders/{orderId}`)

```javascript
{
  userId: string,
  userEmail: string,
  userName: string,
  items: [
    {
      id: string,
      name: string,
      price: number,
      quantity: number,
      image: string,
      productId: string
    }
  ],
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentMethod: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  shippingAddress: {
    name: string,
    street: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    phone: string
  },
  trackingNumber: string | null,
  estimatedDelivery: Timestamp | null,
  notes: string
}
```

## Security Best Practices

1. **Never commit sensitive credentials**: The `serviceAccountKey.json` file should be in `.gitignore`

2. **Use environment variables**: For production, use environment variables for Firebase config

3. **Enable App Check**: Protect your Firebase resources from abuse

   - Go to Firebase Console → App Check
   - Register your app
   - Add the App Check SDK to your app

4. **Monitor usage**: Set up billing alerts in Firebase Console to avoid unexpected charges

5. **Backup your data**: Enable automated backups in Firestore settings

## Testing

After setup, test the following:

1. **User Registration**: Create a new account
2. **User Login**: Login with sample credentials
3. **Place Order**: Add items to cart and checkout
4. **View Orders**: Check order history in account page
5. **Admin Access**: Login as admin and view customers/orders

## Troubleshooting

### Permission Denied Errors

If you see "permission-denied" errors:

1. Check that security rules are deployed: `firebase deploy --only firestore:rules`
2. Verify the user is authenticated
3. Check that the user has the correct permissions (admin claim for admin routes)

### Missing Indexes

If queries fail with "index required" errors:

1. Click the link in the error message to create the index automatically
2. Or manually create the index in Firebase Console

### Authentication Issues

If authentication isn't working:

1. Enable Email/Password authentication in Firebase Console → Authentication → Sign-in method
2. Check that Firebase config is correct in `src/firebase.js`
3. Clear browser cache and try again

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

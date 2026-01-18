# Quick Start Guide - E-Commerce with Real Firebase Data

This guide will help you quickly set up the e-commerce application with real customer and order data from Firebase.

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Deploy Firestore Security Rules and Indexes

```bash
firebase login
firebase deploy --only firestore
```

This deploys both security rules and indexes. **Index creation takes 2-5 minutes** - wait for the email confirmation before proceeding.

### 3. Seed Sample Data

```bash
npm run seed-data
```

This creates 5 sample customers with 2-5 orders each.

### 4. Create an Admin User

```bash
cd functions
npm run create-admin
```

Enter your email when prompted.

### 5. Start the Development Server

```bash
npm run dev
```

## 🎯 Test the Application

### As a Customer

1. **Login with sample account**:

   - Email: `john.doe@example.com`
   - Password: `password123`

2. **Browse and shop**:

   - Add items to cart
   - Proceed to checkout
   - Place an order

3. **View order history**:
   - Go to Account → Orders
   - See your order details

### As an Admin

1. **Login with admin account**:

   - Use the email you set as admin
   - Your regular password

2. **Access admin dashboard**:

   - Navigate to `/admin`
   - View customers and orders
   - See statistics and analytics

3. **Manage data**:
   - Filter orders by status
   - Search customers
   - View customer details and order history

## 📊 What You Get

### Real Customer Data

- 5 sample customers with complete profiles
- Realistic names, emails, and addresses
- Account creation dates spread over 6 months
- Active status tracking

### Real Order Data

- 10-25 sample orders across all customers
- Various order statuses (processing, shipped, delivered)
- Realistic order dates over the last 90 days
- Complete order details with items, pricing, and shipping info
- Tracking numbers for shipped orders

### Admin Features

- **Customer Management**:

  - View all customers with pagination
  - See total orders and spending per customer
  - Filter by status and date range
  - Search by name or email

- **Order Management**:
  - View all orders with filtering
  - Track order statuses
  - See revenue statistics
  - Filter by date range and status

## 🔧 Key Features

### Customer Experience

✅ User registration with automatic profile creation  
✅ Secure authentication with Firebase Auth  
✅ Shopping cart with persistent state  
✅ Order placement with real-time updates  
✅ Order history with detailed views  
✅ Profile management

### Admin Experience

✅ Customer list with statistics  
✅ Order management dashboard  
✅ Revenue tracking  
✅ Status filtering and search  
✅ Customer detail views with order history  
✅ Real-time data from Firestore

## 📁 Data Structure

### Customers (Firestore: `users` collection)

Each customer document includes:

- Personal information (name, email, phone)
- Shipping and billing addresses
- Account status and timestamps
- Email verification status
- User preferences

### Orders (Firestore: `orders` collection)

Each order document includes:

- Customer reference (userId, email, name)
- Order items with details
- Pricing breakdown (subtotal, tax, shipping, total)
- Order status and payment status
- Shipping address
- Tracking information
- Timestamps (created, updated)

## 🔐 Security

### Firestore Rules

The application uses secure Firestore rules:

- **Users**: Can only read/write their own data
- **Orders**: Users see only their orders, admins see all
- **Admin Access**: Controlled via custom claims

### Authentication

- Email/password authentication
- Admin roles via custom claims
- Protected routes for authenticated users
- Separate admin routes

## 🎨 Customization

### Add More Sample Data

Edit `scripts/seedData.mjs` to:

- Add more customers
- Change product details
- Adjust order quantities
- Modify date ranges

Then run:

```bash
npm run seed-data
```

### Modify Data Structure

Update the services in `src/services/`:

- `customerService.js` - Customer operations
- `orderService.jsx` - Order operations

### Change UI

The admin pages are in `src/pages/admin/`:

- `Customers.jsx` - Customer list
- `Orders.jsx` - Order list
- `AdminDashboard.jsx` - Dashboard with stats

## 📚 Documentation

- **FIREBASE_SETUP.md** - Detailed Firebase configuration
- **README_DATA.md** - Data management and structure
- **firestore.rules** - Security rules reference

## 🐛 Troubleshooting

### "Permission Denied" Errors

```bash
# Redeploy security rules
firebase deploy --only firestore:rules
```

### No Data Showing

```bash
# Reseed the database
npm run seed-data
```

### Admin Access Not Working

```bash
# Recreate admin user
cd functions
npm run create-admin
```

### Indexes Missing

When you see "index required" errors:

1. Click the link in the error message
2. Or create indexes manually in Firebase Console

## 🚀 Next Steps

1. **Customize the design**: Update Tailwind classes
2. **Add more features**: Reviews, wishlists, etc.
3. **Integrate payment**: Stripe, PayPal, etc.
4. **Add email notifications**: Order confirmations, shipping updates
5. **Implement search**: Full-text search with Algolia
6. **Add analytics**: Track user behavior
7. **Deploy to production**: Firebase Hosting or Vercel

## 💡 Tips

- Use the sample data to test features
- Check Firebase Console to see data in real-time
- Monitor Firestore usage to avoid unexpected costs
- Set up billing alerts in Firebase Console
- Enable automated backups for production

## 🆘 Need Help?

1. Check the browser console for errors
2. Review Firebase Console for data and errors
3. Verify authentication status
4. Check Firestore security rules
5. Review the documentation files

## 📝 Sample Credentials

After running `npm run seed-data`:

```
Email: john.doe@example.com
Password: password123

Email: jane.smith@example.com
Password: password123

Email: bob.johnson@example.com
Password: password123

Email: alice.williams@example.com
Password: password123

Email: charlie.brown@example.com
Password: password123
```

All sample users have the same password for easy testing.

---

**Ready to build something amazing!** 🎉

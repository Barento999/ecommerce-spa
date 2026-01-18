# E-Commerce Data Management

This document explains how customer and order data is managed in the application using Firebase Firestore.

## Overview

The application uses Firebase Firestore as the database to store and manage:

- Customer profiles and information
- Order history and details
- User authentication data

## Data Flow

### Customer Registration

1. User signs up through the registration form
2. Firebase Authentication creates the auth account
3. `AuthContext` automatically creates a customer profile in Firestore
4. Customer profile includes:
   - Basic info (name, email, phone)
   - Account status
   - Preferences
   - Timestamps (created, updated, last login)

### Order Creation

1. User adds items to cart (stored in Zustand state)
2. User proceeds to checkout
3. Order is created in Firestore with:
   - Customer information
   - Order items with details
   - Pricing breakdown (subtotal, tax, shipping)
   - Shipping address
   - Payment information
   - Order status and timestamps

### Admin Dashboard

Admins can:

- View all customers with statistics
- See order history for each customer
- Track total spending per customer
- Filter and search customers
- View all orders with filtering options
- Update order statuses
- Track revenue and order statistics

## Services

### Customer Service (`src/services/customerService.js`)

Provides functions for:

- `getCustomers()` - Fetch customers with pagination
- `getCustomerById()` - Get detailed customer info with order history
- `updateCustomer()` - Update customer information
- `searchCustomers()` - Search by name or email
- `getCustomerStats()` - Get customer statistics
- `createCustomerProfile()` - Create profile on signup
- `updateLastLogin()` - Track user activity

### Order Service (`src/services/orderService.jsx`)

Provides functions for:

- `createOrder()` - Create new order
- `getUserOrders()` - Get orders for a specific user
- `getAllOrders()` - Get all orders with pagination (admin)
- `getOrderById()` - Get single order details
- `updateOrderStatus()` - Update order status
- `getOrderStats()` - Get order statistics
- `searchOrders()` - Search orders by ID or email

## Data Structure

### Customer Profile (Firestore: `users/{userId}`)

```javascript
{
  displayName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1-555-0101",
  photoURL: null,
  emailVerified: true,
  status: "active",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLogin: Timestamp,
  shippingAddress: {
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA"
  },
  billingAddress: { /* same structure */ },
  preferences: {
    newsletter: true,
    notifications: true
  }
}
```

### Order (Firestore: `orders/{orderId}`)

```javascript
{
  userId: "user123",
  userEmail: "john@example.com",
  userName: "John Doe",
  items: [
    {
      id: "prod_1",
      name: "Wireless Headphones",
      price: 79.99,
      quantity: 1,
      image: "https://...",
      productId: "prod_1"
    }
  ],
  subtotal: 79.99,
  shipping: 9.99,
  tax: 7.99,
  total: 97.97,
  status: "processing", // pending, processing, shipped, delivered, cancelled
  paymentStatus: "completed", // pending, completed, failed
  paymentMethod: "Credit Card",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "+1-555-0101"
  },
  trackingNumber: "TRK123456789",
  estimatedDelivery: Timestamp,
  notes: ""
}
```

## Seeding Sample Data

To populate your database with realistic sample data:

```bash
npm run seed-data
```

This creates:

- 5 sample customers with complete profiles
- 2-5 orders per customer
- Various order statuses (processing, shipped, delivered)
- Realistic timestamps spread over the last 90 days

Sample credentials after seeding:

- Email: `john.doe@example.com`
- Password: `password123`

All sample users use the same password for easy testing.

## Security

### Firestore Security Rules

The application uses comprehensive security rules:

1. **Users Collection**:

   - Users can read/write their own profile
   - Admins can access all profiles

2. **Orders Collection**:

   - Users can read their own orders
   - Users can create orders for themselves
   - Only admins can update/delete orders

3. **Admin Access**:
   - Controlled via custom claims in Firebase Auth
   - Set using the `create-admin` script

### Best Practices

1. **Never expose sensitive data**: Customer payment details are not stored
2. **Use server-side validation**: Important operations should use Cloud Functions
3. **Implement rate limiting**: Prevent abuse of API endpoints
4. **Monitor access patterns**: Use Firebase Analytics to track unusual activity
5. **Regular backups**: Enable automated Firestore backups

## Real-Time Updates

The application can be enhanced with real-time updates:

```javascript
import { onSnapshot } from "firebase/firestore";

// Listen to order updates
const unsubscribe = onSnapshot(doc(db, "orders", orderId), (doc) => {
  console.log("Order updated:", doc.data());
});
```

## Performance Optimization

### Pagination

Both customer and order lists use pagination:

- Reduces initial load time
- Improves performance with large datasets
- Uses Firestore cursors for efficient querying

### Indexes

Required Firestore indexes:

- `orders`: `userId` (asc) + `createdAt` (desc)
- `orders`: `status` (asc) + `createdAt` (desc)
- `users`: `createdAt` (desc) + `status` (asc)

Firebase will prompt you to create these when needed.

### Caching

Consider implementing:

- Local state caching with Zustand
- Service Worker for offline support
- React Query for server state management

## Testing

### Manual Testing

1. **Create Account**: Register a new user
2. **Place Order**: Add items to cart and checkout
3. **View Orders**: Check order history in account page
4. **Admin View**: Login as admin to see all customers/orders

### Sample Data Testing

Use the seeded data to test:

- Customer list pagination
- Order filtering by status
- Date range filtering
- Search functionality
- Order statistics

## Troubleshooting

### Common Issues

1. **Permission Denied**:

   - Check Firestore security rules are deployed
   - Verify user is authenticated
   - Confirm admin claims for admin routes

2. **Missing Data**:

   - Run seed script: `npm run seed-data`
   - Check Firestore console for data
   - Verify collection names match code

3. **Slow Queries**:
   - Create required indexes
   - Implement pagination
   - Reduce query complexity

## Future Enhancements

Consider adding:

- Product inventory management
- Customer reviews and ratings
- Order tracking with shipping APIs
- Email notifications for order updates
- Advanced analytics and reporting
- Export functionality for orders/customers
- Bulk operations for admin
- Customer segmentation
- Loyalty program integration

## Support

For issues or questions:

1. Check Firebase Console for errors
2. Review browser console logs
3. Verify Firestore rules and indexes
4. Check authentication status
5. Review the FIREBASE_SETUP.md guide

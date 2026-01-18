# Application Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Customer   │  │    Admin     │  │     Auth     │      │
│  │    Pages     │  │   Dashboard  │  │    Pages     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │              Context Providers                      │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │     │
│  │  │   Auth   │  │   Cart   │  │  Toast   │         │     │
│  │  │ Context  │  │ Context  │  │ Context  │         │     │
│  │  └──────────┘  └──────────┘  └──────────┘         │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │              Service Layer                          │     │
│  │  ┌──────────────┐  ┌──────────────┐               │     │
│  │  │   Customer   │  │    Order     │               │     │
│  │  │   Service    │  │   Service    │               │     │
│  │  └──────────────┘  └──────────────┘               │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             │ Firebase SDK
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                    Firebase Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firebase   │  │  Firestore   │  │   Cloud      │      │
│  │     Auth     │  │   Database   │  │  Functions   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  Collections:                                                 │
│  • users/{userId}                                            │
│  • orders/{orderId}                                          │
│  • products/{productId} (future)                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### Customer Registration Flow

```
User fills registration form
         ↓
AuthContext.signup()
         ↓
Firebase Auth creates account
         ↓
customerService.createCustomerProfile()
         ↓
User profile created in Firestore
         ↓
User redirected to home page
```

### Order Creation Flow

```
User adds items to cart (Zustand)
         ↓
User proceeds to checkout
         ↓
Checkout page validates cart
         ↓
orderService.createOrder()
         ↓
Order saved to Firestore
         ↓
Cart cleared
         ↓
User redirected to order confirmation
```

### Admin Dashboard Flow

```
Admin logs in
         ↓
AuthContext checks admin claim
         ↓
Admin routes accessible
         ↓
customerService.getCustomers()
orderService.getAllOrders()
         ↓
Data fetched from Firestore
         ↓
Statistics calculated
         ↓
Dashboard displays data
```

## 🔄 Component Hierarchy

```
App
├── Router
│   ├── Public Routes
│   │   ├── Home
│   │   ├── Products
│   │   ├── ProductDetails
│   │   ├── About
│   │   └── Contact
│   │
│   ├── Auth Routes
│   │   ├── Login
│   │   ├── Register
│   │   ├── ForgotPassword
│   │   └── ResetPassword
│   │
│   ├── Protected Routes (Authenticated Users)
│   │   ├── Cart
│   │   ├── Checkout
│   │   ├── Account
│   │   │   ├── Profile
│   │   │   ├── Orders
│   │   │   └── Settings
│   │   └── Wishlist
│   │
│   └── Admin Routes (Admin Users Only)
│       ├── AdminDashboard
│       ├── Customers
│       ├── Orders
│       ├── Products
│       └── Settings
│
├── Providers
│   ├── AuthProvider
│   ├── CartProvider
│   └── ToastProvider
│
└── Layout Components
    ├── Navbar
    ├── Footer
    └── ScrollToTop
```

## 🗄️ State Management

### Global State (Context)

```
AuthContext
├── currentUser
├── isAuthenticated
├── isAdmin
├── login()
├── signup()
└── logout()

CartContext
├── items
├── addItem()
├── removeItem()
├── updateQuantity()
└── clearCart()

ToastContext
├── showToast()
└── hideToast()
```

### Local State (Zustand)

```
cartStore
├── items: []
├── addToCart()
├── removeFromCart()
├── updateQuantity()
└── clearCart()

wishlistStore
├── items: []
├── addToWishlist()
└── removeFromWishlist()
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Route Protection                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │  ProtectedRoute → Checks authentication          │       │
│  │  AdminRoute → Checks admin claim                 │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
│  Layer 2: Firebase Authentication                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Email/Password authentication                    │       │
│  │  Token-based session management                   │       │
│  │  Custom claims for admin access                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
│  Layer 3: Firestore Security Rules                           │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Users can only access their own data            │       │
│  │  Orders protected by userId                       │       │
│  │  Admin access via custom claims                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
│  Layer 4: Service Layer Validation                           │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Input validation                                 │       │
│  │  Type checking                                    │       │
│  │  Error handling                                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  customerService.js                                          │
│  ├── getCustomers(pageSize, lastDoc)                        │
│  ├── getCustomerById(customerId)                            │
│  ├── updateCustomer(customerId, updates)                    │
│  ├── searchCustomers(searchTerm)                            │
│  ├── getCustomerStats()                                     │
│  ├── createCustomerProfile(userId, userData)                │
│  └── updateLastLogin(userId)                                │
│                                                               │
│  orderService.jsx                                            │
│  ├── createOrder(orderData)                                 │
│  ├── getUserOrders(userId)                                  │
│  ├── getAllOrders(pageSize, lastDoc, filters)               │
│  ├── getOrderById(orderId)                                  │
│  ├── updateOrderStatus(orderId, status, additionalData)     │
│  ├── getOrderStats(filters)                                 │
│  └── searchOrders(searchTerm)                               │
│                                                               │
│  Benefits:                                                    │
│  • Abstraction from Firebase                                 │
│  • Reusable business logic                                   │
│  • Consistent error handling                                 │
│  • Easy to test and mock                                     │
│  • Centralized data access                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example

### Customer Views Their Orders

```
1. User navigates to /account/orders
         ↓
2. Orders component mounts
         ↓
3. useEffect calls orderService.getUserOrders(userId)
         ↓
4. Service creates Firestore query
         ↓
5. Firestore security rules check:
   - Is user authenticated? ✓
   - Does userId match request.auth.uid? ✓
         ↓
6. Query executes, data returned
         ↓
7. Service formats data (convert timestamps, etc.)
         ↓
8. Component receives data
         ↓
9. React renders order list
         ↓
10. User sees their orders
```

### Admin Views All Customers

```
1. Admin navigates to /admin/customers
         ↓
2. AdminRoute checks admin claim
         ↓
3. Customers component mounts
         ↓
4. useEffect calls customerService.getCustomers()
         ↓
5. Service creates Firestore query
         ↓
6. Firestore security rules check:
   - Is user authenticated? ✓
   - Does user have admin claim? ✓
         ↓
7. Query executes, fetches all customers
         ↓
8. For each customer, fetch order statistics
         ↓
9. Service formats and aggregates data
         ↓
10. Component receives customer list with stats
         ↓
11. React renders customer table
         ↓
12. Admin sees all customers with order counts and spending
```

## 🎨 UI Component Structure

```
Page Components
├── Layout Components
│   ├── Navbar
│   ├── Footer
│   └── Sidebar (Admin)
│
├── Feature Components
│   ├── ProductCard
│   ├── CartItem
│   ├── OrderCard
│   └── CustomerCard
│
├── Form Components
│   ├── LoginForm
│   ├── RegisterForm
│   ├── CheckoutForm
│   └── ProfileForm
│
└── Utility Components
    ├── LoadingSpinner
    ├── ErrorAlert
    ├── ProtectedRoute
    └── AdminRoute
```

## 📱 Responsive Design Strategy

```
Mobile First Approach
         ↓
Base styles for mobile (< 640px)
         ↓
Tablet adjustments (sm: 640px+)
         ↓
Desktop layout (md: 768px+)
         ↓
Large desktop (lg: 1024px+)
         ↓
Extra large (xl: 1280px+)

Tailwind Breakpoints:
• sm: 640px
• md: 768px
• lg: 1024px
• xl: 1280px
• 2xl: 1536px
```

## 🚀 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                Performance Strategies                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend                                                     │
│  • Code splitting with React.lazy()                          │
│  • Image optimization                                         │
│  • Lazy loading for images                                   │
│  • Memoization with useMemo/useCallback                      │
│  • Virtual scrolling for long lists                          │
│                                                               │
│  Backend                                                      │
│  • Pagination for large datasets                             │
│  • Firestore indexes for fast queries                        │
│  • Efficient query design                                    │
│  • Batch operations where possible                           │
│  • Caching strategies                                        │
│                                                               │
│  Network                                                      │
│  • CDN for static assets                                     │
│  • Compression (gzip/brotli)                                 │
│  • HTTP/2 for multiplexing                                   │
│  • Service Worker for offline support                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔮 Future Architecture Enhancements

### Planned Additions

```
Current Architecture
         ↓
Add Product Management
         ↓
Add Search Service (Algolia)
         ↓
Add Payment Service (Stripe)
         ↓
Add Notification Service
         ↓
Add Analytics Service
         ↓
Add Review System
         ↓
Add Recommendation Engine
         ↓
Microservices Architecture (if needed)
```

### Scalability Considerations

```
Current: Monolithic Frontend + Firebase
         ↓
Next: Add caching layer (Redis)
         ↓
Then: Add search service (Algolia/Elasticsearch)
         ↓
Later: Microservices for complex features
         ↓
Future: Distributed system with message queues
```

## 📊 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                  Monitoring Stack                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Firebase Console                                            │
│  • Authentication metrics                                    │
│  • Firestore usage                                           │
│  • Function execution logs                                   │
│  • Performance monitoring                                    │
│                                                               │
│  Google Analytics                                            │
│  • User behavior tracking                                    │
│  • Conversion tracking                                       │
│  • E-commerce tracking                                       │
│  • Custom events                                             │
│                                                               │
│  Error Tracking (Optional)                                   │
│  • Sentry for error monitoring                               │
│  • LogRocket for session replay                              │
│  • Custom error logging                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for a scalable, maintainable, and secure e-commerce application. The modular design allows for easy extension and modification as your business grows.

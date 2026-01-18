<div align="center">

# 🛍️ Modern E-Commerce Platform

### Full-Stack Single Page Application

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-9.23.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**A production-ready e-commerce solution with real-time data, secure authentication, and powerful admin dashboard**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

---

</div>

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🛒 Customer Experience

- **🔐 Secure Authentication**
  - Email/Password signup & login
  - Password reset & recovery
  - Email verification
  - Session management

- **🛍️ Shopping Features**
  - Browse products catalog
  - Advanced search & filtering
  - Shopping cart with persistence
  - Wishlist functionality
  - Product detail views

- **📦 Order Management**
  - Seamless checkout process
  - Order history & tracking
  - Order status updates
  - Detailed order views

- **👤 Profile Management**
  - Update personal information
  - Manage shipping addresses
  - Change password
  - Account settings

</td>
<td width="50%">

### 📊 Admin Dashboard

- **📈 Analytics & Insights**
  - Real-time revenue tracking
  - Sales statistics & trends
  - Interactive charts (Recharts)
  - Customer metrics

- **👥 Customer Management**
  - View all customers
  - Customer statistics
  - Order history per customer
  - Search & filter customers
  - Customer status tracking

- **📋 Order Processing**
  - Manage all orders
  - Update order status
  - Track fulfillment
  - Advanced filtering
  - Order search

- **🔒 Security & Access**
  - Role-based authentication
  - Custom admin claims
  - Protected routes
  - Secure data access

</td>
</tr>
</table>

### ⚡ Technical Highlights

```
✨ Lightning-fast development with Vite HMR
🎨 Beautiful, responsive UI with Tailwind CSS
🔥 Real-time data synchronization with Firestore
🔒 Multi-layer security architecture
📱 Mobile-first responsive design
🧩 Modular component architecture
🚀 Optimized performance & code splitting
🎯 Type-safe with PropTypes
```

---

## 🎬 Demo

### 🎯 Sample Credentials

After setup, login with these test accounts:

| Role        | Email                   | Password        |
| ----------- | ----------------------- | --------------- |
| 👤 Customer | `john.doe@example.com`  | `password123`   |
| 🔑 Admin    | _Your email from setup_ | _Your password_ |

### 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

> 🚧 Add your application screenshots here

</details>

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 16+** installed ([Download](https://nodejs.org/))
- ✅ **Firebase account** ([Sign up](https://firebase.google.com/))
- ✅ **Firebase CLI** installed globally

```bash
npm install -g firebase-tools
```

### ⚙️ Installation

<details open>
<summary><b>Step 1: Clone & Install Dependencies</b></summary>

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-spa

# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..
```

</details>

<details open>
<summary><b>Step 2: Firebase Configuration</b></summary>

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

</details>

<details open>
<summary><b>Step 3: Environment Setup</b></summary>

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> 💡 Get these values from Firebase Console → Project Settings

</details>

<details open>
<summary><b>Step 4: Seed Sample Data</b></summary>

```bash
# Populate database with sample products, customers, and orders
npm run seed-data
```

This creates:

- 📦 Sample products
- 👥 Test customer accounts
- 🛒 Sample orders

</details>

<details open>
<summary><b>Step 5: Create Admin User</b></summary>

```bash
# Navigate to functions directory
cd functions

# Run admin creation script
npm run create-admin

# Follow the prompts to enter admin email
```

</details>

<details open>
<summary><b>Step 6: Start Development Server</b></summary>

```bash
# Start Vite dev server
npm run dev
```

🎉 **Success!** Visit `http://localhost:5173` to see your app!

</details>

### 🎯 Quick Commands

```bash
npm run dev              # 🚀 Start development server
npm run build            # 📦 Build for production
npm run preview          # 👀 Preview production build
npm run lint             # 🔍 Run ESLint
npm run seed-data        # 🌱 Seed database
npm run create-admin     # 👑 Create admin user
npm run check-orders     # 🔎 Check order data
```

---

## �️ Teuch Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.6-CA4245?style=flat-square&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0.8-000000?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.26-0055FF?style=flat-square&logo=framer&logoColor=white)

### Backend & Services

![Firebase](https://img.shields.io/badge/Firebase-9.23.0-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-NoSQL-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-Authentication-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Cloud Functions](https://img.shields.io/badge/Cloud_Functions-Serverless-FFCA28?style=flat-square&logo=firebase&logoColor=black)

### UI & Visualization

![Recharts](https://img.shields.io/badge/Recharts-3.6.0-8884D8?style=flat-square)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square)
![Heroicons](https://img.shields.io/badge/Heroicons-1.0.6-8B5CF6?style=flat-square)

### Development Tools

![ESLint](https://img.shields.io/badge/ESLint-9.39.1-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-8.4.31-DD3A0A?style=flat-square&logo=postcss&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-10.4.14-DD3735?style=flat-square)

</div>

<details>
<summary><b>📦 Complete Dependency List</b></summary>

### Core Dependencies

| Package            | Version  | Purpose                 |
| ------------------ | -------- | ----------------------- |
| `react`            | 19.2.0   | UI library              |
| `react-dom`        | 19.2.0   | React DOM renderer      |
| `react-router-dom` | 7.9.6    | Client-side routing     |
| `vite`             | 5.1.0    | Build tool & dev server |
| `firebase`         | 9.23.0   | Backend services        |
| `tailwindcss`      | 3.3.5    | CSS framework           |
| `zustand`          | 5.0.8    | State management        |
| `axios`            | 1.13.2   | HTTP client             |
| `framer-motion`    | 12.23.26 | Animations              |
| `recharts`         | 3.6.0    | Charts & graphs         |
| `date-fns`         | 4.1.0    | Date utilities          |
| `lucide-react`     | 0.560.0  | Icon library            |

### Development Dependencies

| Package                | Version | Purpose           |
| ---------------------- | ------- | ----------------- |
| `@vitejs/plugin-react` | 5.1.0   | Vite React plugin |
| `eslint`               | 9.39.1  | Code linting      |
| `firebase-admin`       | 13.6.0  | Admin SDK         |
| `autoprefixer`         | 10.4.14 | CSS prefixing     |
| `postcss`              | 8.4.31  | CSS processing    |

</details>

---

## 📁 Project Structure

```
ecommerce-spa/
│
├── 📂 src/                          # Source code
│   ├── 📂 components/               # Reusable UI components
│   │   ├── NavBar.jsx              # Navigation bar
│   │   ├── Footer.jsx              # Footer component
│   │   ├── ProtectedRoute.jsx     # Auth route guard
│   │   └── AdminRoute.jsx          # Admin route guard
│   │
│   ├── 📂 context/                  # React Context providers
│   │   ├── AuthContext.jsx         # Authentication state
│   │   ├── CartContext.jsx         # Shopping cart state
│   │   └── ToastContext.jsx        # Notification system
│   │
│   ├── 📂 pages/                    # Page components
│   │   ├── Home.jsx                # Landing page
│   │   ├── Products.jsx            # Product catalog
│   │   ├── ProductDetail.jsx       # Product details
│   │   ├── Cart.jsx                # Shopping cart
│   │   ├── Checkout.jsx            # Checkout process
│   │   │
│   │   ├── 📂 auth/                # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── 📂 account/             # User account pages
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   └── PasswordChange.jsx
│   │   │
│   │   └── 📂 admin/               # Admin dashboard
│   │       ├── AdminDashboard.jsx  # Analytics overview
│   │       ├── Customers.jsx       # Customer management
│   │       ├── Orders.jsx          # Order management
│   │       ├── Products.jsx        # Product management
│   │       └── Analytics.jsx       # Detailed analytics
│   │
│   ├── 📂 services/                 # Firebase service layer
│   │   ├── api.jsx                 # API utilities
│   │   ├── customerService.js      # Customer operations
│   │   └── orderService.jsx        # Order operations
│   │
│   ├── 📂 store/                    # Zustand state stores
│   │   ├── cartStore.js            # Cart state
│   │   └── wishlistStore.js        # Wishlist state
│   │
│   ├── 📂 utils/                    # Utility functions
│   │   └── helpers.js              # Helper functions
│   │
│   ├── firebase.js                  # Firebase configuration
│   ├── App.jsx                      # Root component
│   └── main.jsx                     # Entry point
│
├── 📂 functions/                    # Firebase Cloud Functions
│   ├── index.js                    # Function definitions
│   └── package.json                # Function dependencies
│
├── 📂 scripts/                      # Utility scripts
│   ├── seedData.mjs                # Database seeding
│   ├── createAdmin.mjs             # Admin user creation
│   └── checkOrders.mjs             # Order verification
│
├── 📂 public/                       # Static assets
│   └── images/                     # Image files
│
├── 📄 firestore.rules              # Firestore security rules
├── 📄 firestore.indexes.json       # Database indexes
├── 📄 firebase.json                # Firebase configuration
├── 📄 tailwind.config.js           # Tailwind configuration
├── 📄 vite.config.js               # Vite configuration
├── 📄 package.json                 # Dependencies
└── 📄 .env                         # Environment variables
```

---

## 📊 Data Structure

### 🗄️ Firestore Collections

<details>
<summary><b>👥 Users Collection</b></summary>

```javascript
users/{userId}
{
  displayName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1-555-0101",
  status: "active",                    // active | inactive | suspended
  createdAt: Timestamp,
  lastLogin: Timestamp,
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  billingAddress: { /* same structure */ },
  preferences: {
    newsletter: true,
    notifications: true
  }
}
```

</details>

<details>
<summary><b>📦 Orders Collection</b></summary>

```javascript
orders/{orderId}
{
  userId: "user123",
  userEmail: "john@example.com",
  userName: "John Doe",
  items: [
    {
      id: "product123",
      name: "Product Name",
      price: 29.99,
      quantity: 2,
      image: "url"
    }
  ],
  subtotal: 59.98,
  tax: 5.40,
  shipping: 10.00,
  total: 75.38,
  status: "processing",               // pending | processing | shipped | delivered | cancelled
  paymentMethod: "credit_card",
  shippingAddress: { /* address object */ },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  trackingNumber: "TRACK123",
  notes: "Special instructions"
}
```

</details>

<details>
<summary><b>🛍️ Products Collection (Future)</b></summary>

```javascript
products/{productId}
{
  name: "Product Name",
  description: "Product description",
  price: 29.99,
  compareAtPrice: 39.99,
  category: "electronics",
  subcategory: "phones",
  images: ["url1", "url2"],
  inStock: true,
  quantity: 100,
  sku: "PROD-123",
  tags: ["featured", "sale"],
  rating: 4.5,
  reviewCount: 42,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

</details>

> 📖 For complete data documentation, see [README_DATA.md](./README_DATA.md)

---

## 🔐 Security

<table>
<tr>
<td width="50%">

### 🛡️ Security Layers

**Layer 1: Route Protection**

- `ProtectedRoute` component for authenticated users
- `AdminRoute` component for admin-only access
- Automatic redirect to login

**Layer 2: Firebase Authentication**

- Secure email/password authentication
- Token-based session management
- Custom claims for role-based access
- Password reset functionality

</td>
<td width="50%">

### 🔒 Data Protection

**Layer 3: Firestore Security Rules**

- Users can only access their own data
- Orders protected by userId validation
- Admin access via custom claims
- Read/write rules per collection

**Layer 4: Service Layer Validation**

- Input validation and sanitization
- Type checking with PropTypes
- Error handling and logging
- Request validation

</td>
</tr>
</table>

### 🔑 Firestore Security Rules

```javascript
// Users can read their own profile, admins can read all
match /users/{userId} {
  allow read: if request.auth.uid == userId || isAdmin();
  allow create: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId || isAdmin();
}

// Users can read their own orders, admins can read all
match /orders/{orderId} {
  allow read: if resource.data.userId == request.auth.uid || isAdmin();
  allow create: if request.resource.data.userId == request.auth.uid;
  allow update: if isAdmin();
}
```

> 📖 See [firestore.rules](./firestore.rules) for complete security rules

---

## 🚀 Deployment

### 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### 🔥 Deploy to Firebase Hosting

<details>
<summary><b>Step-by-step deployment</b></summary>

```bash
# 1. Build the application
npm run build

# 2. Deploy everything (hosting, functions, rules)
firebase deploy

# Or deploy specific services:
firebase deploy --only hosting          # Deploy website only
firebase deploy --only functions        # Deploy functions only
firebase deploy --only firestore:rules  # Deploy security rules only
```

</details>

### 🌐 Deploy to Other Platforms

<details>
<summary><b>Vercel</b></summary>

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

</details>

<details>
<summary><b>Netlify</b></summary>

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

</details>

<details>
<summary><b>AWS Amplify</b></summary>

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

</details>

### 🔧 Environment Variables for Production

Ensure these are set in your hosting platform:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

---

## 📚 Documentation

| Document                                             | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| [QUICKSTART.md](./QUICKSTART.md)                     | Get started in 5 minutes        |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)             | Detailed Firebase configuration |
| [README_DATA.md](./README_DATA.md)                   | Data management and structure   |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | System architecture overview    |
| [src/services/README.md](./src/services/README.md)   | Service layer documentation     |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist        |

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### 🔍 Manual Testing Checklist

- [ ] User registration and login
- [ ] Password reset flow
- [ ] Add items to cart
- [ ] Checkout process
- [ ] Order creation
- [ ] View order history
- [ ] Admin login
- [ ] Customer management
- [ ] Order status updates
- [ ] Analytics dashboard

---

## 🐛 Troubleshooting

<details>
<summary><b>Firebase Connection Issues</b></summary>

**Problem:** Can't connect to Firebase

**Solutions:**

1. Check `.env` file has correct Firebase config
2. Verify Firebase project is active
3. Check browser console for errors
4. Ensure Firestore rules are deployed

```bash
firebase deploy --only firestore:rules
```

</details>

<details>
<summary><b>Admin Access Not Working</b></summary>

**Problem:** Can't access admin dashboard

**Solutions:**

1. Verify admin claim is set:

```bash
cd functions
npm run create-admin
```

2. Check Firebase Console → Authentication → Users
3. Logout and login again to refresh token
4. Check browser console for auth errors

</details>

<details>
<summary><b>Orders Not Showing</b></summary>

**Problem:** Orders page is empty

**Solutions:**

1. Check if data is seeded:

```bash
npm run seed-data
```

2. Verify Firestore indexes:

```bash
firebase deploy --only firestore:indexes
```

3. Check browser console for query errors
4. Verify user is logged in

</details>

<details>
<summary><b>Build Errors</b></summary>

**Problem:** Build fails with errors

**Solutions:**

1. Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check Node.js version (requires 16+)
3. Run linter to find issues:

```bash
npm run lint
```

</details>

> 📖 For more troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🔧 Development Workflow

1. **Fork the repository**

```bash
git clone https://github.com/yourusername/ecommerce-spa.git
cd ecommerce-spa
```

2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**

- Write clean, readable code
- Follow existing code style
- Add comments where necessary
- Test your changes thoroughly

4. **Commit your changes**

```bash
git add .
git commit -m "Add amazing feature"
```

5. **Push to your fork**

```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

- Describe your changes
- Reference any related issues
- Wait for review

### 📝 Coding Standards

- Use ES6+ JavaScript features
- Follow React best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add PropTypes for type checking
- Keep components small and focused
- Use Tailwind CSS for styling

### 🐛 Bug Reports

Found a bug? Please open an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### 💡 Feature Requests

Have an idea? Open an issue with:

- Clear description of the feature
- Use cases and benefits
- Possible implementation approach

---

## 🗺️ Roadmap

### 🎯 Current Features (v1.0)

- ✅ User authentication
- ✅ Shopping cart
- ✅ Order management
- ✅ Admin dashboard
- ✅ Customer management
- ✅ Analytics

### 🚀 Upcoming Features (v2.0)

**Phase 1: Product Management**

- [ ] Product CRUD operations
- [ ] Category management
- [ ] Inventory tracking
- [ ] Product variants (size, color)
- [ ] Bulk product import

**Phase 2: Enhanced Shopping**

- [ ] Advanced product search
- [ ] Filters and sorting
- [ ] Product recommendations
- [ ] Customer reviews and ratings
- [ ] Wishlist sharing

**Phase 3: Payment Integration**

- [ ] Stripe payment gateway
- [ ] PayPal integration
- [ ] Multiple payment methods
- [ ] Refund processing
- [ ] Invoice generation

**Phase 4: Communication**

- [ ] Email notifications
- [ ] Order status emails
- [ ] Newsletter system
- [ ] SMS notifications
- [ ] Push notifications

**Phase 5: Advanced Features**

- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Advanced analytics
- [ ] Export reports (PDF, CSV)
- [ ] Coupon and discount system
- [ ] Loyalty program
- [ ] Gift cards

**Phase 6: Mobile & Performance**

- [ ] React Native mobile app
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Performance optimization
- [ ] SEO improvements

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 E-Commerce SPA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

Special thanks to:

- **[React Team](https://reactjs.org/)** - For the amazing UI library
- **[Firebase Team](https://firebase.google.com/)** - For the powerful backend platform
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Vite Team](https://vitejs.dev/)** - For the lightning-fast build tool
- **[Recharts](https://recharts.org/)** - For beautiful chart components
- **Open Source Community** - For countless helpful libraries and tools

### 🌟 Built With

- ☕ Coffee
- 💻 Code
- ❤️ Love for web development

---

## 📞 Support & Contact

### 💬 Get Help

- 📖 **Documentation**: Check the [docs](#-documentation) section
- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/ecommerce-spa/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/ecommerce-spa/discussions)
- 📧 **Email**: support@yourcompany.com

### 🔗 Links

- 🌐 **Live Demo**: [https://your-app.web.app](https://your-app.web.app)
- 📚 **Documentation**: [https://docs.yourapp.com](https://docs.yourapp.com)
- 🐦 **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- 💼 **LinkedIn**: [Your Company](https://linkedin.com/company/yourcompany)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ecommerce-spa?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ecommerce-spa?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/ecommerce-spa?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ecommerce-spa)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ecommerce-spa)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/ecommerce-spa)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ using React, Firebase, and Tailwind CSS**

[⬆ Back to Top](#-modern-e-commerce-platform)

---

© 2026 E-Commerce SPA. All rights reserved.

</div>

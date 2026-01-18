# Services Documentation

This directory contains service modules that handle data operations with Firebase Firestore.

## Overview

Services provide a clean abstraction layer between your React components and Firebase, making it easier to:

- Manage data operations
- Handle errors consistently
- Implement caching and optimization
- Test your application
- Switch backends if needed

## Available Services

### Customer Service (`customerService.js`)

Handles all customer-related operations.

#### Functions

**`getCustomers(pageSize, lastDoc)`**

- Fetches customers with pagination
- Returns: `{ customers: Array, lastVisible: DocumentSnapshot }`
- Use for: Admin customer list

**`getCustomerById(customerId)`**

- Gets detailed customer information with order history
- Returns: Customer object with orders array
- Use for: Customer detail page

**`updateCustomer(customerId, updates)`**

- Updates customer information
- Returns: Promise<void>
- Use for: Profile updates, admin edits

**`searchCustomers(searchTerm)`**

- Searches customers by name or email
- Returns: Array of matching customers
- Use for: Admin search functionality

**`getCustomerStats()`**

- Gets customer statistics
- Returns: Object with total, new, active, inactive counts
- Use for: Dashboard analytics

**`createCustomerProfile(userId, userData)`**

- Creates customer profile on signup
- Returns: Promise<void>
- Use for: Automatic profile creation

**`updateLastLogin(userId)`**

- Updates user's last login timestamp
- Returns: Promise<void>
- Use for: Activity tracking

#### Example Usage

```javascript
import { getCustomers, getCustomerById } from "../services/customerService";

// Fetch customers with pagination
const { customers, lastVisible } = await getCustomers(10);

// Get customer details
const customer = await getCustomerById("user123");
console.log(customer.orders); // Array of orders
```

### Order Service (`orderService.jsx`)

Handles all order-related operations.

#### Functions

**`createOrder(orderData)`**

- Creates a new order
- Returns: Order ID (string)
- Use for: Checkout process

**`getUserOrders(userId)`**

- Gets all orders for a specific user
- Returns: Array of orders
- Use for: User order history

**`getAllOrders(pageSize, lastDoc, filters)`**

- Gets all orders with pagination and filtering (admin)
- Filters: `{ status, startDate, endDate }`
- Returns: `{ orders: Array, lastVisible: DocumentSnapshot }`
- Use for: Admin order management

**`getOrderById(orderId)`**

- Gets single order details
- Returns: Order object
- Use for: Order detail page

**`updateOrderStatus(orderId, status, additionalData)`**

- Updates order status
- Returns: Promise<void>
- Use for: Admin order management

**`getOrderStats(filters)`**

- Gets order statistics
- Returns: Object with totalOrders, totalRevenue, averageOrderValue, statusCounts
- Use for: Dashboard analytics

**`searchOrders(searchTerm)`**

- Searches orders by email
- Returns: Array of matching orders
- Use for: Admin search functionality

#### Example Usage

```javascript
import { createOrder, getUserOrders, updateOrderStatus } from '../services/orderService';

// Create an order
const orderId = await createOrder({
  userId: 'user123',
  items: [...],
  total: 99.99,
  // ... other fields
});

// Get user's orders
const orders = await getUserOrders('user123');

// Update order status
await updateOrderStatus(orderId, 'shipped', {
  trackingNumber: 'TRK123456'
});
```

## Data Models

### Customer Model

```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: Date | null;
  joined: Date;
  status: "active" | "inactive";
  address: Address | null;
  photoURL: string | null;
  emailVerified: boolean;
}
```

### Order Model

```typescript
interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  notes: string;
}
```

### Order Item Model

```typescript
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
}
```

### Address Model

```typescript
interface Address {
  name?: string;
  street?: string;
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}
```

## Error Handling

All service functions throw errors that should be caught in your components:

```javascript
try {
  const customers = await getCustomers();
  setCustomers(customers);
} catch (error) {
  console.error("Error fetching customers:", error);
  setError("Failed to load customers. Please try again.");
}
```

## Best Practices

### 1. Use Services in Components

```javascript
// ✅ Good
import { getCustomers } from "../services/customerService";

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { customers } = await getCustomers();
      setCustomers(customers);
    };
    fetchData();
  }, []);
};

// ❌ Bad - Direct Firestore access in component
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      // ...
    };
    fetchData();
  }, []);
};
```

### 2. Handle Loading States

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data.customers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 3. Implement Pagination

```javascript
const [lastDoc, setLastDoc] = useState(null);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  if (!hasMore) return;

  const { customers, lastVisible } = await getCustomers(10, lastDoc);
  setCustomers((prev) => [...prev, ...customers]);
  setLastDoc(lastVisible);
  setHasMore(customers.length === 10);
};
```

### 4. Cache Data When Appropriate

```javascript
// Use React Query or similar for caching
import { useQuery } from "react-query";

const { data, isLoading } = useQuery(
  ["customers", page],
  () => getCustomers(10),
  { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
);
```

## Performance Tips

1. **Use pagination**: Don't load all data at once
2. **Implement search server-side**: Use Firestore queries or Algolia
3. **Cache frequently accessed data**: Use React Query or similar
4. **Optimize queries**: Create proper Firestore indexes
5. **Lazy load details**: Load full details only when needed

## Testing

### Mock Services for Testing

```javascript
// __mocks__/customerService.js
export const getCustomers = jest.fn(() =>
  Promise.resolve({
    customers: [{ id: "1", name: "Test User", email: "test@example.com" }],
    lastVisible: null,
  })
);
```

### Use in Tests

```javascript
import { getCustomers } from "../services/customerService";

jest.mock("../services/customerService");

test("loads customers", async () => {
  const { customers } = await getCustomers();
  expect(customers).toHaveLength(1);
});
```

## Future Enhancements

Consider adding:

- **Batch operations**: Update multiple records at once
- **Real-time listeners**: Subscribe to data changes
- **Offline support**: Queue operations when offline
- **Optimistic updates**: Update UI before server confirms
- **Data validation**: Validate data before sending to Firestore
- **Rate limiting**: Prevent abuse of API calls
- **Caching layer**: Reduce Firestore reads

## Related Documentation

- [Firebase Setup Guide](../../FIREBASE_SETUP.md)
- [Data Management Guide](../../README_DATA.md)
- [Firestore Security Rules](../../firestore.rules)

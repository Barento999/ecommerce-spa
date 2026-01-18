# Troubleshooting Guide

Common issues and their solutions for the e-commerce application.

## 🔥 Firebase Errors

### "The query requires an index"

**Error Message:**

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

**Solution:**

**Option 1 - Click the Link (Easiest)**:

1. Click the link in the error message
2. Click "Create Index" in Firebase Console
3. Wait 2-5 minutes for index to build
4. Refresh your app

**Option 2 - Deploy All Indexes**:

```bash
firebase deploy --only firestore:indexes
```

**Option 3 - Manual Creation**:
See [INDEX_SETUP_GUIDE.md](./INDEX_SETUP_GUIDE.md) for detailed instructions.

### "Expected first argument to collection() to be a CollectionReference"

**Cause**: The Firestore database instance (`db`) is not properly initialized.

**Solution**:

1. Make sure you're using `getFirestoreDb()` instead of importing `db` directly
2. Check that Firebase is initialized before making queries
3. Verify your Firebase configuration in `src/firebase.js`

**Example Fix**:

```javascript
// ❌ Wrong
import { db } from "../../firebase";
const orderDoc = await getDoc(doc(db, "orders", orderId));

// ✅ Correct
import { getFirestoreDb } from "../../firebase";
const db = getFirestoreDb();
const orderDoc = await getDoc(doc(db, "orders", orderId));
```

### "Permission denied"

**Error Message:**

```
FirebaseError: Missing or insufficient permissions
```

**Solutions**:

1. **Deploy Security Rules**:

```bash
firebase deploy --only firestore:rules
```

2. **Check Authentication**:

   - Make sure you're logged in
   - Verify the user token is valid
   - Check that the user has the correct permissions

3. **Verify Rules**:

   - Go to Firebase Console → Firestore → Rules
   - Check that rules are deployed
   - Test rules in the Rules Playground

4. **Admin Access**:
   - For admin routes, ensure the user has admin custom claim
   - Run `npm run create-admin` to set admin role

### "Firebase app not initialized"

**Solution**:

1. Check that `src/firebase.js` is being imported
2. Verify Firebase config is correct
3. Make sure you're not running in SSR mode without proper checks

## 📦 Data Issues

### No Orders Showing

**Possible Causes**:

1. No orders in database
2. Index not created
3. User ID mismatch
4. Query error

**Solutions**:

1. **Seed Sample Data**:

```bash
npm run seed-data
```

2. **Check Firestore Console**:

   - Go to Firebase Console → Firestore
   - Verify `orders` collection exists
   - Check that orders have correct `userId` field

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for error messages
   - Check network tab for failed requests

### No Customers Showing in Admin

**Solutions**:

1. **Create Indexes**:

```bash
firebase deploy --only firestore:indexes
```

2. **Verify Admin Access**:

   - Make sure you're logged in as admin
   - Check admin claim: `firebase auth:export users.json`

3. **Seed Data**:

```bash
npm run seed-data
```

## 🔐 Authentication Issues

### Can't Login

**Solutions**:

1. **Check Email/Password Auth is Enabled**:

   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password provider

2. **Verify Credentials**:

   - Use sample credentials: `john.doe@example.com` / `password123`
   - Or create a new account

3. **Clear Browser Data**:
   - Clear cookies and local storage
   - Try incognito mode

### Admin Routes Not Accessible

**Solutions**:

1. **Set Admin Claim**:

```bash
cd functions
npm run create-admin
```

2. **Force Token Refresh**:

   - Logout and login again
   - Or clear browser data

3. **Check Admin Status**:
   - Open browser console
   - Check `currentUser.isAdmin` value
   - Verify custom claims in Firebase Console

## 🚀 Build & Development Issues

### Build Fails

**Solutions**:

1. **Clean Install**:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Check Node Version**:

```bash
node --version  # Should be 16+
```

3. **Fix Linting Errors**:

```bash
npm run lint
```

### Dev Server Won't Start

**Solutions**:

1. **Check Port**:

   - Port 5173 might be in use
   - Kill the process or use a different port

2. **Clear Cache**:

```bash
rm -rf node_modules/.vite
npm run dev
```

3. **Check Dependencies**:

```bash
npm install
```

## 📱 UI Issues

### Styles Not Loading

**Solutions**:

1. **Rebuild Tailwind**:

```bash
npm run build
```

2. **Check Tailwind Config**:

   - Verify `tailwind.config.js` is correct
   - Check that content paths include all component files

3. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Images Not Loading

**Solutions**:

1. **Check Image URLs**:

   - Verify URLs are valid
   - Check CORS settings if loading from external sources

2. **Use Placeholder**:
   - Add fallback images
   - Handle broken image errors

## 🔧 Firebase CLI Issues

### "Not authorized"

**Solution**:

```bash
firebase logout
firebase login
```

### "No project selected"

**Solution**:

```bash
firebase use ecommerce-55491
```

Or initialize:

```bash
firebase init
```

### "Functions deployment failed"

**Solutions**:

1. **Check Node Version in Functions**:

```bash
cd functions
node --version  # Should match engines in package.json
```

2. **Install Dependencies**:

```bash
cd functions
npm install
```

3. **Check Billing**:
   - Cloud Functions require Blaze plan
   - Enable billing in Firebase Console

## 📊 Performance Issues

### Slow Queries

**Solutions**:

1. **Create Indexes**:

```bash
firebase deploy --only firestore:indexes
```

2. **Implement Pagination**:

   - Use the pagination features in services
   - Limit query results

3. **Optimize Queries**:
   - Reduce number of fields fetched
   - Use `select()` to get specific fields only

### High Firebase Costs

**Solutions**:

1. **Enable Caching**:

   - Implement React Query or similar
   - Cache frequently accessed data

2. **Optimize Reads**:

   - Use pagination
   - Implement lazy loading
   - Cache data in local state

3. **Set Budget Alerts**:
   - Go to Firebase Console → Usage and billing
   - Set up budget alerts

## 🐛 Common Code Errors

### "Cannot read property 'map' of undefined"

**Cause**: Trying to map over data that hasn't loaded yet.

**Solution**:

```javascript
// ❌ Wrong
{orders.map(order => ...)}

// ✅ Correct
{orders?.map(order => ...) || <LoadingSpinner />}
```

### "Maximum update depth exceeded"

**Cause**: Infinite loop in useEffect.

**Solution**:

```javascript
// ❌ Wrong
useEffect(() => {
  fetchData();
}); // Missing dependency array

// ✅ Correct
useEffect(() => {
  fetchData();
}, []); // Empty array for mount only
```

## 📞 Getting Help

If you're still stuck:

1. **Check Documentation**:

   - [QUICKSTART.md](./QUICKSTART.md)
   - [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - [INDEX_SETUP_GUIDE.md](./INDEX_SETUP_GUIDE.md)

2. **Check Firebase Console**:

   - Look for errors in Firestore
   - Check Authentication logs
   - Review Functions logs

3. **Check Browser Console**:

   - Open DevTools (F12)
   - Look for error messages
   - Check network requests

4. **Review Code**:
   - Check for typos
   - Verify imports
   - Ensure proper error handling

## 🔍 Debugging Tips

### Enable Verbose Logging

```javascript
// In src/firebase.js
console.log("Firebase initialized:", app);
console.log("Firestore instance:", db);
```

### Check Firestore Data

```javascript
// In browser console
const db = getFirestoreDb();
const snapshot = await getDocs(collection(db, "orders"));
console.log(
  "Orders:",
  snapshot.docs.map((doc) => doc.data())
);
```

### Verify Authentication

```javascript
// In browser console
const auth = getAuth();
console.log("Current user:", auth.currentUser);
console.log("Is admin:", auth.currentUser?.isAdmin);
```

---

**Still having issues?** Check the error message carefully - it usually tells you exactly what's wrong!

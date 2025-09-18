# Glowy E-commerce Application

A modern e-commerce web application built with React, Tailwind CSS, and Firebase.

## Features

### User Features
- **Home Page**: Welcome page with featured products and categories
- **Authentication**: User login and signup with Firebase Auth
- **Product Browsing**: View all products with filtering and search
- **Product Details**: Detailed product view with image gallery and options
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, view order history, track orders
- **User Dashboard**: Quick overview of recent orders and actions

### Admin Features
- **Admin Dashboard**: Overview of orders, products, and revenue
- **Product Management**: Add new products with images and details
- **Order Management**: View and update order statuses
- **Analytics**: Basic sales and order statistics

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: React Context API
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/
│   └── shared/
│       ├── Navbar/
│       ├── Footer/
│       ├── ProductCard/
│       ├── CartItem/
│       ├── ProtectedRoute/
│       └── AdminRoute/
├── contexts/
│   ├── AuthContext.js
│   └── CartContext.js
├── pages/
│   ├── user/
│   │   ├── Home/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── Products/
│   │   │   ├── AllProducts.js
│   │   │   └── Product.js
│   │   ├── Cart/
│   │   │   └── ShoppingCart.js
│   │   └── Orders/
│   │       ├── ConfirmOrder.js
│   │       ├── OrderHistory.js
│   │       └── MyOrders.js
│   └── admin/
│       ├── Home/
│       │   └── AdminHome.js
│       ├── Products/
│       │   └── AddProduct.js
│       └── Orders/
│           └── AdminOrders.js
├── config/
│   └── firebase.js
├── App.js
└── index.js
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd glowy-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore Database, and Storage
3. Copy your Firebase configuration
4. Update `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules
Set up your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all authenticated users
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == "admin@glowy.com";
    }
    
    // Orders are readable/writable by the user who created them
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Storage Security Rules
Set up your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == "admin@glowy.com";
    }
  }
}
```

### 6. Create Admin User
1. Sign up a user with email `admin@glowy.com`
2. This user will have admin access to the application

### 7. Run the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### For Users
1. **Sign Up/Login**: Create an account or login to access features
2. **Browse Products**: View all products with filtering options
3. **Add to Cart**: Add products to your shopping cart
4. **Checkout**: Complete your order with shipping and payment details
5. **Track Orders**: View your order history and current order status

### For Admins
1. **Login**: Use the admin email (`admin@glowy.com`) to access admin features
2. **Dashboard**: View sales statistics and recent orders
3. **Add Products**: Create new products with images and details
4. **Manage Orders**: Update order statuses and view order details

## Features to Implement

This is a structure-only implementation. You'll need to implement:

1. **UI Components**: Style all components with Tailwind CSS
2. **Image Upload**: Implement image upload functionality for products
3. **Payment Integration**: Add payment processing (Stripe, PayPal, etc.)
4. **Email Notifications**: Send order confirmations and updates
5. **Search Functionality**: Implement advanced search and filtering
6. **Responsive Design**: Ensure mobile-friendly design
7. **Error Handling**: Add proper error handling and loading states
8. **Form Validation**: Implement client-side and server-side validation
9. **SEO Optimization**: Add meta tags and SEO-friendly URLs
10. **Performance Optimization**: Implement lazy loading and code splitting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





NEXOECOMMERCE_FRONTEND/
│
├── node_modules/
├── public/
│   ├── images/
│   │   └── default-avatar.png
│   ├── logo.svg
│   ├── favicon.ico
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AdminPopup.jsx
│   │   │   ├── AdsCarousel.jsx
│   │   │   ├── AIChatWidget.jsx
│   │   │   ├── DarkModeToggle.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── forms/
│   │   │   ├── ProductUploadForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   ├── SignInForm.jsx
│   │   │   └── SignUpForm.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── RootLayout.jsx
│   │   │   └── UserDashboardLayout.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Rating.jsx
│   │   │   └── ProtectedRoute.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useDebounce.js
│   │   └── useRealtime.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAdmins.jsx
│   │   │   ├── AdminAnalytics.jsx
│   │   │   ├── AdminAuditLogs.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminMessages.jsx
│   │   │   ├── AdminNotifications.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminPopup.jsx
│   │   │   ├── AdminPremium.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminReviews.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   └── SuperAdminDashboard.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── GoogleCallback.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   └── VerifyResetOTP.jsx
│   │   │
│   │   ├── checkout/
│   │   │   └── CartPage.jsx
│   │   │
│   │   ├── public/
│   │   │   ├── AboutUs.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── PublicProfilePage.jsx
│   │   │   └── ShopPage.jsx
│   │   │
│   │   └── user/
│   │       ├── PublicProfilePage.jsx
│   │       ├── UserDashboard.jsx
│   │       ├── UserListings.jsx
│   │       ├── UserMessages.jsx
│   │       ├── UserNotifications.jsx
│   │       ├── UserOrders.jsx
│   │       ├── UserPremium.jsx
│   │       ├── UserProfile.jsx
│   │       ├── UserSales.jsx
│   │       ├── UserSettings.jsx
│   │       ├── UserUploadProduct.jsx
│   │       └── UserWishlist.jsx
│   │
│   ├── services/
│   │   ├── admin.js
│   │   ├── aiAssistant.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── chat.js
│   │   ├── contact.js
│   │   ├── dashboard.js
│   │   ├── notifications.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── premium.js
│   │   ├── products.js
│   │   ├── supabase.js
│   │   ├── users.js
│   │   └── wishlist.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   ├── notificationStore.js
│   │   └── themeStore.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
└── vite.config.js.timestamp-*
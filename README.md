# 🍔DineNow - A Food Delivery Platform

A full-stack food delivery web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and integrated with **Stripe** for secure online payments.

---

## ✨ Features

- 🧾 Browse restaurant menus and food items  
- 🛒 Add/remove items from cart with quantity control  
- 🔐 User authentication using JWT (Login & Register) along with email OTP verification
- 💳 Stripe integration for secure online payments  
- 🚚 Place orders with real-time tracking  
- 🧑‍💼 Admin panel to manage products and orders  
- 📱 Fully responsive design (mobile + desktop)


## 🧰 Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Frontend  | React.js, CSS    |
| Backend   | Node.js, Express.js       |
| Database  | MongoDB with Mongoose     |
| Auth      | JSON Web Tokens (JWT)     |
| Payments  | Stripe API                |

---
## Admin Credentials
- ADMIN_EMAIL="dinenowadmin@gmail.com"
- ADMIN_PASSWORD="DineNowAdmin@123"
---

## 🔐 Environment Variables
Create a `.env` file inside the `backend/` folder:
- JWT_SECRET="Your-jwt-secret"
- MONGO_URL="your-mongodb-url"
- STRIPE_SECRET_KEY="stripe secret key"
- USER_EMAIL="user mail"
- USER_APPCODE="your email appcode"
- ADMIN_EMAIL="dinenowadmin@gmail.com"
- ADMIN_PASSWORD="DineNowAdmin@123"
- FRONTENDURL="http://localhost:5173/"

## 🧑‍💻 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/BheemaReddy07/Food_delivery.git
cd Food_delivery
```
### 2. Install Backend Dependencies
```bash
cd backend
npm install
```
### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
### 4. Install Admin Dependencies
```bash
cd ../admin
npm install
```

### 5. Run the Project
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start
```
---
##  Test Card (if using Stripe)
```bash
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

## Contact
Bheemareddy
- email:bheemareddy2910@gmail.com

🌟 If you like this project, give it a star!



🏧 ATM-Simulator

✨ A full-stack web-based ATM simulator with user authentication, deposit & withdrawal features using Node.js, Express, and MongoDB.

💡 Overview

The ATM Simulator is a full-stack web application that replicates the basic operations of a real ATM.
Users can sign up, log in, deposit, and withdraw money, while their account data is securely managed in MongoDB.

It demonstrates authentication, transaction management, and RESTful API communication between a Node.js backend and a browser-based frontend.

⚙️ Features

👤 User Authentication (Signup & Login)

💰 Deposit and Withdraw functionality

📊 Real-Time Balance Updates

🗄️ MongoDB Integration for persistent data

📜 Transaction History tracking

🔐 Secure PIN Verification

🎨 Simple and Interactive Frontend

🧰 Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express.js
Database	MongoDB
API Testing	Postman
Hosting (optional)	Render / Vercel / MongoDB Atlas
🚀 Getting Started
🧩 Prerequisites

Make sure you have installed:

Node.js

MongoDB

A code editor like VS Code

(Optional) MongoDB Compass for database inspection

⚙️ Project Setup
1️⃣ Clone the Repository
git clone https://github.com/Bharani-Subramanya/ATM-Simulator.git
cd ATM-Simulator

2️⃣ Backend Setup
cd backend
npm install
npm start


✅ Should show:

✅ Connected to MongoDB successfully!
🚀 Server is running on http://localhost:5000

3️⃣ MongoDB Configuration

Create a .env file inside your backend folder with:

MONGO_URI=your_mongodb_connection_string
PORT=5000


Example:

mongodb://localhost:27017/atm_simulator

4️⃣ Frontend Setup

No complex setup required — just open the frontend HTML files directly in your browser:

login_signup.html

atmsimulation.html

Or, if hosted, access them through your server.

🔗 API Endpoints
Method	Endpoint	Description
POST	/api/signup	Create a new user
POST	/api/login	Login and validate user
GET	/api/user/:id	Fetch user details
POST	/api/deposit	Deposit money
POST	/api/withdraw	Withdraw money
GET	/api/transactions/:userId	Fetch user transaction history
🧪 How It Works (Testing the Full Flow)
Step 1: Run the Backend
cd backend
npm start


Should show:

✅ Connected to MongoDB successfully!
🚀 Server is running on http://localhost:5000

Step 2: Open Frontend

Open frontend/login_signup.html directly in your browser (double-click or drag into a browser window).

Step 3: Test the Complete Flow
🧍‍♂️ Test 1: Signup

Open login_signup.html

Click SIGN UP

Fill in:

Name: John Doe

Email: john@test.com

Card Number: 1234567890123456

PIN: 1234

Balance: 5000 (or leave blank for default 1000)

Click CREATE ACCOUNT
✅ Should show: “Account created successfully!”

🗄️ Test 2: Check MongoDB

Open MongoDB Compass

Connect to localhost:27017

Find the database → atm_simulator

Open users collection
🎉 You should see John’s data there!

🔐 Test 3: Login

Go back to the login page

Enter:

Card Number: 1234567890123456

PIN: 1234

Click ACCESS ATM
✅ Should redirect to dashboard!

💰 Test 4: Deposit

On the dashboard, enter an amount in Deposit Money section

Click Deposit
✅ Balance updates instantly (check MongoDB – balance updated)

💸 Test 5: Withdraw

Enter amount under Withdraw Money

Click Withdraw
✅ Balance decreases (check MongoDB – updated)

📜 Test 6: Transaction History

After deposit/withdraw, scroll down

You’ll see Transaction History

MongoDB saves each transaction as a record

✅ Expected Results Summary
Function	Expected Result
Signup	Creates new user in MongoDB
Login	Authenticates from MongoDB
Dashboard	Loads user data dynamically
Deposit	Increases balance in DB
Withdraw	Decreases balance in DB
Transaction History	Displays all transactions
Logout	Clears session and returns to login
Page Refresh	Resets form fields
🎯 Final Setup & Verification Steps
1️⃣ Replace Frontend Files

If updating design or functionality:

Open VS Code → D:\atm-simulaor\frontend\

Replace:

login_signup.html → latest login/signup UI

atmsimulation.html → latest dashboard UI

Save changes (Ctrl + S)

2️⃣ Verify Backend

Run again to confirm connectivity:

npm start


✅ Should show:
✅ Connected to MongoDB successfully!
🚀 Server is running on http://localhost:5000

📜 License
This project is licensed under the MIT License — feel free to use and modify it.

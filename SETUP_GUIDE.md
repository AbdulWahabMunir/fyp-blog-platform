# Complete Setup Guide - Visual Studio Code

This guide will help you set up the entire blog project from scratch in Visual Studio Code with a new MongoDB Atlas database.

## 📋 Table of Contents

1. [Project Structure - What Files You Need](#project-structure)
2. [Step 1: Copy Project Files](#step-1-copy-project-files)
3. [Step 2: Set Up MongoDB Atlas](#step-2-set-up-mongodb-atlas)
4. [Step 3: Create Configuration Files](#step-3-create-configuration-files)
5. [Step 4: Install Dependencies](#step-4-install-dependencies)
6. [Step 5: Run the Project](#step-5-run-the-project)

---

## 📁 Project Structure

Here's what your project folder should look like:

```
blog-project/
├── backend/                    # Backend folder
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── package.json
│   ├── server.js
│   └── .env                    # CREATE THIS (not in repo)
│
├── src/                        # Frontend source code
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── BlogContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Contact.jsx
│   │   ├── Contact.css
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Auth.css
│   │   ├── CreateBlog.jsx
│   │   ├── EditBlog.jsx
│   │   ├── BlogForm.css
│   │   ├── MyBlogs.jsx
│   │   ├── MyBlogs.css
│   │   ├── ViewBlog.jsx
│   │   ├── ViewBlog.css
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   ├── utils/
│   │   ├── api.js
│   │   ├── tokenUtils.js
│   │   ├── auth.js            # (can delete, not used anymore)
│   │   ├── blogUtils.js       # (can delete, not used anymore)
│   │   └── storage.js         # (can delete, not used anymore)
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── .env                        # CREATE THIS (optional, for frontend)
├── README.md
├── MONGODB_SETUP.md
└── SETUP_GUIDE.md             # This file
```

---

## Step 1: Copy Project Files

### Option A: If you have the project files

1. **Copy the entire project folder** to your desired location
2. **Open Visual Studio Code**
3. **File → Open Folder** → Select your project folder

### Option B: If you need to recreate from scratch

Copy these folders and files:

**Must Copy:**
- ✅ `backend/` folder (entire folder with all subfolders)
- ✅ `src/` folder (entire folder with all subfolders)
- ✅ `package.json` (root)
- ✅ `package.json` (backend folder)
- ✅ `vite.config.js`
- ✅ `index.html`
- ✅ `.gitignore`

**Optional (Documentation):**
- `README.md`
- `MONGODB_SETUP.md`
- `SETUP_GUIDE.md`

---

## Step 2: Set Up MongoDB Atlas

Follow these steps to create a NEW MongoDB Atlas database:

### 2.1 Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

### 2.2 Create a Cluster

1. Click **"Build a Database"**
2. Choose **FREE (M0) Shared** cluster
3. Select your preferred cloud provider and region
4. Click **"Create"**
5. Wait 1-3 minutes for cluster creation

### 2.3 Create Database User

1. Go to **Security → Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: (choose any username, e.g., `blogadmin`)
   - **Password**: (create a strong password - **SAVE THIS!**)
5. Set privileges:
   - **Select role**: `Atlas admin` (or `readWriteAnyDatabase`)
   - **Database**: Leave blank
   - **Collection**: Leave blank
6. Click **"Add User"**

### 2.4 Whitelist IP Address

1. Go to **Security → Network Access**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - ⚠️ **Warning**: Only for development. Use specific IPs in production.
4. Click **"Confirm"**

### 2.5 Get Connection String

1. Click **"Connect"** button on your cluster
2. Select **"Connect your application"**
3. Choose **"Node.js"** driver (version doesn't matter much)
4. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Save this connection string** - you'll need it in the next step!

---

## Step 3: Create Configuration Files

You need to create `.env` files that are NOT in the repository (for security).

### 3.1 Create Backend .env File

1. In VS Code, navigate to the `backend` folder
2. Create a new file named `.env` (exactly `.env` - no extension)
3. Add the following content:

```env
# MongoDB Atlas Connection String
# Replace <username> and <password> with your database user credentials
# Replace cluster0.xxxxx with your actual cluster name
# Add /blog-db before the ? to specify database name
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blog-db?retryWrites=true&w=majority

# JWT Secret Key (Generate a random string - keep this secret!)
# You can generate one online or use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiration Time (how long login tokens last)
JWT_EXPIRE=7d

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important**: Replace:
- `<username>` with your MongoDB database username
- `<password>` with your MongoDB database password
- `cluster0.xxxxx` with your actual cluster name
- `blog-db` is the database name (you can change this)

**Example** (yours will be different):
```env
MONGODB_URI=mongodb+srv://blogadmin:mypassword123@cluster0.abc123.mongodb.net/blog-db?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-123456789
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 3.2 Create Frontend .env File (Optional)

1. In VS Code, navigate to the **root** folder (same level as `package.json`)
2. Create a new file named `.env`
3. Add the following content:

```env
# Frontend API URL (where your backend server runs)
# Default is http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
```

**Note**: This is optional. If you don't create this file, it will default to `http://localhost:5000/api`.

---

## Step 4: Install Dependencies

You need to install dependencies for both frontend and backend.

### 4.1 Install Backend Dependencies

1. **Open Terminal in VS Code**: `Terminal → New Terminal` (or `` Ctrl+` ``)
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Wait for installation to complete (you should see "added X packages")

### 4.2 Install Frontend Dependencies

1. **Open a NEW Terminal** in VS Code: `Terminal → New Terminal` (or click the `+` icon)
2. Navigate to root folder (if not already there):
   ```bash
   cd ..
   ```
   Or if you're in backend:
   ```bash
   cd ..
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Wait for installation to complete

---

## Step 5: Run the Project

You need to run both backend and frontend servers.

### 5.1 Create Admin User (First Time Only)

1. In the terminal, make sure you're in the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the admin creation script:
   ```bash
   node scripts/createAdmin.js
   ```
3. You should see:
   ```
   Connected to MongoDB
   ✅ Admin user created successfully!
   Username: admin
   Password: admin123
   Email: admin@blog.com
   ```

**Note**: If you see "Admin user already exists!", that's fine - it means it was already created.

### 5.2 Start Backend Server

1. In terminal, make sure you're in the `backend` folder:
   ```bash
   cd backend
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. You should see:
   ```
   ✅ Connected to MongoDB Atlas
   🚀 Server is running on port 5000
   ```
4. **Keep this terminal running** - don't close it!

### 5.3 Start Frontend Server

1. **Open a NEW Terminal** in VS Code
2. Make sure you're in the **root** folder (not backend):
   ```bash
   cd ..
   ```
   Or if you closed VS Code, navigate to your project root folder.
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   VITE vX.X.X  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```
5. **Keep this terminal running too!**

### 5.4 Access the Application

1. Open your web browser
2. Go to: `http://localhost:5173`
3. You should see the blog homepage!

---

## 🎉 You're Done!

### Test the Application

1. **Register a new user**:
   - Click "Register"
   - Fill in username, email, password
   - Click "Register"

2. **Or Login as Admin**:
   - Click "Login"
   - Username: `admin`
   - Password: `admin123`

3. **Create a blog**:
   - After logging in, click "Create Blog"
   - Fill in title, description, category
   - Click "Create Blog"

4. **Explore features**:
   - View all blogs on Home page
   - Search blogs
   - Filter by category
   - Edit/Delete your own blogs
   - (If admin) Access Admin Dashboard

---

## 🔧 Troubleshooting

### Backend won't start

**Error: "Cannot find module 'mongoose'"**
- Solution: Run `npm install` in the `backend` folder

**Error: "authentication failed"**
- Solution: Check your `.env` file - make sure MongoDB username and password are correct

**Error: "Port 5000 already in use"**
- Solution: Change `PORT=5001` in `backend/.env` file

### Frontend won't start

**Error: "Cannot find module 'react'"**
- Solution: Run `npm install` in the root folder

**Error: "Failed to fetch" or CORS error**
- Solution: Make sure backend server is running on port 5000

### Can't connect to MongoDB

**Error: "Connection timeout"**
- Solution: Check your IP is whitelisted in MongoDB Atlas (Network Access)

**Error: "bad auth"**
- Solution: Double-check username and password in `.env` file

---

## 📝 Important Notes

1. **Never commit `.env` files to Git** - they contain secrets!
2. **Always run both servers** - backend and frontend need to run simultaneously
3. **Backend runs on port 5000** - make sure nothing else is using this port
4. **Frontend runs on port 5173** - this is Vite's default port
5. **MongoDB connection string** - keep it secure and never share it publicly

---

## 🗂️ Files You Need to Create

Summary of files you must create manually:

1. ✅ `backend/.env` - MongoDB connection and JWT secret
2. ✅ `.env` (root) - Frontend API URL (optional)

All other files should already be in the project!

---

## ✅ Checklist

Use this checklist to ensure everything is set up:

- [ ] Project files copied to VS Code
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] Connection string obtained
- [ ] `backend/.env` file created with connection string
- [ ] `.env` file created in root (optional)
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in root folder)
- [ ] Admin user created (`node scripts/createAdmin.js`)
- [ ] Backend server running (`npm run dev` in backend folder)
- [ ] Frontend server running (`npm run dev` in root folder)
- [ ] Application accessible at `http://localhost:5173`

---

**Congratulations!** 🎉 Your blog application is now set up and running!

If you encounter any issues, refer to the troubleshooting section above or check the error messages in your terminal.









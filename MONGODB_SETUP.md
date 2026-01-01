# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas Cloud Database for your blog application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (if you don't have one)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE (M0) Shared** cluster
3. Select a Cloud Provider and Region (choose one closest to you)
4. Click **"Create"**
5. Wait for the cluster to be created (takes 1-3 minutes)

## Step 3: Create Database User (Skip if you already have one)

**Important**: This is for connecting your backend to MongoDB Atlas. If you already have a database user with admin privileges, you can skip this step and use that user's credentials.

1. In the **Security** section, click **"Database Access"**
2. Check if you already have a user - if yes, you can use that one!
3. If you need to create a new user, click **"Add New Database User"**
4. Choose **"Password"** authentication method
5. Enter:
   - Username: `blogadmin` (or your preferred username)
   - Password: Create a strong password (save this!)
6. Set user privileges:
   - **Select role**: `Atlas admin` (or `readWriteAnyDatabase`)
   - **Database**: Leave blank (not needed with Atlas admin)
   - **Collection**: Leave blank
7. Click **"Add User"**

**Note**: The database user credentials (username/password) will be used in your MongoDB connection string. This is DIFFERENT from the application admin user (username: admin, password: admin123) that you'll create later using the script in Step 7.

## Step 4: Whitelist Your IP Address

**If you already have an IP address configured**, you have two options:

### Option A: Edit Existing IP (Recommended for Development)
1. In the **Security** section, click **"Network Access"**
2. Find your existing IP address entry and click **"Edit"**
3. Change it to **"Allow Access from Anywhere"** (uses `0.0.0.0/0`)
   - ⚠️ **Warning**: This is insecure for production. Use specific IPs in production.
4. Click **"Confirm"**

### Option B: Add New IP Address (If you want to keep the old one)
1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (uses `0.0.0.0/0`)
4. Click **"Confirm"**

### Option C: Keep Existing IP (If it's already your current IP)
- If your existing IP address already matches your current computer's IP, you can keep it as is
- However, if your IP changes (common with home internet), you'll need to update it
- For development ease, Option A (Allow from Anywhere) is recommended

## Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Select **"Connect your application"**
3. Choose **"Node.js"** as the driver
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Backend Environment Variables

1. In the `backend` folder, create a `.env` file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` file and replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://blogadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blog-db?retryWrites=true&w=majority
   ```
   
   **Important**: Replace:
   - `blogadmin` with your database username
   - `YOUR_PASSWORD` with your database password (URL encode special characters)
   - `cluster0.xxxxx` with your actual cluster name
   - `blog-db` is the database name (you can change this)

3. Set JWT Secret (generate a random string):
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. Set other variables:
   ```env
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

## Step 7: Create Admin User

After starting the backend server, run:

```bash
cd backend
node scripts/createAdmin.js
```

This will create a default admin user:
- Username: `admin`
- Password: `admin123`
- Email: `admin@blog.com`

## Step 8: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server is running on port 5000
```

## Troubleshooting

### Connection Issues

1. **IP Address not whitelisted**: Make sure your IP is whitelisted in Network Access
2. **Wrong credentials**: Double-check username and password in connection string
3. **Special characters in password**: URL encode special characters (e.g., `@` becomes `%40`)
4. **Wrong connection string format**: Ensure you copied the correct connection string

### Password URL Encoding

If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

### Testing Connection

You can test the connection by starting the backend server. If it connects successfully, you'll see:
```
✅ Connected to MongoDB Atlas
```

## Security Notes

- ⚠️ **Never commit `.env` files to Git** (they're in `.gitignore`)
- 🔒 Change default admin password in production
- 🌐 Use specific IP addresses in production (not `0.0.0.0/0`)
- 🔑 Use strong, random JWT secrets in production
- 🛡️ Enable additional security features in MongoDB Atlas for production

## Next Steps

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Open http://localhost:5173
4. Login with admin credentials or create a new user account

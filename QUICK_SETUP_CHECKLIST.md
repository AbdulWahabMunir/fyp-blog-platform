# Quick Setup Checklist

Use this checklist when setting up the project in VS Code with a new MongoDB database.

## ✅ Pre-Setup

- [ ] Copy all project files to your VS Code workspace
- [ ] Open the project folder in VS Code

## ✅ MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create a free cluster
- [ ] Create database user (save username and password!)
- [ ] Whitelist IP address (`0.0.0.0/0` for development)
- [ ] Get connection string

## ✅ Configuration Files

- [ ] Create `backend/.env` file with:
  - [ ] MongoDB connection string (with your credentials)
  - [ ] JWT_SECRET (random string)
  - [ ] JWT_EXPIRE=7d
  - [ ] PORT=5000
  - [ ] NODE_ENV=development

- [ ] (Optional) Create `.env` file in root with:
  - [ ] VITE_API_URL=http://localhost:5000/api

## ✅ Install Dependencies

- [ ] Run `npm install` in `backend` folder
- [ ] Run `npm install` in root folder

## ✅ Create Admin User

- [ ] Run `node scripts/createAdmin.js` in backend folder
- [ ] Verify admin user created successfully

## ✅ Start Servers

- [ ] Start backend: `npm run dev` in `backend` folder
- [ ] Verify: "✅ Connected to MongoDB Atlas"
- [ ] Start frontend: `npm run dev` in root folder
- [ ] Verify: Frontend running on http://localhost:5173

## ✅ Test Application

- [ ] Open browser to http://localhost:5173
- [ ] Register a new user OR login as admin (admin/admin123)
- [ ] Create a blog post
- [ ] Verify blog appears on home page

---

## 🔑 Important Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**MongoDB Connection:**
- Check your `backend/.env` file for connection string
- Database user credentials are in MongoDB Atlas → Database Access

---

## 📁 File Structure Reminder

```
project-root/
├── backend/
│   ├── .env          ← CREATE THIS
│   ├── package.json
│   └── ...
├── src/              ← Frontend code
├── .env              ← CREATE THIS (optional)
├── package.json
└── ...
```

---

## 🚨 Common Issues

**Backend won't connect to MongoDB:**
- Check `.env` file has correct connection string
- Verify IP is whitelisted in MongoDB Atlas
- Check username/password are correct

**Port already in use:**
- Change PORT in `backend/.env` to 5001 or another port

**Frontend can't connect to backend:**
- Make sure backend server is running
- Check `VITE_API_URL` in root `.env` matches backend port









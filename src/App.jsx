/**
 * Main App Component
 * 
 * This is the root component that sets up:
 * - Context providers (Auth and Blog)
 * - Routing structure
 * - Layout components (Header, Footer)
 */

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BlogProvider } from './context/BlogContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

// Page components
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateBlog from './pages/CreateBlog'
import MyBlogs from './pages/MyBlogs'
import EditBlog from './pages/EditBlog'
import AdminDashboard from './pages/AdminDashboard'
import ViewBlog from './pages/ViewBlog'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/blog/:id" element={<ViewBlog />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route
                path="/create-blog"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-blogs"
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-blog/:id"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Only Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BlogProvider>
    </AuthProvider>
  )
}

export default App
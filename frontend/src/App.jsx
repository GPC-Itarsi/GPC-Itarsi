import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Context
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CalendarProvider } from './context/CalendarContext'
// Grade feature has been removed

// Public Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import Faculty from './pages/Faculty'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Login from './pages/Login'
import Downloads from './pages/Downloads'
import Admission from './pages/Admission'

// Private Pages
import AdminDashboard from './pages/admin/Dashboard'
import TeacherDashboard from './pages/teacher/Dashboard'
import StudentDashboard from './pages/student/Dashboard'
// Developer Dashboard is now in a separate application

// Shared Pages
import NotificationsPage from './pages/shared/NotificationsPage'
import CalendarPage from './pages/shared/CalendarPage'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CalendarProvider>
          {/* Grade feature has been removed */}
            <Router future={{ v7_relativeSplatPath: true }}>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/faculty" element={<Faculty />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/admission" element={<Admission />} />
                  <Route path="/login" element={<Login />} />

                  {/* Admin route - no authentication required */}
                  <Route path="/admin/*" element={<AdminDashboard />} />

                  <Route path="/teacher/*" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/student/*" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Developer routes are now handled by a separate application */}
                  <Route path="/developer/*" element={
                    <Navigate to="http://localhost:5175" replace />
                  } />

                  {/* Shared Protected Routes */}
                  <Route path="/notifications" element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'developer']}>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/calendar" element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'developer']}>
                      <CalendarPage />
                    </ProtectedRoute>
                  } />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
              <ChatbotWidget />
              </div>
            </Router>
          {/* End of removed Grade feature */}
        </CalendarProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

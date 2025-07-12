import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AskQuestionPage from './pages/AskQuestionPage'
import QuestionDetailPage from './pages/QuestionDetailPage'
import UserProfilePage from './pages/UserProfilePage'

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-8"
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/ask" element={<AskQuestionPage />} />
                    <Route path="/question/:id" element={<QuestionDetailPage />} />
                    <Route path="/profile/:username" element={<UserProfilePage />} />
                </Routes>
            </motion.main>
        </div>
    )
}

export default App

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Bell,
    User,
    LogOut,
    Settings,
    Plus,
    Menu,
    X,
    MessageSquare
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = () => {
        logout()
        navigate('/')
        setShowProfileMenu(false)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const notifications = [
        { id: 1, message: 'John answered your question "How to use React hooks?"', time: '2 hours ago', read: false },
        { id: 2, message: 'Your answer was accepted on "JavaScript async/await"', time: '1 day ago', read: true },
        { id: 3, message: 'New comment on your answer', time: '3 days ago', read: true },
    ]

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            StackIt
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Ask Question Button */}
                                <Link
                                    to="/ask"
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Ask Question</span>
                                </Link>

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 relative"
                                    >
                                        <Bell className="w-6 h-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50' : ''
                                                                }`}
                                                        >
                                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium text-gray-700">{user?.username}</span>
                                    </button>

                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                                            >
                                                <Link
                                                    to={`/profile/${user?.username}`}
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    <Settings className="w-4 h-4 text-gray-500" />
                                                    <span>Settings</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-200 py-4"
                        >
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search questions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </form>

                            {isAuthenticated ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/ask"
                                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <Plus className="w-5 h-5 text-primary-600" />
                                        <span>Ask Question</span>
                                    </Link>
                                    <Link
                                        to={`/profile/${user?.username}`}
                                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <User className="w-5 h-5 text-gray-600" />
                                        <span>Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setShowMobileMenu(false)
                                        }}
                                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default Navbar

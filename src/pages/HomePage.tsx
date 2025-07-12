import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Clock,
    User,
    TrendingUp,
    Search,
    Filter,
    ChevronRight,
    X
} from 'lucide-react'

interface Question {
    id: number
    title: string
    content: string
    author: string
    tags: string[]
    votes: number
    answers: number
    createdAt: string
    views: number
    userVote?: 'up' | 'down' | null
}

const HomePage = () => {
    const { isAuthenticated } = useAuth()
    const [questions, setQuestions] = useState<Question[]>([])
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')
    const [filterTag, setFilterTag] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchQuestions()
    }, [sortBy, filterTag])

    useEffect(() => {
        // Filter and search questions
        let filtered = [...questions]

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(question =>
                question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                question.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply tag filter
        if (filterTag.trim()) {
            filtered = filtered.filter(question =>
                question.tags.some(tag =>
                    tag.toLowerCase().includes(filterTag.toLowerCase())
                )
            )
        }

        setFilteredQuestions(filtered)
    }, [questions, searchQuery, filterTag])

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token')
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`/api/questions?sort=${sortBy}&tag=${filterTag}`, {
                headers
            })
            if (response.ok) {
                const data = await response.json()
                console.log('API Questions data:', data) // Debug log
                setQuestions(data)
            } else {
                console.error('API request failed, using mock data')
                setQuestions(mockQuestions)
            }
        } catch (error) {
            console.error('Error fetching questions:', error)
            console.log('Using mock data due to error')
            // Mock data for development
            setQuestions(mockQuestions)
        } finally {
            setLoading(false)
        }
    }

    const mockQuestions: Question[] = [
        {
            id: 1,
            title: "How to implement authentication in React with JWT tokens?",
            content: "I'm building a React application and need to implement user authentication using JWT tokens. What's the best practice for storing tokens and managing user state?",
            author: "johndoe",
            tags: ["react", "jwt", "authentication", "security"],
            votes: 15,
            answers: 3,
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
            views: 245
        },
        {
            id: 2,
            title: "TypeScript generics with React components - best practices",
            content: "I'm trying to create reusable React components with TypeScript generics but running into some issues with type inference...",
            author: "devmaster",
            tags: ["typescript", "react", "generics"],
            votes: 28,
            answers: 5,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            views: 389
        },
        {
            id: 3,
            title: "Optimizing database queries for large datasets",
            content: "My application is dealing with millions of records and queries are becoming slow. What are some effective strategies for optimization?",
            author: "dbexpert",
            tags: ["database", "optimization", "performance"],
            votes: 42,
            answers: 8,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            views: 567
        }
    ]

    const popularTags = [
        "react", "javascript", "typescript", "node.js", "python",
        "database", "authentication", "performance", "css", "api"
    ]

    const formatTimeAgo = (dateString: string) => {
        // Handle different date formats that might come from the API
        let date: Date
        try {
            // Try parsing the date string - handle both ISO format and SQLite format
            if (dateString.includes('T')) {
                date = new Date(dateString)
            } else {
                // SQLite format like "2025-07-12 06:42:40"
                date = new Date(dateString.replace(' ', 'T') + 'Z')
            }
            
            // Fallback if date is invalid
            if (isNaN(date.getTime())) {
                date = new Date(dateString)
            }
        } catch (error) {
            console.error('Error parsing date:', dateString, error)
            return 'unknown time'
        }

        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()

        // Convert to different time units
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
        const diffInWeeks = Math.floor(diffInDays / 7)
        const diffInMonths = Math.floor(diffInDays / 30)
        const diffInYears = Math.floor(diffInDays / 365)

        // Less than 1 minute
        if (diffInMinutes < 1) return 'just now'

        // Less than 60 minutes - show minutes
        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
        }

        // Less than 24 hours - show hours
        if (diffInHours < 24) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
        }

        // Less than 7 days - show days
        if (diffInDays < 7) {
            return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
        }

        // Less than 4 weeks - show weeks
        if (diffInWeeks < 4) {
            return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
        }

        // Less than 12 months - show months
        if (diffInMonths < 12) {
            return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
        }

        // More than a year - show years
        return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
    }

    const highlightSearchText = (text: string, searchQuery: string) => {
        if (!searchQuery.trim()) return text

        const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
                    {part}
                </mark>
            ) : part
        )
    }

    const handleVote = async (questionId: number, voteType: 'up' | 'down') => {
        if (!isAuthenticated) {
            alert('Please log in to vote')
            return
        }

        // Check if user has already voted
        const question = filteredQuestions.find(q => q.id === questionId)
        if (question?.userVote) {
            alert('You have already voted on this question. Each user can only vote once per question.')
            return
        }

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/questions/${questionId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vote_type: voteType })
            })

            if (response.ok) {
                const data = await response.json()
                // Update the question in both questions and filteredQuestions
                const updateQuestion = (q: Question) =>
                    q.id === questionId
                        ? { ...q, votes: data.voteCount, userVote: data.userVote }
                        : q

                setQuestions(prev => prev.map(updateQuestion))
                setFilteredQuestions(prev => prev.map(updateQuestion))
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to vote')
            }
        } catch (error) {
            console.error('Error voting:', error)
            alert('Failed to vote')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 mb-12"
            >
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        StackIt
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    A modern Q&A platform where developers help each other solve problems,
                    share knowledge, and build amazing things together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/ask"
                        className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
                    >
                        Ask Your First Question
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                        to="/register"
                        className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
                    >
                        Join the Community
                    </Link>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm text-lg"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="mt-2 text-sm text-gray-600">
                                {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} found for "{searchQuery}"
                            </p>
                        )}
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-primary-600" />
                                <span className="text-sm text-gray-500">{filteredQuestions.length} questions</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            >
                                <option value="newest">Newest</option>
                                <option value="popular">Most Popular</option>
                                <option value="unanswered">Unanswered</option>
                                <option value="votes">Most Votes</option>
                            </select>

                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Filter by tag..."
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm w-40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {filteredQuestions.map((question) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2 }}
                                className="card p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex flex-col items-center space-y-1">
                                                    <button
                                                        onClick={() => handleVote(question.id, 'up')}
                                                        className={`p-1 rounded transition-colors ${question.userVote === 'up'
                                                            ? 'text-green-600 bg-green-50'
                                                            : question.userVote
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                            }`}
                                                        disabled={!isAuthenticated || question.userVote !== null}
                                                        title={
                                                            !isAuthenticated
                                                                ? 'Login to vote'
                                                                : question.userVote
                                                                    ? 'You have already voted on this question'
                                                                    : 'Upvote'
                                                        }
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-medium text-gray-900 text-lg">
                                                        {question.votes}
                                                    </span>
                                                    <button
                                                        onClick={() => handleVote(question.id, 'down')}
                                                        className={`p-1 rounded transition-colors ${question.userVote === 'down'
                                                            ? 'text-red-600 bg-red-50'
                                                            : question.userVote
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                            }`}
                                                        disabled={!isAuthenticated || question.userVote !== null}
                                                        title={
                                                            !isAuthenticated
                                                                ? 'Login to vote'
                                                                : question.userVote
                                                                    ? 'You have already voted on this question'
                                                                    : 'Downvote'
                                                        }
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="font-medium text-gray-900">{question.answers}</span>
                                                    <span>answers</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="font-medium text-gray-900">{question.views}</span>
                                                    <span>views</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/question/${question.id}`}
                                            className="block group"
                                        >
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                                                {highlightSearchText(question.title, searchQuery)}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2 mb-4">
                                                {highlightSearchText(question.content, searchQuery)}
                                            </p>
                                        </Link>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {question.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="badge badge-primary cursor-pointer hover:bg-primary-200 transition-colors"
                                                        onClick={() => setFilterTag(tag)}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium text-gray-700">{question.author}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatTimeAgo(question.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {searchQuery || filterTag ? 'No questions found' : 'No questions yet'}
                            </h3>
                            <p className="text-gray-500">
                                {searchQuery || filterTag
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Be the first to ask a question!'
                                }
                            </p>
                            {!searchQuery && !filterTag && (
                                <Link
                                    to="/ask"
                                    className="btn-primary mt-4 inline-flex items-center"
                                >
                                    Ask Question
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Popular Tags */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setFilterTag(tag)}
                                        className="badge badge-primary hover:bg-primary-200 transition-colors cursor-pointer"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Questions</span>
                                    <span className="font-semibold text-gray-900">1,234</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Answers</span>
                                    <span className="font-semibold text-gray-900">3,567</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Users</span>
                                    <span className="font-semibold text-gray-900">892</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Active Today</span>
                                    <span className="font-semibold text-primary-600">124</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/ask"
                                    className="w-full btn-primary text-center"
                                >
                                    Ask Question
                                </Link>
                                <Link
                                    to="/unanswered"
                                    className="w-full btn-secondary text-center"
                                >
                                    Answer Questions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage

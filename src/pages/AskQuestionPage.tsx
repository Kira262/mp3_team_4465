import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Tag, Type, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const AskQuestionPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [] as string[]
    })
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to ask a question')
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const tag = tagInput.trim().toLowerCase()
            if (tag && !formData.tags.includes(tag) && formData.tags.length < 1) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag]
                }))
                setTagInput('')
            }
        }
    }

    const addTagButton = () => {
        const tag = tagInput.trim().toLowerCase()
        if (tag && !formData.tags.includes(tag) && formData.tags.length < 1) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }))
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.content) {
            toast.error('Please fill in all required fields')
            return
        }

        if (formData.tags.length === 0) {
            toast.error('Please add at least one tag')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const question = await response.json()
                toast.success('Question posted successfully!')
                navigate(`/question/${question.id}`)
            } else {
                toast.error('Failed to post question')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
                <p className="text-gray-600">Get help from the community by asking a clear, detailed question.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <Type className="w-4 h-4" />
                                <span>Question Title</span>
                                <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Be specific and imagine you're asking a question to another person"
                            maxLength={200}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.title.length}/200 characters
                        </p>
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Question Details</span>
                                <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            value={formData.content}
                            onChange={handleChange}
                            rows={12}
                            className="input-field w-full resize-y"
                            placeholder="Provide all the details about your question. Include any code, error messages, or context that might help others understand your problem."
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            <p>• Describe what you've tried and what didn't work</p>
                            <p>• Include relevant code snippets or error messages</p>
                            <p>• Be specific about your expected outcome</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <Tag className="w-4 h-4" />
                                <span>Tag</span>
                                <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    id="tags"
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="input-field flex-1"
                                    placeholder="Add a tag (e.g., react, javascript, typescript)"
                                    maxLength={20}
                                    disabled={formData.tags.length >= 1}
                                />
                                <button
                                    type="button"
                                    onClick={addTagButton}
                                    disabled={!tagInput.trim() || formData.tags.length >= 1}
                                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="badge badge-primary flex items-center space-x-1"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-red-600 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-sm text-gray-500">
                                Add 1 tag to help categorize your question ({formData.tags.length}/1)
                            </p>

                            {/* Popular Tags Suggestions */}
                            {formData.tags.length === 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Popular tags:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['react', 'javascript', 'typescript', 'node.js', 'python', 'css', 'html', 'api'].map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        tags: [tag]
                                                    }))
                                                }}
                                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors border border-gray-200 hover:border-primary-300"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for getting good answers:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Search to see if your question has already been asked</li>
                            <li>• Write a title that summarizes the specific problem</li>
                            <li>• Describe the problem thoroughly</li>
                            <li>• Show what you've tried and tell us what you found</li>
                            <li>• Use proper grammar and spelling</li>
                        </ul>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center justify-center space-x-2 py-3 px-6"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Posting Question...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Post Your Question</span>
                                </>
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn-secondary py-3 px-6"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AskQuestionPage

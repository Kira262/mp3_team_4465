import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, ExternalLink } from 'lucide-react'

interface MockEmailProps {
    isOpen: boolean
    onClose: () => void
    email: string
    username: string
    verificationLink: string
}

const MockEmail = ({ isOpen, onClose, email, username, verificationLink }: MockEmailProps) => {
    const handleVerifyClick = () => {
        window.open(verificationLink, '_blank')
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                        {/* Email Header */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-900">StackIt Verification Email</p>
                                    <p className="text-sm text-gray-500">noreply@stackit.com → {email}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Email Content */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome to StackIt!
                                </h1>
                                <p className="text-gray-600">
                                    Please verify your email address to complete your registration
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-gray-700 mb-4">
                                    Hi <strong>{username}</strong>,
                                </p>
                                <p className="text-gray-700 mb-4">
                                    Thank you for joining StackIt! To complete your registration and start asking questions, 
                                    please verify your email address by clicking the button below.
                                </p>
                                <p className="text-gray-700">
                                    This verification link will expire in 24 hours.
                                </p>
                            </div>

                            <div className="text-center mb-6">
                                <button
                                    onClick={handleVerifyClick}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Verify Email Address
                                    <ExternalLink className="ml-2 w-4 h-4" />
                                </button>
                            </div>

                            <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                                <p>If you didn't create an account with StackIt, you can safely ignore this email.</p>
                                <p className="mt-2">
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>
                                <p className="mt-1 font-mono text-xs break-all bg-gray-100 p-2 rounded">
                                    {verificationLink}
                                </p>
                            </div>
                        </div>

                        {/* Email Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-xs text-gray-500">
                            <p>© 2024 StackIt. All rights reserved.</p>
                            <p>This is a demo email for development purposes.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default MockEmail

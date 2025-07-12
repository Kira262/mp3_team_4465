import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
    Mail, 
    CheckCircle, 
    XCircle, 
    RefreshCw, 
    Clock,
    ArrowRight,
    Eye
} from 'lucide-react'
import MockEmail from '../components/MockEmail'
import toast from 'react-hot-toast'

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error' | 'expired'>('pending')
    const [resendLoading, setResendLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [showMockEmail, setShowMockEmail] = useState(false)

    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam)
        }
        
        if (token) {
            verifyEmail(token)
        }
    }, [token, emailParam])

    const verifyEmail = async (verificationToken: string) => {
        setStatus('verifying')

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: verificationToken })
            })

            const data = await response.json()

            if (response.ok) {
                setStatus('success')
                setMessage(data.message)
                
                // Auto-login the user
                if (data.token && data.user) {
                    localStorage.setItem('token', data.token)
                    toast.success('Email verified! Welcome to StackIt!')
                    
                    // Redirect to home page after 2 seconds
                    setTimeout(() => {
                        navigate('/')
                        window.location.reload() // Refresh to update auth state
                    }, 2000)
                }
            } else {
                if (data.error.includes('expired')) {
                    setStatus('expired')
                } else {
                    setStatus('error')
                }
                setMessage(data.error)
            }
        } catch (error) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    const resendVerification = async () => {
        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        setResendLoading(true)
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(data.message)
                setStatus('pending')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error('Failed to resend verification email')
        } finally {
            setResendLoading(false)
        }
    }

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500" />
            case 'error':
            case 'expired':
                return <XCircle className="w-16 h-16 text-red-500" />
            case 'verifying':
                return <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
            default:
                return <Mail className="w-16 h-16 text-blue-500" />
        }
    }

    const getStatusTitle = () => {
        switch (status) {
            case 'success':
                return 'Email Verified Successfully!'
            case 'error':
                return 'Verification Failed'
            case 'expired':
                return 'Verification Link Expired'
            case 'verifying':
                return 'Verifying Your Email...'
            default:
                return 'Check Your Email'
        }
    }

    const getStatusMessage = () => {
        if (message) return message
        
        switch (status) {
            case 'success':
                return 'Your email has been verified. You\'re being redirected to your dashboard...'
            case 'verifying':
                return 'Please wait while we verify your email address...'
            default:
                return 'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.'
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Status Icon */}
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mb-6"
                    >
                        {getStatusIcon()}
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {getStatusTitle()}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                        {getStatusMessage()}
                    </p>
                </div>

                {/* Success State */}
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-800">
                                🎉 Welcome to StackIt! You can now ask questions, provide answers, and engage with our community.
                            </p>
                        </div>
                        
                        <Link
                            to="/"
                            className="btn-primary inline-flex items-center"
                        >
                            Go to Dashboard
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>
                )}

                {/* Pending/Resend State */}
                {(status === 'pending' || status === 'expired') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Email Input for Resend */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10 block w-full"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>

                        {/* Resend Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={resendVerification}
                            disabled={resendLoading || !email}
                            className="w-full btn-primary"
                        >
                            {resendLoading ? (
                                <div className="flex items-center justify-center">
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {status === 'expired' ? 'Send New Verification Email' : 'Resend Verification Email'}
                                </div>
                            )}
                        </motion.button>

                        {/* Help Text with Mock Email */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-sm text-blue-800 flex-1">
                                    <p className="font-medium mb-1">Didn't receive the email?</p>
                                    <ul className="list-disc list-inside space-y-1 mb-3">
                                        <li>Check your spam/junk folder</li>
                                        <li>Make sure you entered the correct email</li>
                                        <li>Wait a few minutes and try again</li>
                                    </ul>
                                    
                                    <button
                                        onClick={() => setShowMockEmail(true)}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Demo Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{message}</p>
                        </div>
                        
                        <Link
                            to="/register"
                            className="btn-secondary inline-flex items-center"
                        >
                            Back to Registration
                        </Link>
                    </motion.div>
                )}

                {/* Back to Login */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                        Already verified?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Mock Email Modal */}
            <MockEmail
                isOpen={showMockEmail}
                onClose={() => setShowMockEmail(false)}
                email={email}
                username={email.split('@')[0]} // Simple username from email
                verificationLink={`${window.location.origin}/verify-email?token=demo_token_123`}
            />
        </div>
    )
}

export default EmailVerificationPage

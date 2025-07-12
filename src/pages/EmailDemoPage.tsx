import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Mail, 
    Send, 
    Eye, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    RefreshCw,
    ExternalLink,
    User,
    Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MockEmail {
    id: string
    to: string
    username: string
    subject: string
    verificationToken: string
    verificationLink: string
    timestamp: string
    status: string
    content: {
        html: string
        text: string
    }
}

interface VerificationStatus {
    email: string
    isVerified: boolean
    hasToken: boolean
    tokenExpired: boolean
    expiresAt: string | null
    accountCreated: string
    mockEmails: MockEmail[]
}

const EmailDemoPage = () => {
    const [demoEmail, setDemoEmail] = useState('demo.user@example.com')
    const [demoUsername, setDemoUsername] = useState('demo_user')
    const [loading, setLoading] = useState(false)
    const [sentEmails, setSentEmails] = useState<MockEmail[]>([])
    const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(null)
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)

    const sendDemoEmail = async () => {
        if (!demoEmail || !demoUsername) {
            toast.error('Please fill in both email and username')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/auth/demo-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: demoEmail, 
                    username: demoUsername 
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Demo email sent successfully!')
                await fetchEmailHistory()
            } else {
                toast.error(data.error || 'Failed to send demo email')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const fetchEmailHistory = async () => {
        try {
            const response = await fetch(`/api/auth/verification-emails/${encodeURIComponent(demoEmail)}`)
            if (response.ok) {
                const data = await response.json()
                setSentEmails(data.emails)
            }
        } catch (error) {
            console.error('Failed to fetch email history:', error)
        }
    }

    const fetchVerificationStatus = async () => {
        try {
            const response = await fetch(`/api/auth/verification-status/${encodeURIComponent(demoEmail)}`)
            if (response.ok) {
                const data = await response.json()
                setVerificationStatus(data)
                setSentEmails(data.mockEmails)
            }
        } catch (error) {
            console.error('Failed to fetch verification status:', error)
        }
    }

    const viewEmailContent = async (emailId: string) => {
        try {
            const response = await fetch(`/api/auth/mock-email/${emailId}`)
            if (response.ok) {
                const email = await response.json()
                setSelectedEmail(email)
            }
        } catch (error) {
            toast.error('Failed to load email content')
        }
    }

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString()
    }

    useEffect(() => {
        fetchEmailHistory()
        fetchVerificationStatus()
    }, [demoEmail])

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 Email Verification Demo</h1>
                <p className="text-gray-600">
                    Experience our enhanced fake email verification system with rich templates and logging.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Send Demo Email */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Send className="w-5 h-5 mr-2 text-primary-600" />
                        Send Demo Email
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={demoEmail}
                                    onChange={(e) => setDemoEmail(e.target.value)}
                                    className="input-field pl-10 block w-full"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={demoUsername}
                                    onChange={(e) => setDemoUsername(e.target.value)}
                                    className="input-field pl-10 block w-full"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <button
                            onClick={sendDemoEmail}
                            disabled={loading}
                            className="w-full btn-primary"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Sending Email...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Verification Email
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Verification Status */}
                    {verificationStatus && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3">Account Status</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Email Verified:</span>
                                    <span className={`flex items-center ${verificationStatus.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {verificationStatus.isVerified ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Yes
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                No
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Has Token:</span>
                                    <span className={verificationStatus.hasToken ? 'text-green-600' : 'text-gray-500'}>
                                        {verificationStatus.hasToken ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                {verificationStatus.expiresAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Token Expires:</span>
                                        <span className={`text-xs ${verificationStatus.tokenExpired ? 'text-red-600' : 'text-gray-600'}`}>
                                            {formatTimestamp(verificationStatus.expiresAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Email History */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary-600" />
                        Email History ({sentEmails.length})
                    </h2>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sentEmails.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No emails sent yet</p>
                                <p className="text-sm">Send a demo email to see it here</p>
                            </div>
                        ) : (
                            sentEmails.map((email) => (
                                <div
                                    key={email.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                                    onClick={() => viewEmailContent(email.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm">
                                                {email.subject}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                To: {email.to}
                                            </p>
                                            <div className="flex items-center mt-2 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatTimestamp(email.timestamp)}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                email.status === 'sent' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {email.status}
                                            </span>
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Email Preview Modal */}
            {selectedEmail && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedEmail(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Email Preview
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedEmail.subject}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <a
                                    href={selectedEmail.verificationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary text-sm"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Test Link
                                </a>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Email Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                <strong>To:</strong> {selectedEmail.to}<br />
                                <strong>From:</strong> StackIt &lt;noreply@stackit.com&gt;<br />
                                <strong>Subject:</strong> {selectedEmail.subject}<br />
                                <strong>Sent:</strong> {formatTimestamp(selectedEmail.timestamp)}
                            </div>
                            
                            <div 
                                className="email-content"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.content.html }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Features Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 card p-6"
            >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Enhanced Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">📧 Rich Email Templates</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Beautiful HTML email templates</li>
                            <li>• Branded design with gradients</li>
                            <li>• Mobile-responsive layout</li>
                            <li>• Fallback plain text version</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">🔍 Advanced Logging</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Detailed console logging</li>
                            <li>• Email tracking and history</li>
                            <li>• Verification status monitoring</li>
                            <li>• Token expiration tracking</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default EmailDemoPage

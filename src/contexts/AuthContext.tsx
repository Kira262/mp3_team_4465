import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: number
    username: string
    email: string
    role: 'user' | 'admin' | 'guest'
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string }>
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string }>
    logout: () => void
    isAuthenticated: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('token')
        if (token) {
            // Verify token with backend
            fetchUser(token)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async (token: string) => {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                localStorage.removeItem('token')
            }
        } catch (error) {
            console.error('Error fetching user:', error)
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<{ success: boolean; requiresVerification?: boolean; email?: string }> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                setUser(data.user)
                return { success: true }
            } else if (response.status === 403 && data.requiresVerification) {
                // User exists but email is not verified
                return { 
                    success: false, 
                    requiresVerification: true, 
                    email: data.email 
                }
            }
            return { success: false }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false }
        }
    }

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; requiresVerification?: boolean; email?: string }> => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json()

            if (response.ok) {
                // New registration flow - user needs to verify email
                if (data.requiresVerification) {
                    return { 
                        success: true, 
                        requiresVerification: true, 
                        email: data.email 
                    }
                }
                
                // Old flow - immediate login (shouldn't happen anymore)
                if (data.token && data.user) {
                    localStorage.setItem('token', data.token)
                    setUser(data.user)
                }
                
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            console.error('Register error:', error)
            return { success: false }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: number
    username: string
    email: string
    role: 'user' | 'admin'
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    register: (username: string, email: string, password: string) => Promise<boolean>
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

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (response.ok) {
                const { token, user: userData } = await response.json()
                localStorage.setItem('token', token)
                setUser(userData)
                return true
            }
            return false
        } catch (error) {
            console.error('Login error:', error)
            return false
        }
    }

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })

            if (response.ok) {
                const { token, user: userData } = await response.json()
                localStorage.setItem('token', token)
                setUser(userData)
                return true
            }
            return false
        } catch (error) {
            console.error('Register error:', error)
            return false
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

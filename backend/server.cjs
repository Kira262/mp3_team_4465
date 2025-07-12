const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Helper function to generate verification token
const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Enhanced Mock Email Service with better logging and templates
const mockEmailDatabase = new Map() // In-memory storage for demo emails

const sendVerificationEmail = async (email, token, username) => {
    // Simulate realistic email sending delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    const emailId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    const timestamp = new Date().toISOString()
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`
    
    // Create detailed email record
    const emailRecord = {
        id: emailId,
        to: email,
        username: username,
        subject: 'Welcome to StackIt - Verify Your Email',
        verificationToken: token,
        verificationLink: verificationLink,
        timestamp: timestamp,
        status: 'sent',
        content: generateEmailContent(username, verificationLink)
    }
    
    // Store in mock database
    mockEmailDatabase.set(emailId, emailRecord)
    
    // Enhanced console logging
    console.log('\n🎯 ======================== MOCK EMAIL SENT ========================')
    console.log(`📧 Email ID: ${emailId}`)
    console.log(`👤 To: ${email} (${username})`)
    console.log(`📅 Sent: ${new Date(timestamp).toLocaleString()}`)
    console.log(`🔗 Verification Link: ${verificationLink}`)
    console.log(`⏰ Token Expires: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}`)
    console.log('� Email Preview:')
    console.log('   Subject: Welcome to StackIt - Verify Your Email')
    console.log(`   Hi ${username}! 👋`)
    console.log('   Thanks for joining StackIt! Click the link above to verify your email.')
    console.log('   This link expires in 24 hours.')
    console.log('🎯 ================================================================\n')
    
    return { 
        success: true, 
        messageId: emailId,
        verificationLink: verificationLink,
        timestamp: timestamp
    }
}

// Generate rich email content for mock emails
const generateEmailContent = (username, verificationLink) => {
    return {
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <div style="background: white; border-radius: 12px; display: inline-block; padding: 16px; margin-bottom: 20px;">
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                            <span style="color: white; font-size: 24px;">💬</span>
                        </div>
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to StackIt!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your developer community awaits</p>
                </div>
                
                <div style="background: white; padding: 40px 20px;">
                    <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${username}! 👋</h2>
                    
                    <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for joining StackIt, the modern Q&A platform for developers! 
                        We're excited to have you as part of our growing community.
                    </p>
                    
                    <p style="color: #374151; line-height: 1.6; margin-bottom: 30px;">
                        To complete your registration and start asking questions, sharing knowledge, 
                        and connecting with fellow developers, please verify your email address:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; padding: 16px 32px; text-decoration: none; 
                                  border-radius: 8px; font-weight: 600; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <h3 style="color: #1f2937; margin-bottom: 15px;">🚀 What's Next?</h3>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Ask your first question</li>
                            <li style="margin-bottom: 8px;">Browse questions from the community</li>
                            <li style="margin-bottom: 8px;">Share your knowledge by answering</li>
                            <li>Build your developer reputation</li>
                        </ul>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        This verification link will expire in 24 hours. If you didn't create an account with StackIt, 
                        you can safely ignore this email.
                    </p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                    <p>© 2025 StackIt - Building the future of developer collaboration</p>
                </div>
            </div>
        `,
        text: `
Hi ${username}!

Welcome to StackIt! 🎉

Thank you for joining our developer community. To complete your registration, please verify your email address by visiting:

${verificationLink}

This link will expire in 24 hours.

What's next?
- Ask your first question
- Browse community questions  
- Share your knowledge
- Build your reputation

If you didn't create this account, you can safely ignore this email.

Best regards,
The StackIt Team
        `
    }
}

// Get mock email by ID (for demonstration purposes)
const getMockEmail = (emailId) => {
    return mockEmailDatabase.get(emailId)
}

// Get all mock emails for a user (for demonstration)
const getMockEmailsForUser = (email) => {
    const emails = []
    for (const [id, emailRecord] of mockEmailDatabase.entries()) {
        if (emailRecord.to === email) {
            emails.push(emailRecord)
        }
    }
    return emails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// Middleware
app.use(cors())
app.use(express.json())

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite')
const db = new sqlite3.Database(dbPath)

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      verification_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // Questions table
    db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      votes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

    // Tags table
    db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // Question_tags junction table
    db.run(`
    CREATE TABLE IF NOT EXISTS question_tags (
      question_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (question_id, tag_id),
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    )
  `)

    // Answers table
    db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      votes INTEGER DEFAULT 0,
      is_accepted BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

    // Votes table
    db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      answer_id INTEGER,
      question_id INTEGER,
      vote_type TEXT CHECK(vote_type IN ('up', 'down')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (answer_id) REFERENCES answers (id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
    )
  `)

    // Insert demo data
    const demoPassword = bcrypt.hashSync('demo123', 10)

    db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role, email_verified) 
    VALUES (?, ?, ?, ?, ?)
  `, ['demo', 'demo@stackit.com', demoPassword, 'user', true])

    db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role, email_verified) 
    VALUES (?, ?, ?, ?, ?)
  `, ['johndoe', 'john@example.com', demoPassword, 'user', true])

    // Insert demo tags
    const demoTags = ['react', 'javascript', 'typescript', 'node.js', 'python', 'database', 'authentication', 'performance', 'css', 'api']
    demoTags.forEach(tag => {
        db.run(`INSERT OR IGNORE INTO tags (name) VALUES (?)`, [tag])
    })

    // Insert demo questions
    setTimeout(() => {
        db.get("SELECT id FROM users WHERE username = 'demo'", (err, user) => {
            if (user) {
                const demoQuestions = [
                    {
                        title: "How to implement authentication in React with JWT tokens?",
                        content: "I'm building a React application and need to implement user authentication using JWT tokens. What's the best practice for storing tokens and managing user state?",
                        tags: ['react', 'jwt', 'authentication']
                    },
                    {
                        title: "TypeScript generics with React components - best practices",
                        content: "I'm trying to create reusable React components with TypeScript generics but running into some issues with type inference...",
                        tags: ['typescript', 'react']
                    },
                    {
                        title: "Optimizing database queries for large datasets",
                        content: "My application is dealing with millions of records and queries are becoming slow. What are some effective strategies for optimization?",
                        tags: ['database', 'performance']
                    }
                ]

                demoQuestions.forEach(question => {
                    db.run(`
            INSERT OR IGNORE INTO questions (title, content, user_id) 
            VALUES (?, ?, ?)
          `, [question.title, question.content, user.id], function (err) {
                        if (!err && this.lastID) {
                            // Add tags to question
                            question.tags.forEach(tagName => {
                                db.get("SELECT id FROM tags WHERE name = ?", [tagName], (err, tag) => {
                                    if (tag) {
                                        db.run(`
                      INSERT OR IGNORE INTO question_tags (question_id, tag_id) 
                      VALUES (?, ?)
                    `, [this.lastID, tag.id])
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    }, 1000)
})

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' })
        }
        req.user = user
        next()
    })
}

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = generateVerificationToken()
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        db.run(`
      INSERT INTO users (username, email, password_hash, verification_token, verification_expires) 
      VALUES (?, ?, ?, ?, ?)
    `, [username, email, hashedPassword, verificationToken, verificationExpires.toISOString()], async function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or email already exists' })
                }
                return res.status(500).json({ error: 'Failed to create user' })
            }

            try {
                // Send verification email (mock)
                await sendVerificationEmail(email, verificationToken, username)
                
                res.status(201).json({
                    message: 'Account created successfully! Please check your email to verify your account.',
                    userId: this.lastID,
                    email: email,
                    requiresVerification: true
                })
            } catch (emailError) {
                console.error('Email sending failed:', emailError)
                res.status(201).json({
                    message: 'Account created but email verification failed. Please contact support.',
                    userId: this.lastID,
                    email: email,
                    requiresVerification: true
                })
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        db.get(`
      SELECT id, username, email, password_hash, role, email_verified 
      FROM users WHERE email = ?
    `, [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' })
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash)
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            if (!user.email_verified) {
                return res.status(403).json({ 
                    error: 'Please verify your email before logging in',
                    requiresVerification: true,
                    email: user.email
                })
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user)
})

// Email verification endpoints
app.post('/api/auth/verify-email', (req, res) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({ error: 'Verification token is required' })
    }

    db.get(`
        SELECT id, username, email, verification_expires 
        FROM users 
        WHERE verification_token = ? AND email_verified = FALSE
    `, [token], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' })
        }

        // Check if token has expired
        const now = new Date()
        const expires = new Date(user.verification_expires)
        
        if (now > expires) {
            return res.status(400).json({ error: 'Verification token has expired' })
        }

        // Verify the email
        db.run(`
            UPDATE users 
            SET email_verified = TRUE, verification_token = NULL, verification_expires = NULL 
            WHERE id = ?
        `, [user.id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to verify email' })
            }

            // Generate JWT token for immediate login
            const authToken = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: 'user' },
                JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.json({
                message: 'Email verified successfully!',
                token: authToken,
                user: { id: user.id, username: user.username, email: user.email, role: 'user' }
            })
        })
    })
})

app.post('/api/auth/resend-verification', (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    db.get(`
        SELECT id, username, email, email_verified 
        FROM users 
        WHERE email = ?
    `, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (user.email_verified) {
            return res.status(400).json({ error: 'Email is already verified' })
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken()
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        db.run(`
            UPDATE users 
            SET verification_token = ?, verification_expires = ? 
            WHERE id = ?
        `, [verificationToken, verificationExpires.toISOString(), user.id], async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to generate new verification token' })
            }

            try {
                await sendVerificationEmail(user.email, verificationToken, user.username)
                res.json({ message: 'Verification email sent successfully!' })
            } catch (emailError) {
                console.error('Email sending failed:', emailError)
                res.status(500).json({ error: 'Failed to send verification email' })
            }
        })
    })
})

// Enhanced email verification endpoints

// Get mock email preview (for demonstration)
app.get('/api/auth/mock-email/:emailId', (req, res) => {
    const { emailId } = req.params
    const email = getMockEmail(emailId)
    
    if (!email) {
        return res.status(404).json({ error: 'Email not found' })
    }
    
    res.json(email)
})

// Get user's verification email history (for demonstration)
app.get('/api/auth/verification-emails/:email', (req, res) => {
    const { email } = req.params
    const emails = getMockEmailsForUser(email)
    
    res.json({
        emails: emails,
        count: emails.length
    })
})

// Email verification status endpoint
app.get('/api/auth/verification-status/:email', (req, res) => {
    const { email } = req.params
    
    db.get(`
        SELECT email_verified, verification_token, verification_expires, created_at
        FROM users 
        WHERE email = ?
    `, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        
        const now = new Date()
        const expires = user.verification_expires ? new Date(user.verification_expires) : null
        const isExpired = expires ? now > expires : false
        
        res.json({
            email: email,
            isVerified: user.email_verified,
            hasToken: !!user.verification_token,
            tokenExpired: isExpired,
            expiresAt: user.verification_expires,
            accountCreated: user.created_at,
            mockEmails: getMockEmailsForUser(email)
        })
    })
})

// Demo: Trigger fake email sending without registration
app.post('/api/auth/demo-email', async (req, res) => {
    const { email, username } = req.body
    
    if (!email || !username) {
        return res.status(400).json({ error: 'Email and username are required' })
    }
    
    try {
        const token = generateVerificationToken()
        const result = await sendVerificationEmail(email, token, username)
        
        res.json({
            message: 'Demo verification email sent!',
            emailId: result.messageId,
            verificationLink: result.verificationLink,
            previewUrl: `/api/auth/mock-email/${result.messageId}`
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send demo email' })
    }
})

// Questions routes
app.get('/api/questions', (req, res) => {
    const { sort = 'newest', tag = '', limit = 50 } = req.query

    let orderBy = 'q.created_at DESC'
    if (sort === 'popular') orderBy = 'q.votes DESC'
    if (sort === 'votes') orderBy = 'q.votes DESC'

    let query = `
    SELECT 
      q.id,
      q.title,
      q.content,
      q.votes,
      q.views,
      q.created_at,
      u.username as author,
      COUNT(a.id) as answers,
      GROUP_CONCAT(t.name) as tags
    FROM questions q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN answers a ON q.id = a.question_id
    LEFT JOIN question_tags qt ON q.id = qt.question_id
    LEFT JOIN tags t ON qt.tag_id = t.id
  `

    const params = []
    if (tag) {
        query += ` WHERE t.name LIKE ?`
        params.push(`%${tag}%`)
    }

    query += `
    GROUP BY q.id
    ORDER BY ${orderBy}
    LIMIT ?
  `
    params.push(parseInt(limit))

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        const questions = rows.map(row => ({
            ...row,
            tags: row.tags ? row.tags.split(',') : [],
            createdAt: row.created_at
        }))

        res.json(questions)
    })
})

app.post('/api/questions', authenticateToken, (req, res) => {
    const { title, content, tags } = req.body

    if (!title || !content || !tags || tags.length === 0) {
        return res.status(400).json({ error: 'Title, content, and tags are required' })
    }

    db.run(`
    INSERT INTO questions (title, content, user_id) 
    VALUES (?, ?, ?)
  `, [title, content, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create question' })
        }

        const questionId = this.lastID

        // Insert tags and associate with question
        tags.forEach(tagName => {
            db.run(`INSERT OR IGNORE INTO tags (name) VALUES (?)`, [tagName.toLowerCase()], function () {
                db.get("SELECT id FROM tags WHERE name = ?", [tagName.toLowerCase()], (err, tag) => {
                    if (tag) {
                        db.run(`
              INSERT OR IGNORE INTO question_tags (question_id, tag_id) 
              VALUES (?, ?)
            `, [questionId, tag.id])
                    }
                })
            })
        })

        res.status(201).json({ id: questionId, title, content, tags })
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 StackIt server running on http://localhost:${PORT}`)
    console.log(`📁 Database: ${dbPath}`)
})

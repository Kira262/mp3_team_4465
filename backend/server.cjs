const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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
      created_at DATETIME DEFAULT (datetime('now', 'utc')),
      updated_at DATETIME DEFAULT (datetime('now', 'utc'))
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
      created_at DATETIME DEFAULT (datetime('now', 'utc')),
      updated_at DATETIME DEFAULT (datetime('now', 'utc')),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

    // Tags table
    db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT (datetime('now', 'utc'))
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
      created_at DATETIME DEFAULT (datetime('now', 'utc')),
      updated_at DATETIME DEFAULT (datetime('now', 'utc')),
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
      created_at DATETIME DEFAULT (datetime('now', 'utc')),
      UNIQUE(user_id, question_id),
      UNIQUE(user_id, answer_id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (answer_id) REFERENCES answers (id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
    )
  `)

    // Insert demo data
    const demoPassword = bcrypt.hashSync('demo123', 10)

    db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role) 
    VALUES (?, ?, ?, ?)
  `, ['demo', 'demo@stackit.com', demoPassword, 'user'])

    db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, role) 
    VALUES (?, ?, ?, ?)
  `, ['johndoe', 'john@example.com', demoPassword, 'user'])

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

        db.run(`
      INSERT INTO users (username, email, password_hash) 
      VALUES (?, ?, ?)
    `, [username, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or email already exists' })
                }
                return res.status(500).json({ error: 'Failed to create user' })
            }

            const token = jwt.sign(
                { id: this.lastID, username, email, role: 'user' },
                JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.status(201).json({
                token,
                user: { id: this.lastID, username, email, role: 'user' }
            })
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
      SELECT id, username, email, password_hash, role 
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

// Optional auth middleware - doesn't require authentication but adds user info if available
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        req.user = null
        return next()
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null
        } else {
            req.user = user
        }
        next()
    })
}

// Questions routes
app.get('/api/questions', optionalAuth, (req, res) => {
    const { sort = 'newest', tag = '', limit = 10, page = 1 } = req.query
    const userId = req.user ? req.user.id : null
    const pageSize = parseInt(limit) || 10
    const currentPage = parseInt(page) || 1
    const offset = (currentPage - 1) * pageSize

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
      GROUP_CONCAT(DISTINCT t.name) as tags
    FROM questions q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN answers a ON q.id = a.question_id
    LEFT JOIN question_tags qt ON q.id = qt.question_id
    LEFT JOIN tags t ON qt.tag_id = t.id
  `

    const params = []
    if (tag) {
        const tags = tag.split(',').map(t => t.trim()).filter(t => t)
        if (tags.length > 0) {
            const placeholders = tags.map(() => '?').join(',')
            query += ` WHERE t.name IN (${placeholders})`
            params.push(...tags)
        }
    }

    query += `
    GROUP BY q.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `
    params.push(pageSize, offset)

    // Also get total count for pagination
    let countQuery = `
    SELECT COUNT(DISTINCT q.id) as total
    FROM questions q
    LEFT JOIN question_tags qt ON q.id = qt.question_id
    LEFT JOIN tags t ON qt.tag_id = t.id
  `
    
    const countParams = []
    if (tag) {
        const tags = tag.split(',').map(t => t.trim()).filter(t => t)
        if (tags.length > 0) {
            const placeholders = tags.map(() => '?').join(',')
            countQuery += ` WHERE t.name IN (${placeholders})`
            countParams.push(...tags)
        }
    }

    // First get the total count
    db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        const totalQuestions = countResult.total || 0
        const totalPages = Math.ceil(totalQuestions / pageSize)

        // Then get the questions
        db.all(query, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' })
            }

            const questions = rows.map(row => ({
                ...row,
                tags: row.tags ? row.tags.split(',') : [],
                createdAt: row.created_at
            }))

            // If user is authenticated, get their votes for these questions
            if (userId && questions.length > 0) {
                const questionIds = questions.map(q => q.id).join(',')
                db.all(`
                    SELECT question_id, vote_type 
                    FROM votes 
                    WHERE user_id = ? AND question_id IN (${questionIds})
                `, [userId], (err, votes) => {
                    if (err) {
                        return res.json({
                            questions,
                            pagination: {
                                currentPage,
                                totalPages,
                                totalQuestions,
                                hasNext: currentPage < totalPages,
                                hasPrev: currentPage > 1
                            }
                        })
                    }

                    const voteMap = {}
                    votes.forEach(vote => {
                        voteMap[vote.question_id] = vote.vote_type
                    })

                    const questionsWithVotes = questions.map(question => ({
                        ...question,
                        userVote: voteMap[question.id] || null
                    }))

                    res.json({
                        questions: questionsWithVotes,
                        pagination: {
                            currentPage,
                            totalPages,
                            totalQuestions,
                            hasNext: currentPage < totalPages,
                            hasPrev: currentPage > 1
                        }
                    })
                })
            } else {
                res.json({
                    questions,
                    pagination: {
                        currentPage,
                        totalPages,
                        totalQuestions,
                        hasNext: currentPage < totalPages,
                        hasPrev: currentPage > 1
                    }
                })
            }
        })
    })
})

app.post('/api/questions', authenticateToken, (req, res) => {
    const { title, content, tags } = req.body

    if (!title || !content || !tags || tags.length === 0) {
        return res.status(400).json({ error: 'Title, content, and tags are required' })
    }

    // Validate title and content lengths
    if (title.length > 200) {
        return res.status(400).json({ error: 'Title must be 200 characters or less' })
    }

    if (content.length > 10000) {
        return res.status(400).json({ error: 'Content must be 10000 characters or less' })
    }

    // Validate tags
    if (tags.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 tags allowed' })
    }

    for (const tag of tags) {
        if (tag.length > 20) {
            return res.status(400).json({ error: 'Each tag must be 20 characters or less' })
        }
        if (!/^[a-zA-Z0-9\-\.#\+]+$/.test(tag)) {
            return res.status(400).json({ error: 'Tags can only contain letters, numbers, hyphens, dots, and hash/plus symbols' })
        }
    }

    db.run(`
    INSERT INTO questions (title, content, user_id) 
    VALUES (?, ?, ?)
  `, [title, content, req.user.id], function (err) {
        if (err) {
            console.error('Error creating question:', err)
            return res.status(500).json({ error: 'Failed to create question' })
        }

        const questionId = this.lastID
        let tagsProcessed = 0
        const tagIds = []

        // Process each tag
        tags.forEach(tagName => {
            const normalizedTag = tagName.toLowerCase().trim()
            
            // Insert or get existing tag
            db.run(`INSERT OR IGNORE INTO tags (name) VALUES (?)`, [normalizedTag], function (insertErr) {
                if (insertErr) {
                    console.error('Error inserting tag:', insertErr)
                    return res.status(500).json({ error: 'Failed to process tags' })
                }

                // Get the tag ID
                db.get("SELECT id FROM tags WHERE name = ?", [normalizedTag], (err, tag) => {
                    if (err) {
                        console.error('Error getting tag:', err)
                        return res.status(500).json({ error: 'Failed to process tags' })
                    }

                    if (tag) {
                        tagIds.push(tag.id)
                        
                        // Associate tag with question
                        db.run(`
                          INSERT OR IGNORE INTO question_tags (question_id, tag_id) 
                          VALUES (?, ?)
                        `, [questionId, tag.id], (err) => {
                            if (err) {
                                console.error('Error linking tag to question:', err)
                            }
                            
                            tagsProcessed++
                            if (tagsProcessed === tags.length) {
                                // All tags processed, return success
                                res.status(201).json({ 
                                    id: questionId, 
                                    title, 
                                    content, 
                                    tags: tags.map(t => t.toLowerCase().trim()),
                                    message: 'Question created successfully'
                                })
                            }
                        })
                    } else {
                        tagsProcessed++
                        if (tagsProcessed === tags.length) {
                            res.status(201).json({ 
                                id: questionId, 
                                title, 
                                content, 
                                tags: tags.map(t => t.toLowerCase().trim()),
                                message: 'Question created successfully'
                            })
                        }
                    }
                })
            })
        })
    })
})

// Vote routes
app.post('/api/questions/:id/vote', authenticateToken, (req, res) => {
    const questionId = req.params.id
    const { vote_type } = req.body // 'up' or 'down'
    const userId = req.user.id

    if (!vote_type || !['up', 'down'].includes(vote_type)) {
        return res.status(400).json({ error: 'Vote type must be "up" or "down"' })
    }

    // Check if user already voted on this question
    db.get(`
        SELECT vote_type FROM votes 
        WHERE user_id = ? AND question_id = ?
    `, [userId, questionId], (err, existingVote) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        if (existingVote) {
            // User has already voted, don't allow any further voting
            return res.status(400).json({
                error: 'You have already voted on this question. Each user can only vote once per question.'
            })
        } else {
            // New vote
            db.run(`
                INSERT INTO votes (user_id, question_id, vote_type) 
                VALUES (?, ?, ?)
            `, [userId, questionId, vote_type], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to record vote' })
                }

                // Update question vote count
                updateQuestionVoteCount(questionId, (err, voteCount) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update vote count' })
                    }
                    res.json({ message: 'Vote recorded', voteCount, userVote: vote_type })
                })
            })
        }
    })
})

// Get user's vote for a specific question
app.get('/api/questions/:id/vote', authenticateToken, (req, res) => {
    const questionId = req.params.id
    const userId = req.user.id

    db.get(`
        SELECT vote_type FROM votes 
        WHERE user_id = ? AND question_id = ?
    `, [userId, questionId], (err, vote) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        res.json({ userVote: vote ? vote.vote_type : null })
    })
})

// Notifications route - get latest questions for notifications
app.get('/api/notifications/latest-questions', optionalAuth, (req, res) => {
    const query = `
        SELECT 
            q.id,
            q.title,
            q.created_at,
            u.username as author
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        ORDER BY q.created_at DESC
        LIMIT 3
    `

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' })
        }

        const latestQuestions = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            createdAt: row.created_at,
            message: `New question: "${row.title}" by ${row.author}`,
            time: row.created_at,
            read: false // All new questions are unread by default
        }))

        res.json(latestQuestions)
    })
})

// Helper function to update question vote count
function updateQuestionVoteCount(questionId, callback) {
    db.get(`
        SELECT 
            SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END) - 
            SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END) as vote_count
        FROM votes 
        WHERE question_id = ?
    `, [questionId], (err, result) => {
        if (err) {
            return callback(err)
        }

        const voteCount = result.vote_count || 0

        db.run(`
            UPDATE questions 
            SET votes = ?, updated_at = datetime('now', 'utc')
            WHERE id = ?
        `, [voteCount, questionId], function (err) {
            if (err) {
                return callback(err)
            }
            callback(null, voteCount)
        })
    })
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 StackIt server running on http://localhost:${PORT}`)
    console.log(`📁 Database: ${dbPath}`)
})

# StackIt - Q&A Forum Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/SQLite-3.44-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

**StackIt** is a modern, feature-rich Q&A forum platform built with React, TypeScript, and Node.js. It provides a clean, intuitive interface for users to ask questions, share knowledge, and engage with the community through voting and real-time notifications.

## 🚀 Live Demo

Experience StackIt in action: [Live Demo](#) *(Add your deployment URL here)*

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure user registration and login
- **Role-based Access Control**: User roles and permissions
- **Session Management**: Persistent login sessions with token refresh
- **Protected Routes**: Secure access to authenticated features

### 📝 Question Management
- **Create Questions**: Rich text editor with markdown support
- **Tag System**: Categorize questions with multiple tags
- **Search & Filter**: Advanced search by title, content, and tags
- **Real-time Updates**: Live question feed with automatic refresh
- **Question Views**: Track question popularity

### 🗳️ Voting System
- **Upvote/Downvote**: Community-driven content ranking
- **One Vote Per User**: Prevent voting manipulation
- **Real-time Vote Counts**: Instant vote updates
- **User Vote Tracking**: Remember user's voting history
- **Vote Persistence**: Database-backed voting system

### 🔔 Notification System
- **Real-time Notifications**: Live updates for new questions
- **Latest Questions Feed**: Top 3 most recent questions
- **Auto-refresh**: 30-second polling for new content
- **Notification Bell**: Visual indicator for new activity
- **Clickable Notifications**: Direct navigation to questions

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for enhanced UX
- **Modern UI Components**: Clean, professional interface
- **Dark/Light Theme**: *(Coming soon)*
- **Progressive Web App**: *(Coming soon)*

### ⚡ Performance & Scalability
- **Optimized Queries**: Efficient database operations
- **Lazy Loading**: On-demand content loading
- **Caching Strategy**: Strategic data caching
- **TypeScript**: Type safety and better developer experience
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0 with TypeScript
- **Routing**: React Router DOM 6.20.1
- **Styling**: Tailwind CSS 3.3 with PostCSS
- **Animations**: Framer Motion 10.16.15
- **Icons**: Lucide React 0.294.0
- **HTTP Client**: Axios 1.6.2
- **Build Tool**: Vite with Hot Module Replacement
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database**: SQLite 5.1.6
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: CORS middleware 2.8.5
- **File Operations**: Node.js built-in modules

### Development Tools
- **TypeScript**: 5.0+ for type safety
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Vite**: Fast development server
- **npm**: Package management

## 📋 Prerequisites

Before running StackIt, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

Verify your installations:
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show v8.0.0 or higher
```

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Vezingg/mp3_team_4465.git
cd mp3_team_4465
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm init -y
npm install express cors bcryptjs jsonwebtoken sqlite3
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory (optional for development):
```bash
# Backend Configuration
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-key-change-in-production
NODE_ENV=development

# Database Configuration
DB_PATH=./backend/database.sqlite
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Both Servers Concurrently
```bash
# Terminal 1 - Start Backend Server
npm run server

# Terminal 2 - Start Frontend Development Server
npm run dev
```

#### Option 2: Manual Setup
```bash
# Start Backend Server (Terminal 1)
cd backend
node server.cjs

# Start Frontend Server (Terminal 2)
cd ..
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database**: SQLite file at `./backend/database.sqlite`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
mp3_team_4465/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   └── Navbar.tsx           # Navigation with notifications
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx         # Main questions feed
│   │   ├── LoginPage.tsx        # User authentication
│   │   ├── RegisterPage.tsx     # User registration
│   │   ├── AskQuestionPage.tsx  # Question creation
│   │   ├── QuestionDetailPage.tsx # Individual question view
│   │   └── UserProfilePage.tsx  # User profile management
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── backend/                     # Backend source code
│   ├── server.cjs              # Express server and API routes
│   ├── database.sqlite         # SQLite database file
│   └── package.json            # Backend dependencies
├── public/                     # Static assets
├── package.json               # Frontend dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions?sort=newest&tag=react&limit=50
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "How to implement JWT authentication?",
  "content": "I need help with implementing JWT...",
  "tags": ["jwt", "authentication", "security"]
}
```

### Voting Endpoints

#### Vote on Question
```http
POST /api/questions/{id}/vote
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "vote_type": "up"
}
```

### Notification Endpoints

#### Get Latest Questions
```http
GET /api/notifications/latest-questions
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  votes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Votes Table
```sql
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  question_id INTEGER,
  vote_type TEXT CHECK(vote_type IN ('up', 'down')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
);
```

## 🧪 Testing

### Demo Accounts
The application comes with pre-configured demo accounts:

- **Username**: `demo`
- **Email**: `demo@stackit.com`
- **Password**: `demo123`

### Sample Data
- 3 demo questions with different topics
- Pre-configured tags (react, javascript, typescript, etc.)
- Sample user accounts for testing

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Server-side validation
- **Rate Limiting**: *(Coming soon)*

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run server
```

#### Database Connection Issues
```bash
# Remove existing database and restart
rm backend/database.sqlite
npm run server
```

#### Node Modules Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Ensure backend/package.json has start script
cd backend
npm run start
```

### Environment Variables for Production
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-production-secret
PORT=3001
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, TypeScript, Tailwind CSS
- **Backend Development**: Node.js, Express, SQLite
- **UI/UX Design**: Modern, responsive design
- **DevOps**: Vite, npm scripts, deployment ready

## 📞 Support

For support, please create an issue in the GitHub repository or contact the development team.

---

<div align="center">
  <p>Built with ❤️ by the StackIt Team</p>
  <p>⭐ Star us on GitHub if you like this project!</p>
</div>

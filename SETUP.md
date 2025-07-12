# StackIt Setup Guide

## 🚀 Complete Setup Instructions

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your terminal/VS Code

### Step 2: Verify Installation
Open a new terminal and run:
```bash
node --version
npm --version
```

### Step 3: Install Project Dependencies
```bash
npm install
```

### Step 4: Start the Application

**Option A: Start both servers with one command**
```bash
npm run dev
```

**Option B: Start servers separately**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run server
```

### Step 5: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎯 Demo Account
- **Email**: demo@stackit.com
- **Password**: demo123

## 📋 Features to Demo

### 1. **Beautiful Landing Page**
- Modern gradient background
- Responsive design
- Smooth animations
- Community stats sidebar

### 2. **Authentication System**
- User registration with validation
- Login with demo account
- JWT token management
- Secure logout

### 3. **Question Management**
- Ask questions with rich text
- Tag-based categorization
- Question listing with filters
- Search functionality

### 4. **Interactive UI Elements**
- Hover effects on cards
- Button animations
- Loading states
- Toast notifications

### 5. **Responsive Design**
- Mobile-friendly navigation
- Responsive grid layouts
- Touch-friendly interactions

## 🎨 Design Highlights

### Visual Features
- **Glassmorphism**: Semi-transparent navigation with backdrop blur
- **Gradients**: Beautiful blue-to-purple gradients
- **Micro-interactions**: Subtle hover and click animations
- **Typography**: Clean Inter font with proper hierarchy
- **Spacing**: Consistent Tailwind spacing system

### Component Library
- **Cards**: Elevated cards with hover shadows
- **Buttons**: Gradient backgrounds with scale effects
- **Forms**: Clean inputs with focus rings
- **Badges**: Pill-shaped tags with interactions
- **Navigation**: Responsive navbar with mobile menu

## 🛠️ Development Features

### Hot Reload
- Instant updates during development
- CSS changes reflect immediately
- Component state preservation

### Type Safety
- Full TypeScript integration
- IDE autocomplete and error checking
- Compile-time error prevention

### Modern Tooling
- Vite for fast builds
- ESLint for code quality
- Tailwind for rapid styling
- Framer Motion for animations

## 📊 Database Structure

### Tables Created
- **users**: User accounts and profiles
- **questions**: Question posts with metadata
- **answers**: Responses to questions
- **tags**: Categorization system
- **votes**: Community voting system
- **question_tags**: Many-to-many relationships

### Sample Data
The app comes pre-loaded with:
- Demo user accounts
- Sample questions
- Popular tags
- Realistic data for testing

## 🎭 Hackathon Presentation Tips

### What to Highlight
1. **Visual Appeal**: The beautiful, modern UI design
2. **Smooth Animations**: Framer Motion transitions
3. **Responsive Design**: Mobile and desktop compatibility
4. **User Experience**: Intuitive navigation and interactions
5. **Technical Stack**: Modern React + TypeScript + Express

### Demo Flow
1. **Homepage**: Show the landing page and community stats
2. **Registration**: Create a new account
3. **Ask Question**: Demonstrate the rich question form
4. **Browse Questions**: Show filtering and search
5. **Mobile View**: Demonstrate responsive design

### Key Selling Points
- **4-hour build time**: Rapid development for hackathons
- **Production-ready**: Clean, scalable architecture
- **Beautiful UI**: Modern design that stands out
- **Full-stack**: Complete frontend and backend solution
- **Easy deployment**: Ready for Vercel/Netlify + Railway

## 🚀 Quick Deployment

### Frontend (Vercel)
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Backend (Railway)
```bash
# Push to GitHub
# Connect Railway to repository
# Set JWT_SECRET environment variable
```

## 🎊 Congratulations!

You now have a beautiful, fully-functional Q&A platform perfect for hackathons and real-world use!

**StackIt** demonstrates modern web development best practices while maintaining the rapid development pace needed for competitive coding events.

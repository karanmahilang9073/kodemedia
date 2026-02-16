# KodeMedia - Social Media Platform

A full-stack social media application built with React and Node.js, featuring user authentication, post creation, AI-powered features, and social interactions.

---

## 🏗️ Project Structure

```
kodemedia/
├── backend/                          # Express.js API Server
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/
│   │   ├── aiController.js          # AI-related operations
│   │   ├── authController.js        # Authentication logic (register, login)
│   │   └── postController.js        # Post CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT token verification
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, password, followers, following)
│   │   └── Post.js                  # Post schema (content, author, likes, comments)
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints (/api/auth)
│   │   ├── postRoutes.js            # Post endpoints (/api/posts)
│   │   └── aiRoutes.js              # AI endpoints (/api/ai)
│   ├── utils/
│   │   └── generateToken.js         # JWT token generation
│   ├── server.js                    # Express app setup & server entry point
│   └── package.json                 # Backend dependencies
│
├── frontend/                         # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentSection.jsx   # Comment display & submission
│   │   │   ├── CreatePostForm.jsx   # Post creation form
│   │   │   ├── Loading.jsx          # Loading spinner component
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── PostCard.jsx         # Individual post display
│   │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   │   ├── SkeletonLoader.jsx   # Skeleton loading animation
│   │   │   └── Toast.jsx            # Toast notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Home feed page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   └── UserProfile.jsx      # User profile page
│   │   ├── services/
│   │   │   ├── aiService.js         # AI API calls
│   │   │   ├── authService.js       # Authentication API calls
│   │   │   ├── postService.js       # Post API calls
│   │   │   └── userService.js       # User API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state management
│   │   ├── config/
│   │   │   └── api.js               # API base URL configuration
│   │   ├── utils/
│   │   │   └── validation.js        # Input validation utilities
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                       # Static assets
│   ├── vite.config.js               # Vite bundler configuration
│   ├── eslint.config.js             # ESLint linting rules
│   └── package.json                 # Frontend dependencies
│
└── [CMD Files] (Setup Scripts)
    ├── start-all.cmd                # Start backend & frontend together
    ├── start-backend.cmd            # Start only backend server
    ├── start-frontend.cmd           # Start only frontend dev server
    └── install-deps.cmd             # Install all dependencies
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2
- **Database:** MongoDB with Mongoose 9.0
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **API Features:** Google Generative AI (@google/generative-ai)
- **Additional:** CORS support, dotenv for environment variables
- **Development:** Nodemon for auto-reload

### Frontend
- **Library:** React 19.2
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **Routing:** React Router DOM 7.11
- **HTTP Client:** Axios 1.13
- **Linting:** ESLint with React plugins

### Database
- **Primary DB:** MongoDB
- **Query Language:** MongoDB aggregation pipelines
- **ODM:** Mongoose (schema validation & middleware)

---

## 🔄 Application Flow

### Authentication Flow
```
User Register/Login
    ↓
authController validates credentials & hashes password (bcryptjs)
    ↓
JWT token generated (generateToken.js)
    ↓
Token stored in frontend (localStorage/sessionStorage)
    ↓
Token included in all protected API requests (authMiddleware.js)
    ↓
authMiddleware verifies token on every request
```

### Post Creation Flow
```
User creates post in CreatePostForm
    ↓
Frontend sends POST request to /api/posts
    ↓
authMiddleware verifies user token
    ↓
postController.createPost() saves to MongoDB
    ↓
Post added to User's dashboard (Home.jsx)
    ↓
Real-time UI update with new post
```

### Social Interaction Flow
```
User likes/comments on post
    ↓
Frontend sends request to /api/posts/[postId]/like or /comment
    ↓
postController updates Post model (likes array or comments array)
    ↓
MongoDB updated with new data
    ↓
Frontend receives updated post data
    ↓
PostCard component re-renders with new counts
```

### User Profile Flow
```
User navigates to /profile
    ↓
Frontend fetches user data via userService
    ↓
Backend returns user + user's posts
    ↓
UserProfile renders user info (followers, following, posts)
    ↓
User can view followers/following relationships
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)
- **.env file** with configuration (see below)

### Environment Variables

Create a `.env` file in the **backend** folder:

```env
# Database
MONGO_URI=mongodb://localhost:27017/kodemedia
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kodemedia

# Server Port
PORT=5000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key_here
```

### Quick Setup

#### Option 1: Using Command Files (Windows)
```bash
# Navigate to project root and double-click:
start-all.cmd          # Installs deps and starts both servers
# OR individually:
install-deps.cmd       # Just install dependencies
start-backend.cmd      # Start backend only
start-frontend.cmd     # Start frontend only
```

#### Option 2: Manual Setup
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend (from backend folder)
npm run dev

# Start frontend (from frontend folder, in new terminal)
npm run dev
```

### Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user and get JWT token
- `GET /profile` - Get current user profile (protected)

### Post Routes (`/api/posts`)
- `GET /` - Get all posts
- `POST /` - Create new post (protected)
- `GET /:postId` - Get single post
- `PUT /:postId` - Update post (protected)
- `DELETE /:postId` - Delete post (protected)
- `POST /:postId/like` - Like/Unlike post (protected)
- `POST /:postId/comment` - Add comment to post (protected)

### AI Routes (`/api/ai`)
- `POST /generate` - Generate AI content (protected)
- `POST /translate` - Translate content (protected)

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs for password security  
✅ **Protected Routes** - Frontend route guards & backend middleware  
✅ **CORS Configuration** - Cross-origin requests safely configured  
✅ **Environment Variables** - Sensitive data in .env files  

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mongoose | 9.0.2 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT authentication |
| bcryptjs | 3.0.3 | Password hashing |
| @google/generative-ai | 0.24.1 | AI features |
| react | 19.2.0 | UI library |
| vite | 7.2.4 | Build tool |
| tailwindcss | 4.1.18 | CSS framework |
| axios | 1.13.2 | HTTP client |

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Ensure dependencies are installed
npm install
```

### "Port already in use"
- Backend: Change `PORT` in .env file
- Frontend: Port 5173 will auto-increment if busy

### MongoDB connection error
- Verify `MONGO_URI` in .env is correct
- Check MongoDB service is running (local) or cluster is accessible (Atlas)

### CORS errors
- Confirm frontend URL is in backend CORS config
- Check both front & backend are running

### Token expiration
- Clear localStorage and re-login
- Extend JWT expiry in `generateToken.js`

---

## 🎯 Development Workflow

1. **Backend Development**
   - Edit files in `backend/` folder
   - Nodemon auto-reloads on save
   - Check console for errors

2. **Frontend Development**
   - Edit files in `frontend/src/` folder
   - Vite provides instant HMR (Hot Module Reload)
   - Page auto-refreshes on save

3. **Testing New Endpoints**
   - Use Postman/Insomnia for API testing
   - Include `Authorization: Bearer <token>` header for protected routes

4. **Database Inspection**
   - MongoDB Compass for local MongoDB
   - MongoDB Atlas for cloud databases

---

## 📝 Notes

- The application uses context API (AuthContext) for global auth state
- Comments are embedded in Post documents (nested schema)
- User followers/following are stored as User ID references
- AI features integrate Google's Gemini API
- Tailwind CSS with Vite plugin for optimized styling

---

## 📄 License

ISC License

---

**Happy Coding! 🚀**

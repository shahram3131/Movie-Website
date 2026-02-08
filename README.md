# MovieHub - Movie Review Platform

A full-stack web application for discovering movies, writing reviews, and sharing cinema experiences. Built with Node.js, Express, MongoDB, and a modern frontend.

## 🎬 Project Overview

**MovieHub** is a collaborative movie review platform where users can:
- Browse popular movies from The Movie Database (TMDB) API
- Write and rate movies (1-10 scale)
- Mark reviews with spoiler warnings
- Manage user profiles and preferences
- Different user roles with varying permissions (user, premium, moderator, admin)
- Watch trailers directly in the application

**Project Type:** Movie Review Platform  
**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Joi validation

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation Steps

1. **Clone or extract the project**
   ```bash
   cd Movie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file in the root directory**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviehub
   JWT_SECRET=your_super_secret_jwt_key_here
   TMDB_API_KEY=your_themoviedb_api_key_here
   NODE_ENV=development
   ```

   **How to get TMDB API Key:**
   - Go to https://www.themoviedb.org/settings/api
   - Create an account and request an API key
   - Copy your v3 authentication token

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

5. **Open the frontend**
   - Open `Frontend/index.html` in your browser or serve with a local server

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```
**Response (201):**
```json
{
  "message": "Registered",
  "userId": "65abc123def456",
  "role": "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### User Routes (Private - Requires JWT Token)

#### Get Your Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```
**Response (200):**
```json
{
  "user": {
    "_id": "65abc123def456",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Your Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "johnupdated",
  "email": "newemail@example.com"
}
```
**Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "_id": "65abc123def456",
    "username": "johnupdated",
    "email": "newemail@example.com",
    "role": "user"
  }
}
```

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer {admin_token}
```

#### Get User by ID (Admin Only)
```http
GET /api/users/{userId}
Authorization: Bearer {admin_token}
```

#### Update User Role (Admin Only)
```http
PUT /api/users/{userId}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "premium"
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/{userId}
Authorization: Bearer {admin_token}
```

---

### Movie Routes (Private - Requires JWT Token)

#### Get All Movies
```http
GET /api/movies
Authorization: Bearer {token}
```
**Response (200):**
```json
{
  "movies": [
    {
      "_id": "65abc123def456",
      "movieId": "550",
      "title": "The Dark Knight",
      "description": "When Batman faces the Joker...",
      "createdBy": "65xyz789abc012",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Add Movie (Admin Only)
```http
POST /api/movies
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "movieId": "550",
  "title": "The Dark Knight",
  "description": "When Batman faces the Joker in Gotham City..."
}
```
**Response (201):**
```json
{
  "message": "Movie added",
  "movie": {
    "_id": "65abc123def456",
    "movieId": "550",
    "title": "The Dark Knight",
    "description": "When Batman faces the Joker...",
    "createdBy": "65xyz789abc012"
  }
}
```

#### Delete Movie (Admin Only)
```http
DELETE /api/movies/{movieId}
Authorization: Bearer {admin_token}
```
**Response (200):**
```json
{
  "message": "Movie removed"
}
```

---

### Review Routes (Private - Requires JWT Token)

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "movieId": "550",
  "movieTitle": "The Dark Knight",
  "rating": 9,
  "reviewText": "An absolute masterpiece of modern cinema...",
  "containsSpoilers": false
}
```
**Response (201):**
```json
{
  "message": "Review created",
  "review": {
    "_id": "65abc123def456",
    "movieId": "550",
    "movieTitle": "The Dark Knight",
    "rating": 9,
    "reviewText": "An absolute masterpiece...",
    "containsSpoilers": false,
    "author": "65xyz789abc012",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Reviews
```http
GET /api/reviews
Authorization: Bearer {token}
```
**Rules:**
- Regular users see only their own reviews
- Premium, moderator, and admin users see all reviews

**Response (200):**
```json
{
  "reviews": [
    {
      "_id": "65abc123def456",
      "movieId": "550",
      "movieTitle": "The Dark Knight",
      "rating": 9,
      "reviewText": "An absolute masterpiece...",
      "containsSpoilers": false,
      "author": {
        "_id": "65xyz789abc012",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Specific Review
```http
GET /api/reviews/{reviewId}
Authorization: Bearer {token}
```

#### Update Review
```http
PUT /api/reviews/{reviewId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 8,
  "reviewText": "Still great, but upon reflection...",
  "containsSpoilers": true
}
```
**Permissions:**
- Premium users can update their own reviews
- Moderators can update any review
- Admins can update any review

#### Delete Review
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer {token}
```
**Permissions:**
- Users can delete their own reviews (if premium)
- Moderators can delete any review
- Admins can delete any review

---

### External API Integration

#### Get Popular Movies from TMDB
```http
GET /api/movies/tmdb/popular
Authorization: Bearer {token}
```
**Response (200):**
```json
{
  "movies": [
    {
      "id": 550,
      "title": "Fight Club",
      "overview": "An insomniac office worker...",
      "posterPath": "/6nBRwdE0D1zsKNxSEJHnMKjBTPo.jpg",
      "backdropPath": "/fXK0pXF93WnMAnBHaFAY8HZ01Yc.jpg",
      "releaseDate": "1999-10-15",
      "voteAverage": 8.4
    }
  ]
}
```

---

## 🔐 User Roles & Permissions

| Feature | User | Premium | Moderator | Admin |
|---------|------|---------|-----------|-------|
| View own reviews | ✅ | ✅ | ✅ | ✅ |
| View all reviews | ❌ | ✅ | ✅ | ✅ |
| Create review | ✅ | ✅ | ✅ | ✅ |
| Edit own review | ❌ | ✅ | ✅ | ✅ |
| Edit any review | ❌ | ❌ | ✅ | ✅ |
| Delete own review | ❌ | ✅ | ✅ | ✅ |
| Delete any review | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Add movies | ❌ | ❌ | ❌ | ✅ |
| Delete movies | ❌ | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
Movie/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Movie.js           # Movie schema
│   │   └── Review.js          # Review schema
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── userController.js  # User management
│   │   ├── movieController.js # Movie operations
│   │   └── reviewController.js# Review operations
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── userRoutes.js      # User endpoints
│   │   ├── movieRoutes.js     # Movie endpoints
│   │   ├── reviewRoutes.js    # Review endpoints
│   │   └── schemas.js         # Joi validation schemas
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── rbacMiddleware.js  # Role-based access
│   │   ├── validate.js        # Request validation
│   │   ├── errorHandler.js    # Global error handling
│   │   └── notFound.js        # 404 handler
│   └── utils/
│       └── jwt.js             # JWT sign/verify
├── Frontend/
│   ├── index.html             # Main page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── profile.html           # User profile
│   ├── movie.html             # Movie details
│   ├── my-reviews.html        # User's reviews
│   ├── css/
│   │   └── *.css              # Stylesheets
│   ├── js/
│   │   ├── api.js             # API calls
│   │   ├── auth.js            # Auth logic
│   │   ├── movies.js          # Movie page logic
│   │   └── ...
│   └── assets/                # Images
└── package.json               # Dependencies
```

---

## 🛠 Key Technologies

- **Backend:** Express.js 5.x, Node.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (7-day expiry)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **External API:** TMDB (The Movie Database)
- **Frontend:** HTML5, CSS3, JavaScript (ES6 modules)

---

## 🔑 Environment Variables Required

```env
PORT                 # Server port (default: 5000)
MONGO_URI           # MongoDB connection string
JWT_SECRET          # Secret key for JWT signing
TMDB_API_KEY        # TMDB API key for movie data
NODE_ENV            # Environment (development/production)
```

---

## 📝 Validation Rules

### Register/Login
- **Username:** 2-40 characters, required
- **Email:** Valid email format, unique, required
- **Password:** Minimum 6 characters, required

### Reviews
- **Rating:** 1-10, required
- **Review Text:** Max 2000 characters
- **Movie ID:** Required
- **Movie Title:** 1-200 characters, required

### Profile Update
- **Username:** 2-40 characters (optional)
- **Email:** Valid email, must be unique (optional)

---

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Email/resource already exists |
| 500 | Internal Server Error |

**Example Error Response:**
```json
{
  "message": "Validation error",
  "details": ["email must be a valid email"]
}
```

---

## 🔐 Security Features

✅ **Password Hashing:** All passwords hashed with bcryptjs (10 rounds)  
✅ **JWT Authentication:** 7-day token expiry  
✅ **CORS Enabled:** Configured for frontend access  
✅ **Input Validation:** Joi schema validation on all endpoints  
✅ **Role-Based Access:** Separate middleware for permission checks  
✅ **Environment Variables:** Sensitive data never hardcoded  

---

## 📊 Database Models

### User
- `username` - String, unique per session
- `email` - String, unique
- `password` - Hashed with bcryptjs
- `role` - Enum: user, premium, moderator, admin
- `paymentLast4` - Last 4 digits (premium only)
- `premiumSince` - Date when premium activated
- `timestamps` - createdAt, updatedAt

### Movie
- `movieId` - String, unique (TMDB ID)
- `title` - String
- `description` - String
- `createdBy` - Reference to User
- `timestamps` - createdAt, updatedAt

### Review
- `movieId` - String (TMDB ID)
- `movieTitle` - String
- `rating` - Number (1-10)
- `reviewText` - String (max 2000 chars)
- `containsSpoilers` - Boolean
- `author` - Reference to User
- `timestamps` - createdAt, updatedAt

---

## 💡 Usage Examples

### Frontend Integration Example

```javascript
// Get token from localStorage after login
const token = localStorage.getItem('token');

// Fetch reviews
fetch('/api/reviews', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data.reviews));

// Create review
fetch('/api/reviews', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    movieId: '550',
    movieTitle: 'Fight Club',
    rating: 9,
    reviewText: 'Amazing movie!',
    containsSpoilers: false
  })
})
.then(res => res.json())
.then(data => console.log('Review created:', data.review));
```

---

## 🚀 Deployment

Instructions for deploying to Render, Railway, or Replit:

1. Set up MongoDB Atlas database
2. Configure environment variables on your hosting platform
3. Deploy the backend
4. Update frontend API base URL to deployed server
5. Test all API endpoints on production

---

## 📄 License

ISC License - Use freely in your projects

---

## 👨‍💻 Author

Built as a full-stack Node.js project demonstrating modern web development practices with authentication, CRUD operations, role-based access control, and external API integration.

---

**Last Updated:** February 2026

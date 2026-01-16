# Login App Backend

A Node.js/Express backend API for user authentication with JWT tokens.

## Features

- User registration with email and password
- User login with JWT authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- CORS support for frontend integration
- Protected routes with JWT middleware

## API Endpoints

### Authentication Routes

#### Register a new user
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get current user (protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Other Routes

- `GET /` - API status message
- `GET /health` - Health check endpoint

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secure-secret-key
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` (or the port specified in your .env file).

## Project Structure

```
login-app-BE/
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── User.js           # User model (in-memory storage)
├── routes/
│   └── auth.js           # Authentication routes
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── README.md            # This file
└── server.js            # Main server file
```

## Notes

- This implementation uses **in-memory storage** for users. For production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- Make sure to use a strong JWT_SECRET in production
- The JWT tokens expire after 24 hours by default

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for authentication
- Input validation is performed on all endpoints
- CORS is configured to accept requests from your frontend

## Connect to Frontend

Update your React frontend to point to this backend:

```javascript
const API_URL = 'http://localhost:5000/api/auth';

// Login example
const response = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});
```

## License

ISC

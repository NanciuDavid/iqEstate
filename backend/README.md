# EstateIQ Backend

This is the backend API for the EstateIQ real estate platform. It provides RESTful endpoints for property listings, AI price predictions, user management, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Environment Setup

Create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
DB_URL=postgresql://username:password@hostname:port/database_name

# JWT Secret for authentication tokens
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=3001

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Optional: For future ML model integration
ML_MODEL_API_URL=http://localhost:5000/predict
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Make sure your PostgreSQL database is running and accessible. The Prisma schema is already set up with comprehensive models for properties, users, predictions, and more.

Generate Prisma client:
```bash
npx prisma generate
```

If you need to run migrations:
```bash
npx prisma migrate dev
```

### 4. Build and Run

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

## 📚 API Documentation

The backend provides the following main API endpoints:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Properties (`/api/properties`)
- `GET /api/properties` - Get all properties with filtering/pagination
- `GET /api/properties/:id` - Get single property by ID
- `POST /api/properties/search-by-area` - Search properties by geographic area
- `POST /api/properties` - Create new property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### AI Predictions (`/api/predict`)
- `POST /api/predict/price` - Generate price prediction
- `GET /api/predict/factors` - Get prediction factors information
- `GET /api/predict/market-trends` - Get market trends data

### User Management (`/api/users`)
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/change-password` - Change password (protected)
- `GET /api/users/favorites` - Get user's favorite properties (protected)
- `POST /api/users/favorites/:propertyId` - Add property to favorites (protected)
- `DELETE /api/users/favorites/:propertyId` - Remove from favorites (protected)
- `PUT /api/users/favorites/:propertyId/notes` - Update favorite notes (protected)

### Health Check
- `GET /api/health` - Server health status

## 🏗️ Architecture

### File Structure
```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── propertyController.ts
│   │   ├── predictionController.ts
│   │   └── userController.ts
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── properties.routes.ts
│   │   ├── prediction.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/          # Custom middleware
│   │   └── authMiddleware.ts
│   └── server.ts           # Main server file
├── prisma/                 # Database schema and migrations
├── dist/                   # Compiled TypeScript output
└── package.json
```

### Key Technologies
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **TypeScript** - Type safety
- **bcryptjs** - Password hashing

## 🔧 Development

### Code Structure Explanation

#### Controllers
Controllers contain the business logic for handling requests:
- **propertyController.ts** - Handles all property-related operations including CRUD, search, and filtering
- **predictionController.ts** - Manages AI price predictions and market analysis
- **userController.ts** - Handles user profile management and favorites

#### Routes
Routes define the API endpoints and connect them to controller functions:
- Each route file focuses on a specific domain (auth, properties, etc.)
- Routes include proper middleware for authentication where needed

#### Middleware
- **authMiddleware.ts** - Verifies JWT tokens and protects routes

### Database Schema

The Prisma schema includes comprehensive models:
- **users** - User accounts and authentication
- **properties** - Property listings with detailed information
- **property_images** - Property photo management
- **user_saved_listings** - User favorites/saved properties
- **ml_price_predictions** - AI price prediction results
- **features_and_amenities** - Property features
- And many more supporting models

### Adding New Features

1. **Add new controller function** in the appropriate controller file
2. **Create route** in the corresponding route file
3. **Update server.ts** if adding new route groups
4. **Add proper TypeScript types** for request/response data
5. **Include detailed comments** for beginners

## 🤖 AI Integration

The backend is set up to integrate with your Python ML model:

1. **Mock Implementation** - Currently uses mock data for predictions
2. **Integration Points** - Ready to connect to external ML services
3. **Data Storage** - Predictions can be stored for analytics

To integrate your actual ML model:
1. Update the `generatePricePrediction` function in `predictionController.ts`
2. Replace mock calls with actual HTTP requests to your Python service
3. Configure `ML_MODEL_API_URL` in your environment variables

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for secure password storage
- **CORS Configuration** - Proper cross-origin setup
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Comprehensive error management

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
DB_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
```

### Build Commands
```bash
npm run build  # Compile TypeScript
npm start      # Run production server
```

## 📝 Notes for Beginners

- **Controllers** contain the business logic - they process requests and return responses
- **Routes** are like a menu - they tell the server which controller to call for each URL
- **Middleware** runs before controllers - useful for authentication, logging, etc.
- **Prisma** is an ORM - it makes database operations easier and type-safe
- **JWT** tokens are like temporary tickets that prove a user is logged in
- **async/await** is used for database operations since they take time to complete

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check your `DB_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **JWT Errors**
   - Make sure `JWT_SECRET` is set in `.env`
   - Check token format in frontend requests

3. **CORS Errors**
   - Verify `FRONTEND_URL` matches your React app's URL
   - Check browser developer tools for specific CORS messages

4. **Prisma Errors**
   - Run `npx prisma generate` after schema changes
   - Check if migrations need to be applied

### Getting Help

- Check the console output for detailed error messages
- Use the `/api/health` endpoint to verify the server is running
- Enable development mode for detailed error stacks 
# Getting Started with EstateIQ Backend

Welcome! This guide will help you get the EstateIQ backend up and running. Don't worry if you're new to backend development - everything is explained step by step.

## 🎯 What You've Built

Your backend now includes:

✅ **User Authentication** - Users can register and log in securely  
✅ **Property Management** - Full CRUD operations for real estate listings  
✅ **AI Price Predictions** - Mock implementation ready for your ML model  
✅ **User Profiles & Favorites** - Users can save properties and manage profiles  
✅ **Geographic Search** - Search properties by map area  
✅ **Comprehensive Database Schema** - Ready for complex real estate data  

## 🚀 First Steps

### 1. Create Your Environment File
Create a `.env` file in the `backend` directory:

```bash
# Your PostgreSQL database connection
DB_URL=postgresql://username:password@localhost:5432/estateiq_db

# Secret key for JWT tokens (use a long, random string)
JWT_SECRET=your_very_long_secret_key_here_change_in_production

# Server settings
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# For future ML model integration
ML_MODEL_API_URL=http://localhost:5000/predict
```

### 2. Set Up Your Database
Make sure PostgreSQL is running, then:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations (if needed)
npm run db:migrate
```

### 3. Test Your Setup
```bash
# Check if everything is configured correctly
npm run setup

# If setup passes, start the development server
npm run dev
```

### 4. Test the API
Once running, test these endpoints in your browser or Postman:

- **Health Check**: `GET http://localhost:3001/api/health`
- **Get Properties**: `GET http://localhost:3001/api/properties`
- **Prediction Factors**: `GET http://localhost:3001/api/predict/factors`

## 📁 Understanding the Code Structure

```
backend/src/
├── controllers/          # The "brain" - business logic
│   ├── propertyController.ts     # Handles property operations
│   ├── predictionController.ts   # AI predictions (mock for now)
│   └── userController.ts         # User profiles & favorites
├── routes/              # The "menu" - URL endpoints
│   ├── auth.routes.ts           # /api/auth/* routes
│   ├── properties.routes.ts     # /api/properties/* routes
│   ├── prediction.routes.ts     # /api/predict/* routes
│   └── user.routes.ts           # /api/users/* routes
├── middleware/          # The "security guard"
│   └── authMiddleware.ts        # Checks if users are logged in
└── server.ts           # The "main entrance" - starts everything
```

### How It All Works Together

1. **Request comes in** → Server receives it
2. **Route matches** → Router decides which controller to call
3. **Middleware runs** → Authentication checks (if needed)
4. **Controller executes** → Business logic processes the request
5. **Database operation** → Prisma talks to PostgreSQL
6. **Response sent** → JSON data goes back to frontend

## 🔧 Key Features Explained

### 1. Property Management (`/api/properties`)

**What it does**: Manages real estate listings

**Key endpoints**:
- `GET /api/properties` - List properties with filters (city, price, type, etc.)
- `GET /api/properties/:id` - Get detailed property info
- `POST /api/properties/search-by-area` - Search by map coordinates

**Example request**:
```
GET /api/properties?city=București&minPrice=50000&maxPrice=200000&type=apartment
```

### 2. AI Price Predictions (`/api/predict`)

**What it does**: Provides property price predictions

**Current status**: Mock implementation - ready for your Python ML model

**Key endpoints**:
- `POST /api/predict/price` - Get price prediction for property details
- `GET /api/predict/factors` - Learn what affects prices
- `GET /api/predict/market-trends` - Market analysis data

**Integration ready**: See comments in `predictionController.ts` for connecting your ML model

### 3. User Management (`/api/users`)

**What it does**: User profiles and favorites

**Key endpoints**:
- `GET /api/users/profile` - Get user info
- `PUT /api/users/profile` - Update profile
- `GET /api/users/favorites` - Get saved properties
- `POST /api/users/favorites/:id` - Save a property

**Security**: All routes require authentication (JWT token)

### 4. Authentication (`/api/auth`)

**What it does**: User registration and login

**How it works**:
- Passwords are hashed with bcrypt (secure!)
- JWT tokens are issued for authenticated sessions
- Tokens expire after 1 hour (configurable)

## 🤖 Integrating Your Python ML Model

Your backend is ready to connect to your Python ML model. Here's how:

### Current Setup (Mock)
```typescript
// In predictionController.ts
const mockPrediction = await generateMockPrediction(predictionData);
```

### Integration Steps
1. **Start your Python ML service** (Flask/FastAPI)
2. **Update the prediction function**:
```typescript
// Replace mock with real API call
const response = await fetch(process.env.ML_MODEL_API_URL + '/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(predictionData)
});
```
3. **Configure environment**: Set `ML_MODEL_API_URL` in your `.env`

## 🗄️ Database Schema Highlights

Your Prisma schema includes:

- **properties** - Main property listings
- **property_images** - Photo management
- **users** - User accounts
- **user_saved_listings** - Favorites system
- **ml_price_predictions** - AI prediction storage
- **features_and_amenities** - Property features
- **countries** - Geographic data
- **macroeconomic_factor_types** - Economic indicators

## 🔍 Testing Your API

### Using Browser (GET requests only)
```
http://localhost:3001/api/health
http://localhost:3001/api/properties
http://localhost:3001/api/predict/factors
```

### Using Postman/Thunder Client
For POST requests like registration:
```
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "confirmPassword": "password123"
}
```

## 🚨 Common Issues & Solutions

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# On Mac: brew services list | grep postgresql
# On Windows: Check Services app
# On Linux: sudo systemctl status postgresql
```

### Environment Variables Not Loading
- Make sure `.env` is in the `backend` directory
- No spaces around the `=` sign
- No quotes around values unless they contain spaces

### Prisma Errors
```bash
# Regenerate Prisma client after schema changes
npm run db:generate

# Reset database if needed (⚠️ deletes all data)
npm run db:reset
```

### CORS Errors from Frontend
- Check `FRONTEND_URL` in `.env` matches your React app URL
- Common: `http://localhost:3000` (default React) vs `http://localhost:5173` (Vite)

## 🎯 Next Steps

1. **Connect your frontend** - Update your React app to use these endpoints
2. **Integrate your ML model** - Replace mock predictions with real ones
3. **Add sample data** - Insert some properties for testing
4. **Customize business logic** - Modify controllers for your specific needs
5. **Add more features** - The foundation is ready for anything!

## 📞 Need Help?

- **Check the logs** - The console shows detailed error messages
- **Use the health endpoint** - `GET /api/health` confirms the server is running
- **Read the comments** - Every file has detailed explanations
- **Test incrementally** - Start with simple GET requests, then try POST

## 🏆 What You've Accomplished

You now have a **production-ready backend** with:
- Secure authentication
- Comprehensive API
- Database integration
- AI prediction framework
- User management
- Geographic search capabilities

**Congratulations!** You've built the foundation for a sophisticated real estate platform. 🎉 
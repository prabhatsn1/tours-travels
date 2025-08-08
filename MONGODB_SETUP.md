# MongoDB Integration Setup Guide

This guide will help you set up MongoDB for your travel agency website.

## Prerequisites

- Node.js installed
- MongoDB Atlas account (for cloud database) OR local MongoDB installation

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tours-travels
MONGODB_DB=tours-travels

# For MongoDB Atlas (production), use this format:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tours-travels?retryWrites=true&w=majority

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. MongoDB Atlas Setup (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env.local`

### 3. Local MongoDB Setup (Development)

If you prefer local development:

```bash
# Install MongoDB using Homebrew (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# MongoDB will be available at mongodb://localhost:27017
```

### 4. Seed the Database

Run the seeding script to populate your database with sample data:

```bash
npm run db:seed
```

This will:

- Connect to your MongoDB database
- Clear any existing data
- Insert 6 sample destinations
- Insert 5 sample tour packages
- Create necessary indexes for better performance

### 5. Verify Setup

1. Start your development server:

```bash
npm run dev
```

2. Visit the following pages to see data loaded from MongoDB:

   - `http://localhost:3000/packages` - Tour packages from MongoDB
   - `http://localhost:3000/destinations` - Destinations from MongoDB

3. Check the browser network tab to see API calls to `/api/packages` and `/api/destinations`

## API Endpoints

Your application now includes the following MongoDB-powered API endpoints:

### Tour Packages

- `GET /api/packages` - Get all packages (with filtering, pagination, search)
- `POST /api/packages` - Create new package
- `GET /api/packages/[id]` - Get specific package
- `PUT /api/packages/[id]` - Update package
- `DELETE /api/packages/[id]` - Delete package

### Destinations

- `GET /api/destinations` - Get all destinations (with filtering, pagination, search)
- `POST /api/destinations` - Create new destination
- `GET /api/destinations/[id]` - Get specific destination
- `PUT /api/destinations/[id]` - Update destination
- `DELETE /api/destinations/[id]` - Delete destination (soft delete)

### Query Parameters for GET /api/packages:

- `category` - Filter by category (Adventure, Cultural, etc.)
- `difficulty` - Filter by difficulty (Easy, Moderate, Challenging)
- `minPrice` / `maxPrice` - Price range filtering
- `featured` - Show only featured packages
- `search` - Text search across title, description, destination
- `sortBy` - Sort field (price, rating, createdAt, etc.)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page

### Query Parameters for GET /api/destinations:

- `region` - Filter by region (Asia, Europe, etc.)
- `minPrice` / `maxPrice` - Price range filtering
- `featured` - Show only featured destinations
- `tags` - Filter by tags (comma-separated)
- `search` - Text search across name, country, description
- `sortBy` - Sort field (name, price, rating, etc.)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page

## Database Models

### TourPackage Model

Complete tour package information including:

- Basic details (title, destination, price, duration)
- Detailed descriptions and highlights
- Itinerary with daily activities
- Group size and difficulty level
- Images and ratings
- Timestamps and featured status

### Destination Model

Complete destination information including:

- Basic details (name, country, region, description)
- Geographic coordinates for mapping
- Highlights and best time to visit
- Pricing and rating information
- Tags for categorization
- Featured status and activity flag

### Additional Models (Created but not yet implemented)

- User - User authentication and profiles
- Booking - Tour bookings and reservations
- Review - Package and destination reviews and ratings
- Inquiry - Customer inquiries and support

## Features Included

### Database Features

- Full CRUD operations for packages and destinations
- Advanced filtering and search capabilities
- Pagination support
- Text search with relevance scoring
- Geospatial indexing for location-based queries
- Optimized indexes for better performance
- Data validation and error handling
- Soft delete functionality

### API Features

- RESTful API design
- Comprehensive error handling
- Input validation
- Structured JSON responses
- Query parameter filtering
- Sorting and pagination
- Search functionality

### Frontend Integration

- API integration with React components
- Loading states and error handling
- Real-time search and filtering
- Responsive design
- Server-side data fetching

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your MongoDB URI is correct in `.env.local`
2. **Authentication Error**: Verify your MongoDB Atlas credentials
3. **Empty Results**: Run the seeding script to populate sample data
4. **Port Conflicts**: Ensure MongoDB is running on the correct port (27017 by default)

### Debug Commands

```bash
# Check if MongoDB is running (local)
brew services list | grep mongodb

# Test database connection
npm run db:seed

# Check API endpoints
curl http://localhost:3000/api/packages
curl http://localhost:3000/api/destinations
```

## Next Steps

1. Implement user authentication
2. Add booking functionality
3. Create admin dashboard for content management
4. Add review and rating system
5. Implement payment integration
6. Add email notifications
7. Create mobile app integration

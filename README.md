# 🌍 Tours & Travels - Complete Travel Management Platform

A modern, full-stack travel booking and management platform built with **Next.js 15**, **TypeScript**, **MongoDB**, and **Material-UI**. This application provides a comprehensive solution for tour operators and travelers with features ranging from package browsing to admin management.

## ✨ Features

### 🎯 Core Features

- **Tour Package Management** - Browse, search, and filter travel packages
- **Destination Explorer** - Discover amazing travel destinations worldwide
- **Admin Dashboard** - Complete CRUD operations for packages and destinations
- **Blog System** - Travel stories and destination guides
- **Advanced Search** - Text search with relevance scoring and filtering
- **Responsive Design** - Mobile-first approach with Material-UI components
- **Modern UI/UX** - Smooth animations with Framer Motion

### 🔧 Technical Features

- **MongoDB Integration** - Complete database setup with Mongoose ODM
- **RESTful API** - Well-structured API endpoints with error handling
- **TypeScript** - Full type safety across the application
- **Server-Side Rendering** - Next.js App Router with SSR support
- **Form Validation** - React Hook Form with Yup/Zod validation
- **Geospatial Queries** - Location-based search capabilities
- **Data Seeding** - Automated database population scripts

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tours-travels
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/tours-travels
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tours-travels

   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NODE_ENV=development
   ```

4. **Database Setup**

   ```bash
   # Seed the database with sample data
   npm run db:seed

   # Reset and reseed the database
   npm run db:reset
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── packages/      # Tour packages endpoints
│   │   ├── destinations/  # Destinations endpoints
│   │   └── blog/         # Blog endpoints
│   ├── admin/            # Admin dashboard pages
│   ├── packages/         # Package browsing pages
│   ├── destinations/     # Destination pages
│   └── blog/            # Blog pages
├── components/           # Reusable components
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── lib/                 # Utilities and configurations
│   ├── models/          # MongoDB schemas
│   ├── api.ts           # API client functions
│   ├── mongodb.ts       # Database connection
│   └── theme.ts         # Material-UI theme
├── types/               # TypeScript type definitions
├── data/                # Sample data and constants
└── scripts/             # Database seeding scripts
```

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI v7** - Component library and design system
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Document database
- **Mongoose** - ODM for MongoDB
- **Zod/Yup** - Schema validation

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Tailwind CSS** - Utility-first CSS

## 📊 Database Models

### Tour Packages

- Package details (title, destination, price, duration)
- Itinerary with daily activities
- Images, ratings, and reviews
- Group size and difficulty levels
- Featured status and categories

### Destinations

- Destination information and highlights
- Geographic coordinates for mapping
- Best time to visit and pricing
- Tags and categorization

### Blog Posts

- Travel stories and guides
- SEO-friendly slugs
- Rich content support

## 🔌 API Endpoints

### Packages

- `GET /api/packages` - Get all packages (with filtering/pagination)
- `POST /api/packages` - Create new package
- `GET /api/packages/[id]` - Get specific package
- `PUT /api/packages/[id]` - Update package
- `DELETE /api/packages/[id]` - Delete package

### Destinations

- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create new destination
- `GET /api/destinations/[id]` - Get specific destination
- `PUT /api/destinations/[id]` - Update destination
- `DELETE /api/destinations/[id]` - Delete destination

### Blog

- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new post
- `GET /api/blog/[slug]` - Get specific post

## 🎨 Key Pages

- **Homepage** (`/`) - Featured packages and search functionality
- **Packages** (`/packages`) - Browse all tour packages
- **Package Details** (`/packages/[id]`) - Detailed package information
- **Destinations** (`/destinations`) - Explore destinations
- **Blog** (`/blog`) - Travel stories and guides
- **Admin Dashboard** (`/admin`) - Package and content management
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset and reseed database
```

## 📝 Environment Variables

Create a `.env.local` file with:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed on any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Material-UI](https://mui.com) - Component library
- [MongoDB](https://mongodb.com) - Database platform
- [Vercel](https://vercel.com) - Deployment platform

---

**Built with ❤️ for travel enthusiasts worldwide**

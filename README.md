<div align="center">

<pre>
  ____            _            _   ____                  _ _                 
 |  _ \          | |          | | |  _ \                | | |                
 | |_) |_   _  __| | __ _  ___| |_| |_) | __ _ _ __   __| | |__   __ _ _ __  
 |  _ <| | | |/ _` |/ _` |/ _ \ __|  _ < / _` | '_ \ / _` | '_ \ / _` | '_ \ 
 | |_) | |_| | (_| | (_| |  __/ |_| |_) | (_| | | | | (_| | | | | (_| | | | |
 |____/ \__,_|\__,_|\__, |\___|\__|____/ \__,_|_| |_|\__,_|_| |_|\__,_|_| |_|
                     __/ |                                                   
                    |___/                                                    
</pre>

### "Bandhan budget ka, sukoon dil ka"
*(The bond of budget, peace of heart)*

**AI-Powered Wedding Budget Estimator**

---
</div>

## 📖 About the Project

**BudgetBandhan** is an AI-powered wedding budget estimation platform designed specifically for the Indian wedding market. The name combines "Budget" with "Bandhan" (बंधन - meaning bond/marriage in Hindi), symbolizing the union of smart financial planning with wedding celebrations. 

It helps wedding planners and couples create data-driven budgets by factoring in city, venue tier, guest count, decor preferences, and artist costs.

## ⚠️ Problem Statement

Wedding budget planning in India relies on intuition and past experience rather than data. Planners and couples struggle with:
- No centralized tool that factors in city, venue tier, guest count, and decor preferences
- 40% of budget (food) directly tied to guest lists that change dynamically
- Decor costs vary 10x based on style but no database exists
- Artist pricing is opaque and varies by city
- No way to visualize budget impact of different choices
- Existing tools are either too generic or not India-specific

## 💡 Solution Overview

BudgetBandhan provides a comprehensive platform with:
1. **Smart Budget Estimator** - Multi-step wizard collecting wedding parameters with city/venue-based calculations
2. **Decor Intelligence Library** - Curated decor images with cost tagging and AI-powered estimation
3. **Artist Cost Database** - Searchable database of artists with fee ranges by city and type
4. **Guest Manager** - RSVP tracking that auto-updates food and logistics costs
5. **Logistics Engine** - Transfer cost calculation, Ghodi/Dholi/SFX estimation
6. **F&B Module** - Per-head costing with bar packages and specialty counters
7. **Budget Reports** - PDF/Excel export with itemized breakdowns and confidence indicators
8. **Admin Dashboard** - Manage artists, decor images, and base costs

## 🛠 Tech Stack

### 🎨 Frontend
- **ReactJS** - UI library with functional components and hooks
- **Tailwind CSS** - Utility-first styling with dark mode support
- **React Router v6** - Client-side routing and navigation
- **Context API** - Global state management (auth, theme, wedding parameters)
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form validation and handling
- **jsPDF / ExcelJS** - Report generation

### ⚙️ Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for REST APIs
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### 🗄️ Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for data modeling
- **GridFS** - Storage for decor images

### 🔧 Development Tools
- **Git** - Version control
- **Postman** - API testing
- **VSCode** - Code editor

## ✨ Features

### 1. 🛡️ Authentication System
- Planner registration and login
- Admin role with elevated privileges
- JWT-based protected routes
- Session persistence with localStorage

### 2. 🪄 Smart Input Wizard
- Multi-step form with validation
- City selection (Mumbai, Delhi, Jaipur, Bangalore, Udaipur)
- Hotel tier selection (5-star palace / 5-star city / 4-star / resort / farmhouse)
- Room block count, guest count, outstation percentage
- Number of wedding functions
- Progress indicator and navigation between steps

### 3. 🌺 Decor Intelligence Library
- Grid view with lazy loading and pagination
- Filter by function type (Mehendi/Sangeet/Wedding/Reception)
- Filter by style (Traditional/Contemporary/Fusion/Luxury)
- Filter by budget range
- Image upload for admin with tagging interface
- "Select for my wedding" functionality
- Budget auto-updates based on selected decor

### 4. 🎤 Artist Cost Database
- CRUD operations for artist management
- Artist categories: Singer, Live Band, DJ, Folk Artist, Choreographer, Anchor
- Named artists with fee ranges
- Generic tier options for local artists
- Search by name/type and sort by fee
- Integration with budget calculator

### 5. 🚗 Logistics Cost Engine
- Transfer cost based on guest count and outstation percentage
- Configurable vehicle capacity (Innova Crysta: 3 guests per vehicle)
- Distance calculation via Google Maps API
- Ghodi (baraat horse) fixed cost by city
- Dholi cost by number and hours
- SFX cost estimator (cold pyro, confetti cannons)

### 6. 🍽️ F&B Budget Module
- Per-head cost by meal type (Welcome Dinner/Lunch Buffet/Gala Dinner/Floating Snacks)
- Bar package options (dry/beer-wine/full bar)
- Specialty counter add-ons (Chaat, Mocktail, Ice Cream, Tea-Coffee)
- Catering staff cost calculation
- Crockery and linen rental estimates
- Real-time updates based on RSVP count

### 7. 👥 Guest Management
- Add guests individually or bulk import
- RSVP tracking (Yes/No/Maybe/Pending)
- Dietary preference capture
- Outstation guest flag for logistics
- Search and filter guests
- Pagination for large guest lists
- Auto-calculation: Food cost = Confirmed guests × Per-head rate

### 8. 📊 Budget Output & Reporting
- Real-time budget dashboard
- Itemized breakdown across all cost heads
- Low/Mid/High range per item
- Overall budget range with confidence indicator
- Scenario comparison (save and compare versions)
- Export to PDF with professional formatting
- Export to Excel for further analysis
- Budget tracker to log actuals vs. estimates

### 9. 🎛️ Admin Dashboard
- Secure admin-only routes
- Artist database management (CRUD)
- Decor image upload with tagging interface
- Base cost configuration by city and venue tier
- User management (view planners)
- Usage analytics dashboard

### 10. 🌓 Theme Support
- Dark mode / Light mode toggle
- Persist preference in localStorage
- Tailwind CSS dark mode classes
- Smooth transitions between themes

### 11. 📱 Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive tables and grids
- Touch-friendly form inputs
- Optimized for all screen sizes

### 12. 🚨 Error Handling
- 404 page for unknown routes
- Error boundaries for component crashes
- User-friendly error messages
- Loading states with skeleton screens
- Try-catch blocks with fallback UI

<br>

<div align="center">
  <p>Built with ❤️ for Indian Weddings</p>
  <p>&copy; 2026 BudgetBandhan. All rights reserved.</p>
</div>


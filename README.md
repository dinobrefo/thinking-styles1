# ThinkAlign - Cognitive Profile Assessment Platform

A comprehensive web application for assessing and analyzing thinking styles, designed specifically for the Ghanaian education system. ThinkAlign helps students, teachers, parents, and counselors understand cognitive profiles and provides personalized recommendations for academic and career paths.

## 🌟 Features

### 🎯 Core Functionality
- **Comprehensive Assessment**: Multi-dimensional thinking style evaluation
- **Personalized Reports**: Detailed cognitive profile analysis with insights
- **Ghana Education Mapping**: Tailored recommendations for SHS tracks and tertiary programs
- **Career Guidance**: AI-powered suggestions based on cognitive strengths
- **Multi-Role Support**: Students, teachers, parents, counselors, and administrators

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Cyberpunk/neon theme with glowing effects
- **Theme Switcher**: Multiple beautiful themes (Ocean, Forest, Purple, Warm, Minimal)
- **Glassmorphism Design**: Modern glass-like interface elements
- **Smooth Animations**: Framer Motion powered transitions

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for different user types
- **Password Security**: Bcrypt hashing with visibility toggles
- **CORS Protection**: Secure cross-origin resource sharing

### 📊 Analytics & Reports
- **PDF Export**: Download comprehensive reports
- **Visual Charts**: Interactive assessment result visualizations
- **Progress Tracking**: Monitor cognitive development over time
- **Reflection System**: User feedback and rating system

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Create React App** for development
- **Framer Motion** for animations
- **Axios** for API communication
- **React Router DOM** for navigation
- **CSS3** with custom properties and gradients

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests

### Development Tools
- **Nodemon** for auto-restart
- **TypeScript** compilation
- **ESLint** for code quality
- **Git** for version control

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/thinking-styles-assessment.git
cd thinking-styles-assessment
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/thinking_styles
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3002
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

Start the frontend development server:
```bash
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

## 🎭 User Roles

### 👨‍🎓 Student
- Take thinking style assessments
- View personalized reports
- Access career recommendations
- Track progress over time

### 👩‍🏫 Teacher
- Monitor student progress
- Generate class reports
- Access teaching resources
- Manage student assessments

### 👨‍👩‍👧‍👦 Parent
- View child's assessment results
- Access guidance materials
- Track academic development
- Communicate with counselors

### 🎯 Counselor
- Generate detailed reports
- Provide personalized guidance
- Access analytics dashboard
- Manage multiple students

### 👨‍💼 Administrator
- System-wide analytics
- User management
- Report generation
- System configuration

## 🧠 Assessment Framework

The assessment evaluates multiple cognitive dimensions:

1. **Analytical Thinking**: Logical reasoning and problem-solving
2. **Creative Thinking**: Innovation and ideation abilities
3. **Practical Thinking**: Real-world application skills
4. **Social Thinking**: Interpersonal and communication skills
5. **Emotional Intelligence**: Self-awareness and empathy
6. **Learning Styles**: Visual, auditory, and kinesthetic preferences

## 🎨 Themes Available

- **🌊 Ocean Theme**: Calming blues and teals
- **🌲 Forest Theme**: Natural greens and earth tones
- **💜 Purple Theme**: Royal purples and magentas
- **🔥 Warm Theme**: Cozy oranges and reds
- **🌙 Dark Theme**: Cyberpunk neon with glowing effects
- **⚪ Minimal Theme**: Clean whites and grays

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with advanced layouts
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined mobile experience

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-profile` - Update user profile

### Assessments
- `GET /api/assessments/questions` - Get assessment questions
- `POST /api/assessments/submit` - Submit assessment
- `GET /api/assessments/my-assessments` - Get user's assessments

### Reports
- `POST /api/assessments/generate-report` - Generate report
- `GET /api/reports/my-reports` - Get user's reports
- `GET /api/reports/:id` - Get specific report
- `POST /api/reports/:id/reflection` - Submit reflection

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean)
4. Run database migrations

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, GitHub Pages)
3. Update API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ghana Education Service for educational framework guidance
- React and Node.js communities for excellent documentation
- All contributors and testers

## 📞 Support

For support, email support@thinkalign.gh or create an issue in this repository.

---

**ThinkAlign** - Discover Your Cognitive Profile and Unlock Your Potential! 🚀
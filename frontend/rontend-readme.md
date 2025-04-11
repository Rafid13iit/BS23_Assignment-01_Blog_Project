# Blog Platform Frontend

A React-based frontend for the Blog Platform application. This frontend interfaces with the Django REST API backend.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/          # Static assets like images
│   ├── components/      # Reusable UI components
│   │   ├── Authentication/
│   │   ├── ConfirmationModal/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── PostForm.jsx
│   ├── context/         # React context providers
│   │   └── AppContext.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   └── useBlog.js
│   ├── layouts/         # Layout components
│   │   ├── MainWrapper.jsx
│   │   └── PrivateRoute.jsx
│   ├── utils/           # Utility functions
│   │   └── validationSchemas.js
│   ├── views/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   │   ├── CreatePassword.jsx
│   │   │   ├── EmailVerify.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/  # Page-specific components
│   │   ├── core/        # Core application pages
│   │   │   └── Index.jsx
│   │   ├── dashboard/   # User dashboard pages
│   │   │   ├── AddPost.jsx
│   │   │   ├── Comments.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   └── Profile.jsx
│   │   └── pages/       # Static pages
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       └── NotFoundPage.jsx
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore file
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:8000  # Backend API URL
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Features

- User authentication (register, login, email verification)
- Blog post management (create, read, update, delete)
- Comment system with nested replies
- User dashboard
- Responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Connecting to Backend

This frontend is designed to work with the Django REST API backend. Ensure the backend server is running and the `VITE_API_URL` environment variable is set correctly.

## Technologies Used

- React
- React Router
- Axios
- React Hook Form
- Context API for state management
- Custom hooks for API interactions

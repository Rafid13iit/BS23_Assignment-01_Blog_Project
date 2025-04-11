# Blog Platform

A full-stack blog application with user authentication, content management, and interactive features.

## Overview

This project is a modern blog platform built with a Django REST API backend and a React frontend. It enables users to create accounts, publish blog posts, and engage with content through comments and replies.

## Key Features

- **Secure Authentication System**: JWT-based authentication with email verification
- **Content Management**: Create, edit, and publish blog posts with draft mode
- **Interactive Comments**: Nested comment system with replies
- **User Dashboard**: Personalized interface for managing content
- **Responsive Design**: Mobile-friendly interface across devices

## Project Components

This is a full-stack application composed of two main parts:

- **Backend**: Django REST API (see [backend/README.md](./backend/README.md) for details)
- **Frontend**: React application (see [frontend/README.md](./frontend/README.md) for details)

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Set up the backend:
```bash
cd backend
# Follow instructions in backend/README.md
```

3. Set up the frontend:
```bash
cd frontend
# Follow instructions in frontend/README.md
```

4. Access the application:
   - Backend API: http://localhost:8000
   - Frontend application: http://localhost:5173

## Project Structure

```
project/
├── backend/       # Django REST API
└── frontend/      # React application
```

## Development Workflow

1. Start the backend server
2. Start the frontend development server
3. Make changes to either component as needed
4. Test API endpoints using the Django development server or tools like Postman

## Deployment Considerations

- Configure proper environment variables for production
- Set up a production database (PostgreSQL recommended)
- Configure CORS settings for cross-domain requests
- Set up proper email service for production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

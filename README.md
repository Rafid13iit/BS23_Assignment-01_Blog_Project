# Blog Platform

A full-stack blog application with user authentication, content management, and interactive features.

# 🚀 Live App

You can check out the live version of the project here:

🔗 [Live App Link](https://blog-app-21s5.onrender.com)

> Hosted on: Render (Both Frontend & Backend)

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

- **Backend**: Django REST API (see [backend/README.md](./backend/backend-readme.md) for details)
- **Frontend**: React application (see [frontend/README.md](./frontend/frontend-readme.md) for details)

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

## Docker Setup (Recommended)

The easiest way to run this application is using Docker, which packages everything needed to run the app.

### Prerequisites for Docker
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Run with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

4. To stop the application:
```bash
docker-compose down
```

### Build and Run Individual Containers

Alternatively, you can build and run the containers separately:

```bash
# Build and run the backend
docker build -t blog-backend ./backend
docker run -p 8000:8000 -d blog-backend

# Build and run the frontend
docker build -t blog-frontend ./frontend
docker run -p 5173:5173 -d blog-frontend
```

## Project Structure

```
project/
├── backend/          # Django REST API
├── frontend/         # React application
├── docker-compose.yml
├── .dockerignore
└── README.md
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
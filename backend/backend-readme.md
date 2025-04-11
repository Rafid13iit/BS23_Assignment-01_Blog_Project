# Blog Platform Backend

A RESTful API for a blog platform built with Django and Django REST Framework. This backend system provides authentication with JWT, blog management, and commenting functionality.

## Features

### User Authentication
- Custom user model with JWT authentication
- Email verification system via 6-digit PIN
- User registration and login via API
- Password change functionality for authenticated users

### Blog Management
- Create, read, update, and delete blog posts
- Blog status modes: draft (private) and published (public)
- Slug-based URL generation for blog posts
- User-specific blog management (users can only edit/delete their own blogs)

### Comments and Replies
- Comment on blog posts
- Replies to comments
- Retrieve comments and replies for blog posts

### Contact Form
- Send emails through a contact form API endpoint


## Getting Started

### Prerequisites

- Python 3.8+
- Pip package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create a virtual environment and activate it
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env` file in the root directory and add the following:
```
SECRET_KEY=your_secret_key
DEBUG=True
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
```

5. Run migrations
```bash
python manage.py migrate
```

6. Create a superuser
```bash
python manage.py createsuperuser
```

7. Run the development server
```bash
python manage.py runserver
```

## Running the Backend

### Development Server

To run the Django development server:

```bash
python manage.py runserver
```

This will start the server on http://127.0.0.1:8000/

To specify a different port:

```bash
python manage.py runserver 8080
```

### Email Configuration

For the email verification and notification system to work properly, ensure your `.env` file has the correct email settings:

```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com  # Example for Gmail
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

For Gmail, you may need to use an "App Password" rather than your regular password.

### Database Management

- **Creating migrations after model changes**:
  ```bash
  python manage.py makemigrations
  ```

- **Applying migrations**:
  ```bash
  python manage.py migrate
  ```

- **Resetting a specific app's migrations**:
  ```bash
  python manage.py migrate blogs zero  # Replace 'blogs' with app name
  ```

### Django Admin Interface

Access the Django admin interface at http://127.0.0.1:8000/admin/ using your superuser credentials.

### Testing API Endpoints

You can test the API endpoints using:

1. **Browser** - For GET requests, simply navigate to the endpoint URL
2. **Postman** - For all types of requests
3. **cURL** - For command-line testing

Example cURL request to get all blogs:
```bash
curl -X GET http://127.0.0.1:8000/blogs/
```

Example cURL request with authentication:
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://127.0.0.1:8000/blogs/user/
```

### Debugging

If you encounter issues:

1. Check the Django development server console for error logs
2. Ensure your `.env` file has the correct settings
3. Validate that all dependencies are installed correctly
4. Verify that your database migrations are up to date

## API Endpoints

### User Authentication

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/users/register/` | POST | Register a new user | No |
| `/users/verify/` | POST | Verify user email with OTP | No |
| `/users/login/` | POST | User login | No |
| `/users/token/` | POST | Get JWT tokens | No |
| `/users/token/refresh/` | POST | Refresh JWT token | No |
| `/users/token/verify/` | POST | Verify JWT token | No |
| `/users/dashboard/` | GET | Get user dashboard | Yes |
| `/users/changepassword/` | POST | Change user password | Yes |
| `/users/is-auth/` | GET | Check if user is authenticated | Yes |

### Blog Management

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/blogs/` | GET | Get all published blogs | No |
| `/blogs/user/` | GET | Get user's blogs | Yes |
| `/blogs/create/` | POST | Create a new blog | Yes |
| `/blogs/<slug>/` | GET | Get a specific blog | No |
| `/blogs/delete/` | POST | Delete a blog | Yes |
| `/blogs/update/` | POST | Update a blog | Yes |

### Comments and Replies

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/blogs/comment/<blog_id>/` | GET | Get comments for a blog | No |
| `/blogs/comment/<blog_id>/` | POST | Add a comment to a blog | Yes |
| `/blogs/reply/<comment_id>/` | GET | Get replies for a comment | No |
| `/blogs/reply/<comment_id>/` | POST | Add a reply to a comment | Yes |

### Contact Form

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/contact/` | POST | Send a contact form email | No |

## Request & Response Examples

### User Registration

**Request:**
```json
POST /users/register/
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "password2": "password123"
}
```

**Response:**
```json
{
  "token": {
    "refresh": "refresh_token",
    "access": "access_token"
  },
  "status": "200",
  "message": "User registered successfully, check mail please",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  }
}
```

### Verify Email

**Request:**
```json
POST /users/verify/
{
  "email": "user@example.com",
  "email_otp": "123456"
}
```

**Response:**
```json
{
  "status": "200",
  "message": "User verified successfully",
  "data": {}
}
```

### Create Blog Post

**Request:**
```json
POST /blogs/create/
{
  "title": "Sample Blog Post",
  "subtitle": "A sample subtitle",
  "content": "This is the content of the blog post.",
  "status": "published"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Sample Blog Post",
  "slug": "sample-blog-post",
  "subtitle": "A sample subtitle",
  "content": "This is the content of the blog post.",
  "published_date": "2023-10-10T12:00:00Z",
  "status": "published",
  "author": {
    "id": 1,
    "username": "username",
    "email": "user@example.com"
  }
}
```

## Authentication

This API uses JSON Web Tokens (JWT) for authentication. To authenticate your requests:

1. Obtain tokens by logging in or registering
2. Include the access token in the Authorization header:
   ```
   Authorization: Bearer <your-access-token>
   ```
3. Refresh tokens when they expire using the `/users/token/refresh/` endpoint


## Troubleshooting

### Common Issues

1. **Email verification not working**
   - Check your email settings in the `.env` file
   - Ensure your email provider allows SMTP access
   - For Gmail, enable "Less secure app access" or use App Password

2. **JWT authentication issues**
   - Ensure your tokens are not expired
   - Check that you're using the format: `Bearer <token>`
   - Verify that the token is being sent in the Authorization header

3. **Database migration errors**
   - Try resetting migrations: `python manage.py migrate <app_name> zero`
   - Then recreate migrations: `python manage.py makemigrations`
   - Apply migrations: `python manage.py migrate`

4. **Server errors (500)**
   - Check the server logs for detailed error messages
   - Ensure DEBUG=True in development settings
   - Verify all required environment variables are set


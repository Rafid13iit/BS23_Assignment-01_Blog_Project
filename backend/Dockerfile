FROM python:3.10-slim

WORKDIR /app/backend

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Run migrations and start server
CMD python manage.py migrate && \
    python manage.py collectstatic --no-input && \
    gunicorn backend.wsgi:application --bind 0.0.0.0:8000
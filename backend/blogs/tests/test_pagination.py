from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from blogs.pagination import CustomPageNumberPagination
from blogs.models import BlogPost
from users.models import CustomUser
from blogs.serializers import BlogPostSerializer
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from collections import OrderedDict

class CustomPaginationTestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create 20 blog posts
        for i in range(20):
            BlogPost.objects.create(
                title=f'Test Post {i}',
                slug=f'test-post-{i}',
                content=f'Content for test post {i}',
                author=self.user,
                status='published'
            )
        
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.paginator = CustomPageNumberPagination()
        
    def test_pagination_page_size(self):
        """Test that page size is correctly set"""
        self.assertEqual(self.paginator.page_size, 6)
        self.assertEqual(self.paginator.page_size_query_param, 'page_size')
        self.assertEqual(self.paginator.max_page_size, 100)
        
    def test_pagination_response_structure(self):
        """Test that pagination response contains the correct structure"""
        request = self.factory.get('/blogs/')
        request = Request(request)
        queryset = BlogPost.objects.all().order_by('-published_date')
        
        # Paginate the queryset
        page = self.paginator.paginate_queryset(queryset, request)
        serializer = BlogPostSerializer(page, many=True)
        response = self.paginator.get_paginated_response(serializer.data)
        
        # Check response structure
        self.assertIn('count', response.data)
        self.assertIn('total_pages', response.data)
        self.assertIn('current_page', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('results', response.data)
        
        # Check counts
        self.assertEqual(response.data['count'], 20)  # Total 20 blogs
        self.assertEqual(response.data['total_pages'], 4)  # 20 items with page_size=6 → 4 pages
        self.assertEqual(response.data['current_page'], 1)  # First page
        
    def test_pagination_with_custom_page_size(self):
        """Test pagination with custom page size parameter"""
        request = self.factory.get('/blogs/', {'page_size': '10'})
        request = Request(request)
        queryset = BlogPost.objects.all().order_by('-published_date')
        
        # Set custom page size
        self.paginator.page_size = 10
        
        # Paginate the queryset
        page = self.paginator.paginate_queryset(queryset, request)
        serializer = BlogPostSerializer(page, many=True)
        response = self.paginator.get_paginated_response(serializer.data)
        
        # Check counts with new page size
        self.assertEqual(response.data['count'], 20)  # Total 20 blogs
        self.assertEqual(response.data['total_pages'], 2)  # 20 items with page_size=10 → 2 pages
        self.assertEqual(len(response.data['results']), 10)  # 10 items per page
        
    def test_pagination_with_invalid_page(self):
        """Test pagination with invalid page parameter"""
        request = self.factory.get('/blogs/', {'page': '999'})
        request = Request(request)
        queryset = BlogPost.objects.all().order_by('-published_date')
        
        response = self.paginator.generate_response(queryset, BlogPostSerializer, request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'No results found for the requested page')
        
    def test_generate_response_method(self):
        """Test the generate_response method"""
        request = self.factory.get('/blogs/')
        request = Request(request)
        queryset = BlogPost.objects.all().order_by('-published_date')
        
        response = self.paginator.generate_response(queryset, BlogPostSerializer, request)
        
        # Check response structure
        self.assertIn('count', response.data)
        self.assertIn('total_pages', response.data)
        self.assertIn('current_page', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('results', response.data)
        
        # Check data count
        self.assertEqual(len(response.data['results']), 6)  # 6 items per page
        
    def test_pagination_through_api(self):
        """Test pagination through the API endpoint"""
        url = reverse('blogs')
        
        # Get first page
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 20)
        self.assertEqual(len(response.data['results']), 6)
        self.assertEqual(response.data['current_page'], 1)
        
        # Get second page
        response = self.client.get(url + '?page=2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 6)
        self.assertEqual(response.data['current_page'], 2)
        
        # Get custom page size
        response = self.client.get(url + '?page_size=10')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)
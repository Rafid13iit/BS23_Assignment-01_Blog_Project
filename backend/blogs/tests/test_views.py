from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from blogs.models import BlogPost, Comment
from users.models import CustomUser
from blogs.serializers import BlogPostSerializer
import json
from django.utils.text import slugify


class GetAllBlogsViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Creating some test blogs
        self.blog1 = BlogPost.objects.create(
            title="Test Blog 1",
            slug="test-blog-1",
            content="Test content 1",
            status="published",
            author=self.user
        )
        
        self.blog2 = BlogPost.objects.create(
            title="Test Blog 2",
            slug="test-blog-2",
            content="Test content 2",
            status="published",
            author=self.user
        )
        
        self.blog3 = BlogPost.objects.create(
            title="Draft Blog",
            slug="draft-blog",
            content="Draft content",
            status="draft",
            author=self.user
        )
        
        self.url = reverse('blogs')

    def test_get_all_published_blogs(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Checking that only published blogs are returned
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2)
        
        # Checking that the draft blog is not included
        slugs = [blog['slug'] for blog in response.data['results']]
        self.assertIn('test-blog-1', slugs)
        self.assertIn('test-blog-2', slugs)
        self.assertNotIn('draft-blog', slugs)


class GetUserBlogsViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            username='user1',
            password='password1'
        )
        
        self.user2 = CustomUser.objects.create_user(
            email='user2@example.com',
            username='user2',
            password='password2'
        )
        
        # Creating blogs for user1
        self.blog1 = BlogPost.objects.create(
            title="User1 Blog 1",
            slug="user1-blog-1",
            content="User1 content 1",
            author=self.user1
        )
        
        self.blog2 = BlogPost.objects.create(
            title="User1 Blog 2",
            slug="user1-blog-2",
            content="User1 content 2",
            author=self.user1
        )
        
        # Creating a blog for user2
        self.blog3 = BlogPost.objects.create(
            title="User2 Blog",
            slug="user2-blog",
            content="User2 content",
            author=self.user2
        )
        
        self.url = reverse('user-blogs')

    def test_get_user_blogs_authenticated(self):
        # Logging in as user1
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Checking that only user1's blogs are returned
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2)
        
        slugs = [blog['slug'] for blog in response.data['results']]
        self.assertIn('user1-blog-1', slugs)
        self.assertIn('user1-blog-2', slugs)
        self.assertNotIn('user2-blog', slugs)

    def test_get_user_blogs_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CreateBlogViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        self.url = reverse('create-blog')
        self.valid_payload = {
            'title': 'New Test Blog',
            'content': 'This is test content for a new blog post',
            'status': 'published'
        }

    def test_create_blog_authenticated(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BlogPost.objects.count(), 1)
        
        blog = BlogPost.objects.get()
        self.assertEqual(blog.title, 'New Test Blog')
        self.assertEqual(blog.slug, 'new-test-blog')
        self.assertEqual(blog.author, self.user)

    def test_create_blog_without_title(self):
        self.client.force_authenticate(user=self.user)
        
        invalid_payload = {
            'content': 'This is test content',
            'status': 'published'
        }
        
        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(BlogPost.objects.count(), 0)

    def test_create_blog_unauthenticated(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(BlogPost.objects.count(), 0)


class GetOneBlogViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        self.blog = BlogPost.objects.create(
            title="Test Blog",
            slug="test-blog",
            content="Test content",
            status="published",
            author=self.user
        )
        
        self.url = reverse('single-blog', kwargs={'slug': 'test-blog'})

    def test_get_one_blog(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Blog')
        self.assertEqual(response.data['slug'], 'test-blog')
        self.assertEqual(response.data['content'], 'Test content')


class DeleteBlogViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            username='user1',
            password='password1'
        )
        
        self.user2 = CustomUser.objects.create_user(
            email='user2@example.com',
            username='user2',
            password='password2'
        )
        
        # Creating a blog for user1
        self.blog = BlogPost.objects.create(
            title="User1 Blog",
            slug="user1-blog",
            content="User1 content",
            author=self.user1
        )
        
        self.url = reverse('delete-blog')
        self.payload = {'id': self.blog.id}

    def test_delete_own_blog(self):
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BlogPost.objects.count(), 0)

    def test_delete_others_blog(self):
        self.client.force_authenticate(user=self.user2)
        
        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(BlogPost.objects.count(), 1)

    def test_delete_blog_unauthenticated(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(BlogPost.objects.count(), 1)


class UpdateBlogViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            username='user1',
            password='password1'
        )
        
        self.user2 = CustomUser.objects.create_user(
            email='user2@example.com',
            username='user2',
            password='password2'
        )
        
        # Creating a blog for user1
        self.blog = BlogPost.objects.create(
            title="Original Title",
            slug="original-title",
            content="Original content",
            status="draft",
            author=self.user1
        )
        
        self.url = reverse('update-blog')
        self.valid_payload = {
            'id': self.blog.id,
            'title': 'Updated Title',
            'content': 'Updated content',
            'status': 'published'
        }

    def test_update_own_blog(self):
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.blog.refresh_from_db()
        self.assertEqual(self.blog.title, 'Updated Title')
        self.assertEqual(self.blog.slug, 'updated-title')
        self.assertEqual(self.blog.content, 'Updated content')
        self.assertEqual(self.blog.status, 'published')


class CommentViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        self.blog = BlogPost.objects.create(
            title="Test Blog",
            slug="test-blog",
            content="Test content",
            status="published",
            author=self.user
        )
        
        # Creating some comments
        self.comment1 = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is comment 1",
            reply=None
        )
        
        self.comment2 = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is comment 2",
            reply=None
        )
        
        # Creating a reply
        self.reply = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is a reply",
            reply=self.comment1
        )
        
        self.get_comments_url = reverse('comment', kwargs={'blog_id': self.blog.id})
        self.comment_payload = {
            'comment': 'New test comment'
        }

    def test_get_comments(self):
        response = self.client.get(self.get_comments_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only top-level comments
        
        # Checking that replies are nested in the parent comment
        comment_ids = [comment['id'] for comment in response.data]
        self.assertIn(self.comment1.id, comment_ids)
        self.assertIn(self.comment2.id, comment_ids)
        
        # Finding comment1 in the response data
        comment1_data = next(c for c in response.data if c['id'] == self.comment1.id)
        
        # Checking that reply is nested in comment1
        self.assertEqual(len(comment1_data['replies']), 1)
        self.assertEqual(comment1_data['replies'][0]['id'], self.reply.id)

    def test_create_comment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(
            self.get_comments_url,
            data=json.dumps(self.comment_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 4)  # 3 existing + 1 new
        
        # Checking the new comment
        new_comment = Comment.objects.latest('created_at')
        self.assertEqual(new_comment.comment, 'New test comment')
        self.assertEqual(new_comment.user, self.user)
        self.assertEqual(new_comment.post, self.blog)
        self.assertIsNone(new_comment.reply)

    def test_create_comment_unauthenticated(self):
        response = self.client.post(
            self.get_comments_url,
            data=json.dumps(self.comment_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Comment.objects.count(), 3)  # No new comment added


class ReplyViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        self.blog = BlogPost.objects.create(
            title="Test Blog",
            slug="test-blog",
            content="Test content",
            status="published",
            author=self.user
        )
        
        # Creating a comment
        self.comment = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is a parent comment",
            reply=None
        )
        
        # Creating some replies
        self.reply1 = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is reply 1",
            reply=self.comment
        )
        
        self.reply2 = Comment.objects.create(
            post=self.blog,
            user=self.user,
            comment="This is reply 2",
            reply=self.comment
        )
        
        self.get_replies_url = reverse('reply', kwargs={'comment_id': self.comment.id})
        self.reply_payload = {
            'comment': 'New test reply'
        }

    def test_get_replies(self):
        response = self.client.get(self.get_replies_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        reply_comments = [reply['comment'] for reply in response.data]
        self.assertIn('This is reply 1', reply_comments)
        self.assertIn('This is reply 2', reply_comments)

    def test_create_reply_authenticated(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(
            self.get_replies_url,
            data=json.dumps(self.reply_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 4)  # 3 existing + 1 new
        
        # Checking the new reply
        new_reply = Comment.objects.latest('created_at')
        self.assertEqual(new_reply.comment, 'New test reply')
        self.assertEqual(new_reply.user, self.user)
        self.assertEqual(new_reply.post, self.blog)
        self.assertEqual(new_reply.reply, self.comment)

    def test_create_reply_unauthenticated(self):
        response = self.client.post(
            self.get_replies_url,
            data=json.dumps(self.reply_payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Comment.objects.count(), 3)  # No new reply added


class ContactFormViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('contact-form')
        self.valid_payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'subject': 'Test Subject',
            'message': 'This is a test message'
        }

    def test_contact_form(self):
        # Need to mock send_mail to avoid actual email sending
        from unittest.mock import patch
        with patch('blogs.views.send_mail') as mock_send_mail:
            response = self.client.post(
                self.url,
                data=json.dumps(self.valid_payload),
                content_type='application/json'
            )
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['message'], 'Email sent successfully!')
            
            # Checking that send_mail was called with correct parameters
            mock_send_mail.assert_called_once()
            args, kwargs = mock_send_mail.call_args
            self.assertEqual(args[0], 'Test Subject')
            self.assertIn('From: Test User <test@example.com>', args[1])
            self.assertIn('This is a test message', args[1])
            self.assertEqual(args[2], 'test@example.com')
            self.assertEqual(args[3], ['rafidssrr.6767@gmail.com'])
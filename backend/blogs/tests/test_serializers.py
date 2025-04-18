from django.test import TestCase
from blogs.models import BlogPost, Comment
from blogs.serializers import BlogPostSerializer, CommentSerializer, ReplySerializer, AuthorSerializer
from users.models import CustomUser
from rest_framework.test import APIRequestFactory
from django.utils import timezone


class AuthorSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )

    def test_author_serializer(self):
        serializer = AuthorSerializer(self.user)
        self.assertEqual(set(serializer.data.keys()), {'id', 'username', 'email'})
        self.assertEqual(serializer.data['username'], 'testuser')
        self.assertEqual(serializer.data['email'], 'testuser@example.com')


class BlogPostSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create a test blog post
        cls.blog_post = BlogPost.objects.create(
            title='Test Blog Post',
            slug='test-blog-post',
            subtitle='Test Subtitle',
            content='This is test content for the blog post.',
            status='published',
            author=cls.user
        )

    def test_blog_post_serializer(self):
        serializer = BlogPostSerializer(self.blog_post)
        self.assertEqual(set(serializer.data.keys()), 
                        {'id', 'title', 'slug', 'subtitle', 'content', 
                         'published_date', 'status', 'author'})
        self.assertEqual(serializer.data['title'], 'Test Blog Post')
        self.assertEqual(serializer.data['slug'], 'test-blog-post')
        self.assertEqual(serializer.data['subtitle'], 'Test Subtitle')
        self.assertEqual(serializer.data['content'], 'This is test content for the blog post.')
        self.assertEqual(serializer.data['status'], 'published')
        self.assertEqual(serializer.data['author']['username'], 'testuser')


class CommentSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        factory = APIRequestFactory()
        cls.request = factory.get('/')
        
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create a second test user
        cls.user2 = CustomUser.objects.create_user(
            email='testuser2@example.com',
            username='testuser2',
            password='testpassword'
        )
        
        # Create a test blog post
        cls.blog_post = BlogPost.objects.create(
            title='Test Blog Post',
            slug='test-blog-post',
            content='This is test content for the blog post.',
            status='published',
            author=cls.user
        )
        
        # Create a parent comment
        cls.parent_comment = Comment.objects.create(
            comment='This is a parent comment',
            post=cls.blog_post,
            user=cls.user
        )
        
        # Create a reply comment
        cls.reply_comment = Comment.objects.create(
            comment='This is a reply comment',
            post=cls.blog_post,
            user=cls.user2,
            reply=cls.parent_comment
        )

    def test_comment_serializer(self):
        serializer = CommentSerializer(self.parent_comment)
        self.assertEqual(set(serializer.data.keys()), 
                        {'id', 'comment', 'created_at', 'post', 'user', 'reply', 'replies'})
        self.assertEqual(serializer.data['comment'], 'This is a parent comment')
        self.assertEqual(serializer.data['post'], self.blog_post.id)
        self.assertEqual(serializer.data['user']['username'], 'testuser')
        self.assertIsNone(serializer.data['reply'])
        self.assertEqual(len(serializer.data['replies']), 1)
        self.assertEqual(serializer.data['replies'][0]['comment'], 'This is a reply comment')

    def test_reply_serializer(self):
        serializer = ReplySerializer(self.reply_comment)
        self.assertEqual(set(serializer.data.keys()), 
                        {'id', 'comment', 'created_at', 'post', 'user', 'reply'})
        self.assertEqual(serializer.data['comment'], 'This is a reply comment')
        self.assertEqual(serializer.data['post'], self.blog_post.id)
        self.assertEqual(serializer.data['user']['username'], 'testuser2')
        self.assertEqual(serializer.data['reply'], self.parent_comment.id)

    def test_create_comment_with_context(self):
        data = {
            'comment': 'New test comment',
            'post': self.blog_post.id,
        }
        # Add request to context with user
        context = {'request': self.request}
        context['request'].user = self.user
        
        serializer = CommentSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid())
        comment = serializer.save()
        
        self.assertEqual(comment.comment, 'New test comment')
        self.assertEqual(comment.post, self.blog_post)
        self.assertEqual(comment.user, self.user)
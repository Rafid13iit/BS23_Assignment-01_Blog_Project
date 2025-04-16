from django.test import TestCase
from django.utils import timezone
from blogs.models import BlogPost, Comment
from users.models import CustomUser


class BlogPostModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Creating a test user
        test_user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create a test blog post
        BlogPost.objects.create(
            title='Test Blog Post',
            slug='test-blog-post',
            subtitle='Test Subtitle',
            content='This is test content for the blog post.',
            status='published',
            author=test_user
        )

    def test_blog_post_fields(self):
        blog = BlogPost.objects.get(id=1)
        self.assertEqual(blog.title, 'Test Blog Post')
        self.assertEqual(blog.slug, 'test-blog-post')
        self.assertEqual(blog.subtitle, 'Test Subtitle')
        self.assertEqual(blog.content, 'This is test content for the blog post.')
        self.assertEqual(blog.status, 'published')
        self.assertEqual(blog.author.username, 'testuser')

    def test_blog_post_str_method(self):
        blog = BlogPost.objects.get(id=1)
        self.assertEqual(str(blog), 'Test Blog Post')


class CommentModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a test user
        test_user = CustomUser.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpassword'
        )
        
        # Create a test blog post
        test_blog = BlogPost.objects.create(
            title='Test Blog Post',
            slug='test-blog-post',
            content='This is test content for the blog post.',
            status='published',
            author=test_user
        )
        
        # Create a parent comment
        parent_comment = Comment.objects.create(
            comment='This is a parent comment',
            post=test_blog,
            user=test_user
        )
        
        # Create a reply comment
        Comment.objects.create(
            comment='This is a reply comment',
            post=test_blog,
            user=test_user,
            reply=parent_comment
        )

    def test_parent_comment_fields(self):
        comment = Comment.objects.get(reply=None)
        self.assertEqual(comment.comment, 'This is a parent comment')
        self.assertEqual(comment.post.title, 'Test Blog Post')
        self.assertEqual(comment.user.username, 'testuser')
        self.assertIsNone(comment.reply)

    def test_reply_comment_fields(self):
        parent_comment = Comment.objects.get(reply=None)
        reply_comment = Comment.objects.get(reply=parent_comment)
        self.assertEqual(reply_comment.comment, 'This is a reply comment')
        self.assertEqual(reply_comment.post.title, 'Test Blog Post')
        self.assertEqual(reply_comment.user.username, 'testuser')
        self.assertEqual(reply_comment.reply, parent_comment)

    def test_get_replies_method(self):
        parent_comment = Comment.objects.get(reply=None)
        replies = parent_comment.get_replies()
        self.assertEqual(replies.count(), 1)
        self.assertEqual(replies.first().comment, 'This is a reply comment')
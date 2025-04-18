from django.test import TestCase
from unittest.mock import patch, MagicMock
from django.utils import timezone
from datetime import timedelta
from blogs.models import BlogPost, Comment
from users.models import CustomUser
from notifications.tasks import (
    send_comment_notification_email,
    send_new_blog_notification_to_users,
    check_for_new_blogs
)

class NotificationTasksTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test users
        cls.author = CustomUser.objects.create_user(
            email='author@example.com',
            username='author',
            password='authorpass',
            is_email_verified=True
        )
        
        cls.commenter = CustomUser.objects.create_user(
            email='commenter@example.com',
            username='commenter',
            password='commenterpass',
            is_email_verified=True
        )
        
        cls.subscriber = CustomUser.objects.create_user(
            email='subscriber@example.com',
            username='subscriber',
            password='subscriberpass',
            is_email_verified=True
        )
        
        # Create test blog post
        cls.blog = BlogPost.objects.create(
            title='Test Blog',
            slug='test-blog',
            content='Test content',
            author=cls.author,
            status='published'
        )
        
        # Create test comment
        cls.comment = Comment.objects.create(
            post=cls.blog,
            user=cls.commenter,
            comment='Test comment'
        )

    @patch('notifications.tasks.send_mail')
    def test_send_comment_notification_email(self, mock_send_mail):
        """Test the comment notification email task"""
        # Configure mock
        mock_send_mail.return_value = 1
        
        # Call the task
        result = send_comment_notification_email(self.comment.id)
        
        # Check if email was sent
        self.assertTrue(mock_send_mail.called)
        mock_send_mail.assert_called_once()
        
        # Check the call arguments
        args, kwargs = mock_send_mail.call_args
        self.assertIn(f"New comment on your blog post: {self.blog.title}", kwargs['subject'])
        self.assertIn(self.commenter.username, kwargs['message'])
        self.assertIn('Test comment', kwargs['message'])
        self.assertEqual([self.author.email], kwargs['recipient_list'])
        
        # Check the result
        self.assertIn(f"Comment notification email sent to {self.author.email}", result)
        
    @patch('notifications.tasks.send_mail')
    def test_no_notification_for_author_commenting_on_own_post(self, mock_send_mail):
        """Test that no notification is sent when author comments on their own post"""
        # Create a comment by the author on their own post
        author_comment = Comment.objects.create(
            post=self.blog,
            user=self.author,
            comment='Author comment'
        )
        
        # Call the task
        result = send_comment_notification_email(author_comment.id)
        
        # Check that no email was sent
        mock_send_mail.assert_not_called()
        
        # Check the result
        self.assertEqual("No notification needed - author commented on their own post", result)
        
    @patch('notifications.tasks.send_mail')
    def test_send_new_blog_notification_to_users(self, mock_send_mail):
        """Test the new blog notification task"""
        # Configure mock
        mock_send_mail.return_value = 1
        
        # Call the task
        result = send_new_blog_notification_to_users(self.blog.id)
        
        # Check if emails were sent (should be 1 email to subscriber)
        self.assertEqual(mock_send_mail.call_count, 1)
        
        # Check the call arguments
        args, kwargs = mock_send_mail.call_args
        self.assertIn(f"New Blog Post: {self.blog.title}", kwargs['subject'])
        self.assertIn(self.blog.title, kwargs['message'])
        self.assertIn(self.author.username, kwargs['message'])
        self.assertEqual([self.subscriber.email], kwargs['recipient_list'])
        
        # Check the result
        self.assertIn("New blog notification sent to", result)
        
    @patch('notifications.tasks.send_mail')
    def test_no_notification_for_draft_blog(self, mock_send_mail):
        """Test that no notification is sent for draft blogs"""
        # Create a draft blog
        draft_blog = BlogPost.objects.create(
            title='Draft Blog',
            slug='draft-blog',
            content='Draft content',
            author=self.author,
            status='draft'
        )
        
        # Call the task
        result = send_new_blog_notification_to_users(draft_blog.id)
        
        # Check that no email was sent
        mock_send_mail.assert_not_called()
        
        # Check the result
        self.assertEqual("Blog is not published, no notifications sent", result)
        
    @patch('notifications.tasks.send_new_blog_notification_to_users')
    def test_check_for_new_blogs(self, mock_send_notification):
        """Test the periodic task that checks for new blogs"""
        # Configure mock
        mock_send_notification.return_value = "Notification sent"
        
        # Update blog to be recently published
        self.blog.published_date = timezone.now()
        self.blog.save()
        
        # Call the task
        result = check_for_new_blogs()
        
        # Check that notification task was called
        mock_send_notification.delay.assert_called_once_with(self.blog.id)
        
        # Check the result
        self.assertEqual("Scheduled notifications for 1 new blogs", result)
        
    @patch('notifications.tasks.send_new_blog_notification_to_users')
    def test_check_for_new_blogs_no_recent(self, mock_send_notification):
        """Test the periodic task when there are no recent blogs"""
        # Configure mock
        mock_send_notification.delay.return_value = None
        
        # Update blog to be published outside the time window
        self.blog.published_date = timezone.now() - timedelta(hours=2)
        self.blog.save()
        
        # Call the task
        result = check_for_new_blogs()
        
        # Check that notification task was not called
        mock_send_notification.delay.assert_not_called()
        
        # Check the result
        self.assertEqual("Scheduled notifications for 0 new blogs", result)
        
    @patch('notifications.tasks.send_mail')
    def test_exception_handling_in_notification_tasks(self, mock_send_mail):
        """Test exception handling in notification tasks"""
        # Configure mock to raise an exception
        mock_send_mail.side_effect = Exception("Test exception")
        
        # Call the task
        result = send_comment_notification_email(self.comment.id)
        
        # Check that the exception was caught
        self.assertIn("Failed to send comment notification:", result)
        self.assertIn("Test exception", result)
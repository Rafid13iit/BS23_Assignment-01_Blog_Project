from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from blogs.models import BlogPost, Comment
from users.models import CustomUser
from django.template.loader import render_to_string

@shared_task
def send_comment_notification_email(comment_id):
    try:
        comment = Comment.objects.select_related('post', 'post__author', 'user').get(id=comment_id)
        blog = comment.post
        author = blog.author
        
        # Only sends notification if the comment author is different from the blog author
        if not author or (comment.user and comment.user.id == author.id):
            return "No notification needed - author commented on their own post"
        
        subject = f"New comment on your blog post: {blog.title}"
        
        message = f"""
Hello {author.username},

Someone has commented on your blog post "{blog.title}".

Comment by: {comment.user.username if comment.user else 'Anonymous'}
Comment: {comment.comment}

Visit your blog to see the comment and respond.

Best regards,
Your Blog App Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[author.email],
            fail_silently=False,
        )
        
        return f"Comment notification email sent to {author.email}"
    
    except Exception as e:
        return f"Failed to send comment notification: {str(e)}"


@shared_task
def send_new_blog_notification_to_users(blog_id):
    try:
        blog = BlogPost.objects.select_related('author').get(id=blog_id)
        
        # Only sends notifications for published blogs
        if blog.status != 'published':
            return "Blog is not published, no notifications sent"
        
        # Gets all active, verified users except the blog author
        active_users = CustomUser.objects.filter(
            is_active=True,
            is_email_verified=True
        ).exclude(id=blog.author.id)
        
        subject = f"New Blog Post: {blog.title}"
        
        for user in active_users:
            message = f"""
Hello {user.username},

A new blog post has been published!

Title: {blog.title}
Author: {blog.author.username if blog.author else 'Anonymous'}
{blog.subtitle if blog.subtitle else ''}

Check it out now on our blog App!

Best regards,
Your Blog App Team
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
        
        return f"New blog notification sent to {active_users.count()} users"
    
    except Exception as e:
        return f"Failed to send blog notifications: {str(e)}"


@shared_task
def check_for_new_blogs():
    from django.utils import timezone
    from datetime import timedelta
    
    # Finds blogs published in the last hour
    one_hour_ago = timezone.now() - timedelta(hours=1)
    
    # Gets recent published blogs
    new_blogs = BlogPost.objects.filter(
        status='published',
        published_date__gte=one_hour_ago
    )
    
    count = 0
    for blog in new_blogs:
        send_new_blog_notification_to_users.delay(blog.id)
        count += 1
    
    return f"Scheduled notifications for {count} new blogs"
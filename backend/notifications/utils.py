from django.core.mail import send_mail
from django.conf import settings

def send_comment_email(user_email, username, blog_title, commenter_name, comment_text, blog_id):
    """
    Helper function to send comment notification emails
    """
    subject = f"New comment on your blog post: {blog_title}"
    
    message = f"""
Hello {username},

Someone has commented on your blog post "{blog_title}".

Comment by: {commenter_name}
Comment: {comment_text}

Visit your blog to see the comment and respond.

Best regards,
Your Blog Team
    """
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=False,
    )


def send_new_blog_email(user_email, username, blog_title, author_name, blog_subtitle, blog_id):
    """
    Helper function to send new blog notification emails
    """
    subject = f"New Blog Post: {blog_title}"
    
    subtitle_text = f"\n{blog_subtitle}" if blog_subtitle else ""
    
    message = f"""
Hello {username},

A new blog post has been published!

Title: {blog_title}
Author: {author_name}{subtitle_text}

Check it out now on our blog!

Best regards,
Your Blog App Team
    """
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=False,
    )
from django.db import models
from django.utils import timezone


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    subtitle = models.CharField(
        max_length=255, blank=True)  # Make subtitle optional
    content = models.TextField()  # Use TextField for longer blog content
    published_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('published', 'Published')
    ], default='draft')

    def __str__(self):
        return self.title
    
    def comments(self):
        return Comment.objects.filter(post=self).order_by('-created_at')
    
class Comment(models.Model):
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='comments', default=None)
    reply = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f'Comment by {self.name} on {self.post.title}'
    
    def get_replies(self):
        return self.replies.all().order_by('-created_at')

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
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    reply = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self):
        return f"{self.post.title} - {self.name}"
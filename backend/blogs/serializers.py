from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        # fields = ('id', 'title', 'slug', 'subtitle', 'content', 'published_date', 'status')
        fields = '__all__'  # Including all fields from the model
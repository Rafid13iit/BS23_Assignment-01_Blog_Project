from rest_framework import serializers
from .models import BlogPost, Comment

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        # fields = ('id', 'title', 'slug', 'subtitle', 'content', 'published_date', 'status')
        fields = '__all__'  # Including all fields from the model

    def __init__(self, *args, **kwargs):
        super(BlogPostSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1
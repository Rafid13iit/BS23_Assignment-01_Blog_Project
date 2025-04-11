from rest_framework import serializers
from .models import BlogPost, Comment
from users.models import CustomUser

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

class BlogPostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    class Meta:
        model = BlogPost
        # fields = ('id', 'title', 'slug', 'subtitle', 'content', 'published_date', 'status', 'author')
        fields = '__all__'  # Including all fields from the model

class CommentSerializer(serializers.ModelSerializer):
    # user_username = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replies(self, obj):
        if obj.reply is None:  # Only for top-level comments
            replies = Comment.objects.filter(reply=obj)
            return CommentSerializer(replies, many=True).data
        return []
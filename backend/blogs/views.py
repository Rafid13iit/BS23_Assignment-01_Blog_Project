from rest_framework.response import Response
from rest_framework import status
from blogs.models import BlogPost, Comment
from blogs.serializers import BlogPostSerializer, CommentSerializer
from blogs.renderers import BlogPostJSONRenderer
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.text import slugify
from django.core.mail import send_mail
from django.conf import settings


class GetAllBlogsView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        blogs = BlogPost.objects.filter(status='published')
        serializer = BlogPostSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetUserBlogsView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        blogs = BlogPost.objects.filter(author=request.user)
        serializer = BlogPostSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data.copy()
        title = data.get('title')
        if not title:
            return Response({'error': 'Title is required.'}, status=status.HTTP_400_BAD_REQUEST)
        slug = slugify(title)
        data['slug'] = slug
        data['author'] = request.user.id
        serializer = BlogPostSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetOneBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [AllowAny]

    def get(self, request, slug, format=None):
        blog = BlogPost.objects.get(slug=slug)
        serializer = BlogPostSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        blog = BlogPost.objects.get(id=request.data.get('id'))
        if blog.author != request.user:
            return Response({'error': 'You do not have permission to delete this blog.'}, status=status.HTTP_403_FORBIDDEN)
        blog.delete()
        return Response({'message': 'Blog deleted successfully'}, status=status.HTTP_204_NO_CONTENT
                        )


class UpdateBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        blog = BlogPost.objects.get(id=request.data.get('id'))
        data = request.data.copy()
        title = data.get('title')
        if not title:
            return Response({'error': 'Title is required.'}, status=status.HTTP_400_BAD_REQUEST)
        slug = slugify(title)
        data['slug'] = slug
        serializer = BlogPostSerializer(blog, data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CommentView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [AllowAny]
    serializer_class = ModelSerializer

    def get(self, request, blog_id, format=None):
        blog = BlogPost.objects.get(pk=blog_id)
        # top_level_comments = blog.comments.filter(reply__isnull=True)
        comments = blog.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, blog_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'You must be logged in to post a comment'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            blog = BlogPost.objects.get(pk=blog_id)
            data = {}
            data['post'] = blog.id
            # data['user'] = request.user.id
            data['comment'] = request.data.get('comment')

            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(data={'message': 'Comment posted successfully', 'comment': serializer.data}, status=status.HTTP_201_CREATED)

            return Response(data=serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except BlogPost.DoesNotExist:
            return Response(data={'message': 'Blog does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
class ReplyView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [AllowAny]
    serializer_class = ModelSerializer

    def get(self, request, comment_id, format=None):
        parent_comment = Comment.objects.get(pk = comment_id)
        replies = parent_comment.get_replies()
        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, comment_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'You must be logged in to post a reply'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            parent_comment = Comment.objects.get(pk=comment_id)
            data = {}
            # data['user'] = request.user.id
            data['post'] = parent_comment.post.id  # link to the original post
            data['reply'] = parent_comment.id       # link to the parent comment
            data['comment'] = request.data.get('comment') # 

            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(data={'message': 'Reply posted successfully', 'reply': serializer.data}, status=status.HTTP_201_CREATED)

            return Response(data=serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except Comment.DoesNotExist:
            return Response(data={'message': 'Comment does not exist'}, status=status.HTTP_404_NOT_FOUND)
        

class ContactFormView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        full_message = f"From: {name} <{email}>\n\n{message}"

        send_mail(
            subject,
            full_message,
            email,
            [settings.EMAIL_HOST_USER],  # recipient
            fail_silently=False,
        )

        return Response({'message': 'Email sent successfully!'})
        
        
        

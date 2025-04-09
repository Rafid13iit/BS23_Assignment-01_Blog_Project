from rest_framework.response import Response
from rest_framework import status
from blogs.models import BlogPost
from blogs.serializers import BlogPostSerializer
from blogs.renderers import BlogPostJSONRenderer
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify


class GetAllBlogsView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        blogs = BlogPost.objects.all()
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
        serializer = BlogPostSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetOneBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, slug, format=None):
        blog = BlogPost.objects.get(slug=slug)
        serializer = BlogPostSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteBlogView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        blog = BlogPost.objects.get(id=request.data.get('id'))
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
    permission_classes = [IsAuthenticated]
    serializer_class = ModelSerializer

    def get(self, request, slug, format=None):
        blog = BlogPost.objects.get(slug=slug)
        serializer = self.serializer_class(blog.comments.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, slug, format=None):
        blog = BlogPost.objects.get(slug=slug)
        data = request.data.copy()
        data['blog'] = blog.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ReplyView(APIView):
    renderer_classes = [BlogPostJSONRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = ModelSerializer

    def get(self, request, slug, comment_id, format=None):
        blog = BlogPost.objects.get(slug=slug)
        comment = blog.comments.get(id=comment_id)
        serializer = self.serializer_class(comment.replies.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, slug, comment_id, format=None):
        blog = BlogPost.objects.get(slug=slug)
        comment = blog.comments.get(id=comment_id)
        data = request.data.copy()
        data['comment'] = comment.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

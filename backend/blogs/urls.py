from django.urls import path
from .views import *

urlpatterns = [
    path('', GetAllBlogsView.as_view(), name='blogs'),
    path('create/', CreateBlogView.as_view(), name='create-blog'),
    path('delete/', DeleteBlogView.as_view(), name='delete-blog'),
    path('update/', UpdateBlogView.as_view(), name='update-blog'),
    path('<slug>/', GetOneBlogView.as_view(), name='single-blog'),
    path('comment/<int:blog_id>/', CommentView.as_view(), name='comment'),
    path('reply/<int:comment_id>/', ReplyView.as_view(), name='reply'),
]
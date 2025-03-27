from django.urls import path, include
from blogs.views import *

urlpatterns = [
    path('/', GetAllBlogsView.as_view(), name='blogs'),
    path('create/', CreateBlogView.as_view(), name='create-blog'),
    path('delete/', DeleteBlogView.as_view(), name='delete-blog'),
    path('update/', UpdateBlogView.as_view(), name='update-blog'),
    path('<slug>/', GetOneBlogView.as_view(), name='single-blog'),
]
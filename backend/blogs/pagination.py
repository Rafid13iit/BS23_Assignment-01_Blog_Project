from rest_framework import pagination, status
from rest_framework.exceptions import NotFound as NotFoundError
from rest_framework.request import Request
from rest_framework.response import Response

class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

    def generate_response(self, query_set, serializer, request: Request, total=None) -> Response:
        try:
            page_data = self.paginate_queryset(query_set, request)
        except NotFoundError:
            return Response({"message": "No results found for the requested page"}, status=status.HTTP_400_BAD_REQUEST)

        serialized_page = serializer(page_data, many=True)
        return self.get_paginated_response(serialized_page.data)
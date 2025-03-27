from rest_framework import renderers


class BlogPostJSONRenderer(renderers.JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        # Checking if the view throws an error
        if isinstance(data, dict) and 'detail' in data:
            return super().render(data)
        
        return super().render(data)
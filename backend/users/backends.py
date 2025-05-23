from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class CaseInsensitiveModelBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)

        try:
            case_insensitive_username_field = '{}__iexact'.format(UserModel.USERNAME_FIELD)
            user = UserModel._default_manager.get(**{case_insensitive_username_field: username})
        except UserModel.DoesNotExist:
            UserModel().set_password(password)  # Prevents timing attack
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
            
            

# from django.contrib.auth.backends import ModelBackend
# from django.contrib.auth.models import User
# from django.db.models import Q

# class CaseInsensitiveModelBackend(ModelBackend):
#     def authenticate(self, request, username=None, password=None, **kwargs):
#         try:
#             user = User.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
#             if user.check_password(password):
#                 return user
#         except User.DoesNotExist:
#             return None
#         except User.MultipleObjectsReturned:
#             return User.objects.filter(email=username).order_by('id').first()



from django.core.mail import send_mail
import random
from django.conf import settings
from users.models import CustomUser

def send_otp_via_email(email, otp):
    subject = "Your account verification OTP"
    otp = random.randint(100000, 999999)
    message = f"Your OTP is {otp}"
    email_from = settings.EMAIL_HOST
    send_mail(subject, message, email_from, [email]) 
    user_obj = CustomUser.objects.get(email=email)
    user_obj.email_otp = otp
    user_obj.save()
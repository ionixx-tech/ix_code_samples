import datetime
import uuid

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.http import Http404
from django.utils.timezone import utc
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from ixcoin_backend import messages
from ixcoin_backend.api.accounts.models import UserSession
from ixcoin_backend.api.community.models import QuestionsAnswersRankHistory
from ixcoin_backend.error import error_messages, INTERNAL_SERVER_ERROR, BAD_REQUEST
from ixcoin_backend.settings import DEFAULT_FROM_EMAIL


class Utils:
    def __init__(self):
        pass

    @staticmethod
    def dispatch_success(error_code, response=None):
        """
        Dispatch the success response
        """
        if isinstance(response, list) or isinstance(response, dict):
            data = {'status': 'success', 'result': response}
        else:
            data = {'status': 'success', 'message': error_messages.get(error_code)}

        return Response(data=data, status=error_code)

    @staticmethod
    def dispatch_failure(error_code, response=None):
        """
        Dispatch the failure response
        """
        errors = {'status': 'failed',
                  'code': error_code,
                  'message': error_messages.get(error_code)}
        status_code = BAD_REQUEST
        if response is not None:
            errors['errors'] = response
        if error_code == INTERNAL_SERVER_ERROR:
            status_code = INTERNAL_SERVER_ERROR

        return Response(data=errors, status=status_code)

    @staticmethod
    def generate_unique_token():
        """
        Generate Unique token for the user
        """
        return str(uuid.uuid4().hex)

    @staticmethod
    def send_mail(email, subject, body, html_message=None):
        """
        Trigger mail to user
        :param email: User email address, to address
        :param subject: Subject for the email
        :param body: Message for the user
        :param html_message: Html Message for the user
        """

        try:
            send_mail(
                from_email=DEFAULT_FROM_EMAIL,
                subject=subject,
                message=body,
                recipient_list=email,
                fail_silently=False,
                html_message=html_message,
            )
            print("Mail Sent")

        except Exception as e:
            print("Mail Fail to Sent")

    @staticmethod
    def validate_email_address(email):
        """
        This method validates whether the input is an email address or not.
        """
        try:
            validate_email(email)
            return True
        except ValidationError:
            return False

    @staticmethod
    def get_user(_id):
        """
        Returns the user object from user ID
        """
        try:
            return User.objects.get(id=_id)
        except User.DoesNotExist:
            raise Http404

    @staticmethod
    def create_balance_entry(user_id, total_coin_balance=0, total_ether_spent=0):
        """
        Create Balance Object for the user
        :param user_id: User Reference ID
        :param total_coin_balance: Total coin of the user
        :param total_ether_spent: Total ether spent by user
        """
        from ixcoin_backend.api.accounts.serializers import BalanceSerializer
        request = {'user': user_id,
                   'index_user': user_id,
                   'total_coin_balance': total_coin_balance,
                   'total_ether_spent': total_ether_spent,
                   'total_points': 0,
                   'last_updated_time': datetime.datetime.utcnow().replace(tzinfo=utc)}
        balance = BalanceSerializer(data=request)
        check2, data2 = balance.is_valid()
        if check2:
            balance.save()

    @staticmethod
    def create_community_entry(user_id):
        """
        Create New Object for Community Model
        """
        investor = QuestionsAnswersRankHistory(user=User.objects.get(pk=user_id))
        investor.save()

    @staticmethod
    def init_validator_rules(fields):
        """
        Additional validation reference for the serializers
        """
        validators = {}
        for field in fields:
            errors = {"error_messages": {}}
            errors["error_messages"]["required"] = messages.MISSING_PARAMETERS
            errors["error_messages"]["blank"] = messages.REQUIRED_VALID_DATA
            errors["error_messages"]["invalid"] = messages.REQUIRED_INVALID_DATA
            errors["error_messages"]["null"] = messages.SKIP_NULL_VALUE
            errors["error_messages"]["invalid_choice"] = messages.INVALID_CHOICE
            errors["error_messages"]["does_not_exist"] = messages.DATA_NOT_FOUND
            errors["error_messages"]["incorrect_type"] = messages.INVALID_PARAMETERS
            validators[field] = errors
        return validators

    @staticmethod
    def is_valid_user(request, _id):
        """
        Validated the session of the user and requested user is valid
        """
        try:
            token = request.META.get('HTTP_AUTHORIZATION', None)
            token_obj = UserSession.objects.all().count()
            if token_obj == 0:
                return False

            token_obj = UserSession.objects.get(auth_key=token)
            user = User.objects.get(pk=_id)
            if token_obj.user == user:
                return True
            else:
                return False
        except Exception:
            return False


class PageNumberPaginationDataOnly(PageNumberPagination):
    """
    Limits the request to return an unpaginated list of items
    """
    page_size = 100
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(data)

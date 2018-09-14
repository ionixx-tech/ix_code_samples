import re
from datetime import datetime, timedelta

from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import utc

from ixcoin_backend.api.accounts.models import UserSession
from ixcoin_backend.error import SESSION_EXPIRED, error_messages, MULTI_SESSION_ACTIVE, INVALID_AUTHORIZATION
from ixcoin_backend.settings import SESSION_EXPIRE_MINUTES, SESSION_SKIP_URLS


class SessionValidator(MiddlewareMixin):
    def process_request(self, request):
        try:
            session_save_urls = SESSION_SKIP_URLS
            request_api_url = request.META.get('PATH_INFO')
            for url in session_save_urls:
                if re.search("/api/user/", request_api_url):

                    if re.search("POST", request.META.get('REQUEST_METHOD')):
                        if re.search("vote/", request_api_url):
                            print("Break for Vote")
                            break
                        return
                    else:
                        break
                if re.search(url, request_api_url):
                    return
            token = request.META.get('HTTP_AUTHORIZATION', None)
            token_obj = UserSession.objects.all().count()
            if token_obj == 0:
                return JsonResponse({'error': INVALID_AUTHORIZATION, 'code': error_messages.get(INVALID_AUTHORIZATION),
                                     'status': 'failure'},
                                    status=401)

            try:
                token_obj = UserSession.objects.get(auth_key=token)
                user_session = UserSession.objects.get(user=token_obj.user)
                if user_session:
                    if user_session.is_first_time:
                        user_session.is_first_time = False
                        user_session.auth_key = token

                    if user_session.auth_key == token:
                        now = datetime.utcnow().replace(tzinfo=utc)
                        if user_session.end_time > now:
                            user_session.end_time = now + timedelta(minutes=SESSION_EXPIRE_MINUTES)
                            user_session.save()
                        else:
                            # user_session.delete()
                            return JsonResponse(
                                {'error': SESSION_EXPIRED, 'code': error_messages.get(SESSION_EXPIRED),
                                 'status': 'failure'},
                                status=401)

            except UserSession.DoesNotExist:
                if token is None:
                    return JsonResponse(
                        {'error': INVALID_AUTHORIZATION, 'code': error_messages.get(INVALID_AUTHORIZATION),
                         'status': 'failure'},
                        status=401)
                return JsonResponse({'error': MULTI_SESSION_ACTIVE, 'code': error_messages.get(MULTI_SESSION_ACTIVE),
                                     'status': 'failure'},
                                    status=401)
        except Exception as e:
            print(e)

        return

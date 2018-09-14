from django.conf.urls import url

from ixcoin_backend.api.community import views

urlpatterns = [
    # Question
    url(r'^user/(?P<_id>[0-9]+)/question/$', views.QuestionApi.as_view()),

    # Vote
    url(r'^user/(?P<_id>[0-9]+)/vote/$', views.VoteApi.as_view()),

    # Answer
    url(r'^user/(?P<_id>[0-9]+)/answer/$', views.AnswerApi.as_view()),

    # Community
    url(r'^user/(?P<_id>[0-9]+)/my_community/$', views.Dashboard.as_view()),
    url(r'^user/(?P<_id>[0-9]+)/community/$', views.Community.as_view()),
]

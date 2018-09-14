from django.contrib import admin

from ixcoin_backend.api.community.forms import QuestionsForm, AnswersForm, QuestionsAnswersRankHistoryForm, \
    VoteForm
from ixcoin_backend.api.community.models import Questions, Answers, QuestionsAnswersRankHistory, Vote


class QuestionsAdmin(admin.ModelAdmin):
    """
    Include all the fields of QuestionsAdmin Model in Admin Page
    """
    form = QuestionsForm
    list_display = [field.name for field in Questions._meta.fields]


class AnswersAdmin(admin.ModelAdmin):
    """
    Include all the fields of AnswersAdmin Model in Admin Page
    """
    form = AnswersForm
    list_display = [field.name for field in Answers._meta.fields]


class QuestionsAnswersRankHistoryAdmin(admin.ModelAdmin):
    """
    Include all the fields of QuestionsAnswersRankHistoryAdmin Model in Admin Page
    """
    form = QuestionsAnswersRankHistoryForm
    list_display = [field.name for field in QuestionsAnswersRankHistory._meta.fields]


class VoteAdmin(admin.ModelAdmin):
    """
    Include all the fields of VoteAdmin Model in Admin Page
    """
    form = VoteForm
    list_display = [field.name for field in Vote._meta.fields]


# Register Admin Models
admin.site.register(Questions, QuestionsAdmin)
admin.site.register(Answers, AnswersAdmin)
admin.site.register(QuestionsAnswersRankHistory, QuestionsAnswersRankHistoryAdmin)
admin.site.register(Vote, VoteAdmin)

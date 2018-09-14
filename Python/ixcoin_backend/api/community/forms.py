from django import forms

from ixcoin_backend.api.community.models import Questions, Answers, QuestionsAnswersRankHistory, Vote


class QuestionsForm(forms.ModelForm):
    """
    Create QuestionsForm form to display in Admin Page
    """

    class Meta:
        model = Questions
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(QuestionsForm, self).__init__(*args, **kwargs)


class AnswersForm(forms.ModelForm):
    """
    Create AnswersForm form to display in Admin Page
    """

    class Meta:
        model = Answers
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(AnswersForm, self).__init__(*args, **kwargs)


class QuestionsAnswersRankHistoryForm(forms.ModelForm):
    """
    Create QuestionsAnswersRankHistoryForm form to display in Admin Page
    """

    class Meta:
        model = QuestionsAnswersRankHistory
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(QuestionsAnswersRankHistoryForm, self).__init__(*args, **kwargs)


class VoteForm(forms.ModelForm):
    """
    Create VoteForm form to display in Admin Page
    """

    class Meta:
        model = Vote
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(VoteForm, self).__init__(*args, **kwargs)

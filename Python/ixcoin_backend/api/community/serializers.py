from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers

from ixcoin_backend.api.accounts.models import Balance
from ixcoin_backend.api.community.models import Questions, Answers, QuestionsAnswersRankHistory, Vote
from ixcoin_backend.api.utils import Utils


class QuestionsSerializer(serializers.ModelSerializer):
    """
    QuestionsSerializer: Create,Validate and Get Questions for requested User
    """
    is_user_downvoted = serializers.SerializerMethodField()
    is_user_upvoted = serializers.SerializerMethodField()

    def is_valid(self, raise_exception=False):
        if not hasattr(self, '_validated_data'):
            try:
                self._validated_data = self.run_validation(self.initial_data)
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}
        print(self._errors)
        return not bool(self._errors), self._errors

    def create(self, validated_data):
        question = Questions(user=User.objects.get(pk=validated_data['user']),
                             title=validated_data['title'],
                             question_posted_by=validated_data['question_posted_by'],
                             description=validated_data['description'],
                             tags=validated_data['tags'],
                             )

        question.save()
        return question

    class Meta:
        model = Questions
        fields = (
            'id', 'user', 'question_posted_by', 'title', 'description', 'total_up_vote', 'total_down_vote',
            'total_points', 'tags', 'last_updated_time', 'is_user_upvoted', 'is_user_downvoted')
        extra_kwargs = Utils.init_validator_rules(fields)

    def get_is_user_upvoted(self, obj):
        try:
            vote_object = Vote.objects.filter(question_id=obj.id, user=self.context['current_user_id'])[0]
            if vote_object.is_question_up_voted is True:
                return True
            else:
                return False
        except Exception as e:

            return False

    def get_is_user_downvoted(self, obj):
        try:
            vote_object = Vote.objects.filter(question_id=obj.id, user=self.context['current_user_id'])[0]

            if vote_object.is_question_down_voted is True:
                return True
            else:
                return False
        except Exception as e:
            return False


class QuestionsMaxDataSerializer(serializers.ModelSerializer):
    """
    AnswersMaxDataSerializer: Get Top Rated Questions to be shown in dashboard
    """
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Questions
        fields = ('user', 'question_posted_by', 'question_count')

    def get_question_count(self, obj):
        return len(Questions.objects.filter(user=obj.user))


class AnswersMaxDataSerializer(serializers.ModelSerializer):
    """
    AnswersMaxDataSerializer: Get Top Rated Answers to be shown in dashboard
    """
    answer_count = serializers.SerializerMethodField()

    class Meta:
        model = Answers
        fields = ('user', 'answer_posted_by', 'answer_count')

    def get_answer_count(self, obj):
        return len(Answers.objects.filter(user=obj.user))


class TopPointsBalanceSerializer(serializers.ModelSerializer):
    """
    TopPointsBalanceSerializer: Get Top Rated Users to be shown in dashboard
    """
    name_of_user = serializers.SerializerMethodField()

    class Meta:
        model = Balance
        fields = ('user', 'total_points', 'last_updated_time', 'name_of_user')

    def get_name_of_user(self, obj):
        name_of_user = obj.user.first_name + " " + obj.user.last_name
        return name_of_user


class QuestionsAnswersRankHistorySerializer(serializers.ModelSerializer):
    """
    QuestionsAnswersRankHistorySerializer: Create Get Question Answer Logs for requested users
    """

    class Meta:
        model = QuestionsAnswersRankHistory
        fields = (
            "user", "question_id", "answer_id", "up_vote", "down_vote", "total_points", "coin_credited", "coin_debited")


class AnswerSerializer(serializers.ModelSerializer):
    """
    AnswerSerializer: Create,Validate and Get Answers for requested Question
    """
    is_user_downvoted = serializers.SerializerMethodField()
    is_user_upvoted = serializers.SerializerMethodField()

    def is_valid(self, raise_exception=False):
        if not hasattr(self, '_validated_data'):
            try:
                self._validated_data = self.run_validation(self.initial_data)
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}
        print(self._errors)
        return not bool(self._errors), self._errors

    def create(self, validated_data):
        answer = Answers(user=User.objects.get(pk=validated_data['user']),
                         title=validated_data['title'],
                         answer_posted_by=validated_data['answer_posted_by'],
                         question_id=Questions.objects.get(pk=validated_data['question_id']),
                         description=validated_data['description'],
                         tags=validated_data['tags'],
                         )

        answer.save()
        return answer

    class Meta:
        model = Answers
        fields = (
            'id', 'question_id', 'answer_posted_by', 'user', 'title', 'description', 'total_up_vote', 'total_down_vote',
            'total_points',
            'tags', 'last_updated_time', 'is_user_upvoted', 'is_user_downvoted')
        extra_kwargs = Utils.init_validator_rules(fields)

    def get_is_user_upvoted(self, obj):
        try:
            vote_object = Vote.objects.filter(answer_id=obj.id, user=self.context['current_user_id'])[0]
            if vote_object.is_answer_up_voted is True:
                return True
            else:
                return False
        except Exception as e:
            return False

    def get_is_user_downvoted(self, obj):
        try:
            vote_object = Vote.objects.filter(answer_id=obj.id, user=self.context['current_user_id'])[0]
            if vote_object.is_answer_down_voted is True:
                return True
            else:
                return False
        except Exception as e:
            return False

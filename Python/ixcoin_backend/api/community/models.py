from django.contrib.auth.models import User
from django.db import models


class Questions(models.Model):
    """
    Questions: Manage all the questions created by user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    title = models.CharField(max_length=500, default="No title", null=False)
    question_posted_by = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True)
    total_up_vote = models.IntegerField(default=0, null=True)
    total_down_vote = models.IntegerField(default=0, null=True)
    total_points = models.IntegerField(default=0, null=True)
    tags = models.CharField(max_length=500, default="No Tags")
    last_updated_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "questions"


class Answers(models.Model):
    """
    Answers: Manage all the answers created by user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    question_id = models.ForeignKey(Questions, null=False, related_name="question_object", on_delete=models.CASCADE)
    title = models.CharField(max_length=500, default="No title", null=False)
    answer_posted_by = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True)
    total_up_vote = models.IntegerField(default=0, null=True)
    total_down_vote = models.IntegerField(default=0, null=True)
    total_points = models.IntegerField(default=0, null=True)
    tags = models.CharField(max_length=500, default="No Tags")
    last_updated_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "answers"


class Vote(models.Model):
    """
    Vote: Manage the voting involved in community for question and answer
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    question_id = models.ForeignKey(Questions, null=True, on_delete=models.CASCADE)
    answer_id = models.ForeignKey(Answers, null=True, on_delete=models.CASCADE)
    is_question_up_voted = models.BooleanField(default=False)
    is_question_down_voted = models.BooleanField(default=False)
    is_answer_up_voted = models.BooleanField(default=False)
    is_answer_down_voted = models.BooleanField(default=False)

    class Meta:
        db_table = "vote"


class QuestionsAnswersRankHistory(models.Model):
    """
    QuestionsAnswersRankHistory: Logs all the questions and answers
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    question_id = models.ForeignKey(Questions, null=True, on_delete=models.CASCADE)
    answer_id = models.ForeignKey(Answers, null=True, on_delete=models.CASCADE)
    up_vote = models.IntegerField(default=0, null=True)
    down_vote = models.IntegerField(default=0, null=True)
    total_points = models.IntegerField(default=0, null=True)
    coin_credited = models.FloatField(default=0, null=True)
    coin_debited = models.FloatField(default=0, null=True)
    last_updated_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "question_answer_rank_history"

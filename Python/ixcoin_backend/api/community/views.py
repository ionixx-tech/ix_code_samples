# Create your views here.

from django.contrib.auth.models import User
from django.db.models import Q, Sum
from rest_framework import views

from ixcoin_backend import error
from ixcoin_backend.api.accounts.models import Balance
from ixcoin_backend.api.community.models import Answers, Questions, Vote
from ixcoin_backend.api.community.serializers import QuestionsSerializer, AnswerSerializer, QuestionsMaxDataSerializer, \
    AnswersMaxDataSerializer, TopPointsBalanceSerializer
from ixcoin_backend.api.utils import Utils
from ixcoin_backend.error import OK, UNAUTHORIZED_ACCESS, VALIDATION_MISSING, INVALID_PARAMETERS, USER__NOT_EXIST, \
    INTERNAL_SERVER_ERROR


class QuestionApi(views.APIView):
    """
    Raise question on Community
    """

    def get(self, request, _id):
        """
        Get all the raised question by users with filter
        """
        try:
            if request.GET.get("search"):
                search_term = str(request.GET.get("search"))

                if request.GET.get("latest"):
                    # Filter by latest Order with search
                    queryset = Questions.objects.order_by('-last_updated_time').filter(
                        Q(title__icontains=search_term) | Q(description__icontains=search_term)).order_by(
                        '-last_updated_time')

                elif request.GET.get("votes"):
                    # Filter by votes with search
                    queryset = Questions.objects.order_by('-total_points').filter(
                        Q(title__icontains=search_term) | Q(description__icontains=search_term)).order_by(
                        '-last_updated_time')

                elif request.GET.get("un_answered"):
                    # Filter by unanswered questions with search
                    queryset = Questions.objects.filter(
                        Q(Q(question_object=None) & (
                            Q(title__icontains=search_term) | Q(description__icontains=search_term)))).order_by(
                        '-last_updated_time')

                else:
                    # Get all questions with search
                    queryset = Questions.objects.all().filter(
                        Q(title__icontains=search_term) | Q(description__icontains=search_term)).order_by(
                        '-last_updated_time')

            elif request.GET.get("question_id"):
                # Filter by question id
                queryset = Questions.objects.get(id=request.GET.get("question_id"))
                serializers = QuestionsSerializer(queryset, context={'current_user_id': _id})
                return Utils.dispatch_success(OK, serializers.data)

            elif request.GET.get("my_questions"):
                # Filter by user created question
                queryset = Questions.objects.all().filter(user=_id).order_by('-last_updated_time')

            elif request.GET.get("latest"):
                # Filter by user latest question
                queryset = Questions.objects.order_by('-last_updated_time')

            elif request.GET.get("votes"):
                # Filter by votes
                queryset = Questions.objects.order_by('-total_points', '-id')

            elif request.GET.get("un_answered"):
                # Filter by unanswered questions
                queryset = Questions.objects.filter(question_object=None).order_by('-last_updated_time')

            else:
                # Get all questions
                queryset = Questions.objects.all().order_by('-last_updated_time')

            if len(queryset) == 0:
                return Utils.dispatch_success(OK, ["No records found"])

            serializers = QuestionsSerializer(queryset, many=True, context={'current_user_id': _id})
            return Utils.dispatch_success(OK, serializers.data)
        except Questions.DoesNotExist:
            return Utils.dispatch_failure(VALIDATION_MISSING, ["Question does not exist"])
        except Exception as e:
            print("Get Questions", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def post(self, request, _id):
        """
        Create new question by user
        """
        try:
            if Utils.is_valid_user(request, _id):
                user = User.objects.get(pk=_id)
                request.data['user'] = _id
                request.data['question_posted_by'] = user.first_name + " " + user.last_name
                question_creation = QuestionsSerializer(data=request.data, context={
                    'current_user_id': _id})
                if question_creation.is_valid():
                    question_object = question_creation.create(request.data)
                    request.data["id"] = question_object.pk
                return Utils.dispatch_success(OK, request.data)
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Create Question", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def put(self, request, _id):
        """
        Update question by user
        """
        try:
            if Utils.is_valid_user(request, _id):
                try:
                    # Validates accepted key values from request
                    cross_check = ["question_id", "total_up_vote", "total_down_vote", "total_points"]
                    for value in cross_check:
                        print(value)
                        if value in request.data:
                            print("yes")
                            return Utils.dispatch_failure(VALIDATION_MISSING, {value: "This field cannot be updated."})
                except KeyError:
                    pass
                try:
                    request.data['user'] = _id
                    question = Questions.objects.get(id=request.data["id"])
                    question_update = QuestionsSerializer(question, data=request.data, partial=True,
                                                          context={'current_user_id': _id})
                    if question_update.is_valid():
                        question_update.save()
                        return Utils.dispatch_success(OK, question_update.data)
                    return Utils.dispatch_success(OK, question_update.errors)
                except KeyError:
                    return Utils.dispatch_failure(VALIDATION_MISSING, {"id": "This field is required"})
                except Questions.DoesNotExist:
                    return Utils.dispatch_failure(VALIDATION_MISSING, ["Question does not exist"])
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Update Question", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def delete(self, request, _id):
        """
        Delete created question by user
        """
        try:
            if Utils.is_valid_user(request, _id):
                try:
                    question_id = request.data["id"]
                except KeyError:
                    return Utils.dispatch_failure(VALIDATION_MISSING, {"id": "This field is required"})
                try:
                    question = Questions.objects.get(id=question_id)
                    question.delete()
                    return Utils.dispatch_success(OK, ["Question deleted successfully."])
                except Questions.DoesNotExist:
                    return Utils.dispatch_failure(VALIDATION_MISSING, ["Question does not exist"])
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Delete Question", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class AnswerApi(views.APIView):
    """
    Raise answers on Community
    """

    def get(self, request, _id):
        """
        Get all answers from Community
        """
        try:
            if request.GET.get("answer_id"):
                # Filter by answer Id
                queryset = Answers.objects.get(id=request.GET.get("answer_id"))
                answer = AnswerSerializer(queryset, context={'current_user_id': _id})
                return Utils.dispatch_success(OK, answer.data)
            elif request.GET.get("question_id"):
                # Filter by question id
                queryset = Answers.objects.all().filter(question_id=request.GET.get("question_id")).order_by(
                    '-last_updated_time')
            elif request.GET.get("my_answers"):
                # Filter by my answers
                queryset = Answers.objects.all().filter(user=_id).order_by('-last_updated_time')
            else:
                # Get all answers
                queryset = Answers.objects.all().order_by('-last_updated_time')
            if len(queryset) == 0:
                return Utils.dispatch_success(OK, ["No records found"])
            serializers = AnswerSerializer(queryset, many=True, context={'current_user_id': _id})
            return Utils.dispatch_success(OK, serializers.data)
        except Answers.DoesNotExist:
            return Utils.dispatch_failure(VALIDATION_MISSING, ["Answer does not exist"])
        except Exception as e:
            print("Get Answer", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def post(self, request, _id):
        """
        Create new answer against the question
        """
        try:
            request.data['user'] = _id
            user = User.objects.get(pk=_id)
            request.data['user'] = _id
            request.data['answer_posted_by'] = user.first_name + " " + user.last_name
            answer_creation = AnswerSerializer(data=request.data, context={'current_user_id': _id})
            check = answer_creation.is_valid()
            if check:
                answer_creation.create(request.data)
            return Utils.dispatch_success(OK, answer_creation.data)
        except Exception as e:
            print("Create Answer", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def put(self, request, _id):
        """
        Update answer against the question
        """
        try:
            if Utils.is_valid_user(request, _id):
                try:
                    cross_check = ["question_id", "total_up_vote", "total_down_vote", "total_points"]
                    for value in cross_check:
                        if value in request.data:
                            print("yes")
                            return Utils.dispatch_failure(VALIDATION_MISSING, {value: "This field cannot be updated."})
                except KeyError:
                    pass
                try:
                    answer_id = request.data["id"]
                except KeyError:
                    return Utils.dispatch_failure(VALIDATION_MISSING, {"id": "This field is required"})
                try:
                    request.data['user'] = _id
                    answer = Answers.objects.get(id=answer_id)
                    answer_update = AnswerSerializer(answer, data=request.data, partial=True,
                                                     context={'current_user_id': _id})
                    if answer_update.is_valid():
                        answer_update.save()
                        return Utils.dispatch_success(OK, answer_update.data)
                    return Utils.dispatch_success(OK, answer_update.errors)

                except Answers.DoesNotExist:
                    return Utils.dispatch_failure(VALIDATION_MISSING, ["Answer does not exist"])
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Update Answer", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def delete(self, request, _id):
        """
        Delete answer against the question
        """
        try:
            if Utils.is_valid_user(request, _id):
                try:
                    answer_id = request.data["answer_id"]
                except KeyError:
                    return Utils.dispatch_failure(VALIDATION_MISSING, {"answer_id": "This field is required"})
                try:
                    answer = Answers.objects.get(id=answer_id)
                    answer.delete()
                    return Utils.dispatch_success(OK, ["Answer deleted successfully."])
                except Answers.DoesNotExist:
                    return Utils.dispatch_failure(VALIDATION_MISSING, ["Answer does not exist"])
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Delete Answer", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class VoteApi(views.APIView):
    """
    Vote-Upvote or DownVote the question/answer in community
    """

    def post(self, request, _id):
        try:
            user_object = User.objects.get(pk=_id)

            # Validate Key Value exist
            if "question_id" in request.data and "answer_id" in request.data:
                return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))
            elif "type" not in request.data:
                return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))
            elif "question_id" in request.data:
                # If request is valid for question
                question_id = request.data["question_id"]
                if request.data["type"] == "up_vote":
                    # If type is valid for Up Vote
                    try:
                        question_object = Questions.objects.get(pk=question_id)
                    except Questions.DoesNotExist:
                        return Utils.dispatch_failure(VALIDATION_MISSING, ["Question does not exist"])
                    try:
                        vote_object = Vote.objects.filter(question_id=question_id, user=_id)[0]
                        print(vote_object.user.pk, _id)
                        if int(vote_object.user.pk) == int(_id):
                            print("User correct Verifying")
                            if vote_object.is_question_up_voted is True:
                                print("Already exist")
                                return Utils.dispatch_success(OK, ["You have already voted. Thanks!"])
                        else:
                            vote_object = Vote(user=user_object,
                                               question_id=question_object, )
                    except Vote.DoesNotExist:
                        vote_object = Vote(user=user_object,
                                           question_id=question_object,
                                           )
                    except IndexError:
                        vote_object = Vote(user=user_object,
                                           question_id=question_object,
                                           )

                    vote_object.is_question_up_voted = True
                    vote_object.is_question_down_voted = False
                    vote_object.save()
                    # To avoid showing 0 to user
                    if question_object.total_points == -1:
                        question_object.total_up_vote = question_object.total_up_vote + 1
                    question_object.total_up_vote = question_object.total_up_vote + 1

                    # Increase Vote For User
                    question_object.total_points = question_object.total_up_vote - abs(question_object.total_down_vote)
                    question_object.save()
                    # Save total_points in Balance
                    balance = Balance.objects.get(user=question_object.user)
                    balance.total_points = question_object.total_points
                    balance.save()

                elif request.data["type"] == "down_vote":
                    # If type is valid for Down Vote
                    try:
                        question_object = Questions.objects.get(pk=question_id)
                    except Questions.DoesNotExist:
                        return Utils.dispatch_failure(VALIDATION_MISSING, ["Question does not exist"])
                    try:
                        vote_object = Vote.objects.filter(question_id=question_id, user=_id)[0]
                        print(vote_object.user.pk, _id)
                        if int(vote_object.user.pk) == int(_id):
                            print("User correct Verifying")
                            if vote_object.is_question_down_voted is True:
                                print("Already exist")
                                return Utils.dispatch_success(OK, ["You have already voted. Thanks!"])
                        else:
                            vote_object = Vote(user=user_object,
                                               question_id=question_object, )
                    except Vote.DoesNotExist:
                        vote_object = Vote(user=user_object,
                                           question_id=question_object,
                                           )
                    except IndexError:
                        vote_object = Vote(user=user_object,
                                           question_id=question_object,
                                           )

                    vote_object.is_question_up_voted = False
                    vote_object.is_question_down_voted = True
                    vote_object.save()

                    question_object.total_down_vote = question_object.total_down_vote - 1

                    # Decrease Vote For User
                    question_object.total_points = question_object.total_up_vote - abs(question_object.total_down_vote)
                    question_object.save()
                    # Save total_points in Balance
                    balance = Balance.objects.get(user=question_object.user)
                    balance.total_points = question_object.total_points
                    balance.save()

                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))
                return Utils.dispatch_success(OK, ["Vote successful"])

            elif "answer_id" in request.data:
                # If type is valid for Answer
                answer_id = request.data["answer_id"]
                if request.data["type"] == "up_vote":
                    # If type is valid for Up Vote
                    try:
                        answer_object = Answers.objects.get(pk=answer_id)
                    except Answers.DoesNotExist:
                        return Utils.dispatch_failure(VALIDATION_MISSING, ["Answer does not exist"])
                    try:
                        vote_object = Vote.objects.filter(answer_id=answer_id, user=_id)[0]
                        print(vote_object.user.pk, _id)
                        if int(vote_object.user.pk) == int(_id):
                            print("User correct Verifying")
                            if vote_object.is_answer_up_voted is True:
                                print("Already exist")
                                return Utils.dispatch_success(OK, ["You have already voted. Thanks!"])
                        else:
                            vote_object = Vote(user=user_object,
                                               answer_id=answer_object, )
                    except Vote.DoesNotExist:
                        vote_object = Vote(user=user_object,
                                           answer_id=answer_object,
                                           )
                    except IndexError:
                        vote_object = Vote(user=user_object,
                                           answer_id=answer_object,
                                           )

                    vote_object.is_answer_up_voted = True
                    vote_object.is_answer_down_voted = False
                    vote_object.save()
                    # To avoid showing 0 to user
                    if answer_object.total_points == -1:
                        answer_object.total_up_vote = answer_object.total_up_vote + 1

                    # Increase Vote For User
                    answer_object.total_up_vote = answer_object.total_up_vote + 1

                    answer_object.total_points = answer_object.total_up_vote - abs(answer_object.total_down_vote)
                    answer_object.save()

                    # Save total_points in Balance
                    balance = Balance.objects.get(user=answer_object.user)
                    balance.total_points = answer_object.total_points
                    balance.save()

                elif request.data["type"] == "down_vote":
                    # If type is valid for Down Vote
                    try:
                        answer_object = Answers.objects.get(pk=answer_id)
                    except Answers.DoesNotExist:
                        return Utils.dispatch_failure(VALIDATION_MISSING, ["Answer does not exist"])
                    try:
                        vote_object = Vote.objects.filter(answer_id=answer_id, user=_id)[0]
                        print(vote_object.user.pk, _id)
                        if int(vote_object.user.pk) == int(_id):
                            print("User correct Verifying")
                            if vote_object.is_answer_down_voted is True:
                                print("Already exist")
                                return Utils.dispatch_success(OK, ["You have already voted. Thanks!"])
                        else:
                            vote_object = Vote(user=user_object,
                                               answer_id=answer_object, )
                    except Vote.DoesNotExist:
                        vote_object = Vote(user=user_object,
                                           answer_id=answer_object,
                                           )
                    except IndexError:
                        vote_object = Vote(user=user_object,
                                           answer_id=answer_object,
                                           )

                    vote_object.is_answer_up_voted = False
                    vote_object.is_answer_down_voted = True
                    vote_object.save()

                    # Decrease Vote For User
                    answer_object.total_down_vote = answer_object.total_down_vote - 1
                    answer_object.total_points = answer_object.total_up_vote - abs(answer_object.total_down_vote)
                    answer_object.save()

                    # Save total_points in Balance
                    balance = Balance.objects.get(user=answer_object.user)
                    balance.total_points = answer_object.total_points
                    balance.save()

                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))
                return Utils.dispatch_success(OK, ["Vote successful"])


            else:
                return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))
        except User.DoesNotExist:
            return Utils.dispatch_failure(USER__NOT_EXIST)
        except Exception as e:
            print("Up Vote/Down Vote", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class Dashboard(views.APIView):
    """
    Dashboard of community user
    """

    def get(self, request, _id):
        """
        Get Dashboard details
        """
        try:
            if Utils.is_valid_user(request, _id):
                question_queryset = Questions.objects.filter(user=_id)
                answer_queryset = Answers.objects.filter(user=_id)
                questions_count = len(question_queryset)
                answers_count = len(answer_queryset)

                total_points_from_question, total_points_from_answer = question_queryset.aggregate(Sum("total_points")), \
                                                                       answer_queryset.aggregate(Sum("total_points"))
                total_coins_from_question = total_points_from_question["total_points__sum"]
                total_coins_from_answer = total_points_from_answer["total_points__sum"]

                # To check no object value and assign to 0
                if total_coins_from_question is None:
                    total_coins_from_question = 0
                if total_coins_from_answer is None:
                    total_coins_from_answer = 0

                total_coins_gained = total_coins_from_question + total_coins_from_answer
                response = {"total_questions_posted": questions_count,  # Total Questions posted by user
                            "total_answers_posted": answers_count,  # Total Answers posted by user
                            "total_coins_from_question": total_coins_from_question,  # Total Coins Gained From Questions
                            "total_coins_from_answer": total_coins_from_answer,  # Total Coins Gained From Answers
                            "total_coins_gained": total_coins_gained,  # Total Coins Gained
                            }

                return Utils.dispatch_success(OK, response)

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Get Dashboard", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class Community(views.APIView):
    """
    Community profile
    """

    def get(self, request, _id):
        """
        Get community profile for dashboard list
        """
        try:
            if Utils.is_valid_user(request, _id):

                if request.GET.get("top_points"):

                    balance_queryset = Balance.objects.all().order_by('-total_points')
                    if len(balance_queryset) == 0:
                        return Utils.dispatch_success(OK, ["No records found"])
                    question_serializers = TopPointsBalanceSerializer(balance_queryset, many=True)
                    return Utils.dispatch_success(OK, question_serializers.data)
                elif request.GET.get("user_max_questions"):

                    question_queryset = Questions.objects.all().order_by('user', '-last_updated_time').distinct('user')
                    if len(question_queryset) == 0:
                        return Utils.dispatch_success(OK, ["No records found"])
                    question_serializers = QuestionsMaxDataSerializer(question_queryset, many=True)
                    reverse_sorted_by_count = sorted(question_serializers.data, key=lambda x: x['question_count'],
                                                     reverse=True)
                    return Utils.dispatch_success(OK, reverse_sorted_by_count)
                elif request.GET.get("user_max_answers"):

                    answer_queryset = Answers.objects.all().order_by('user', '-last_updated_time').distinct('user')
                    if len(answer_queryset) == 0:
                        return Utils.dispatch_success(OK, ["No records found"])
                    answer_serializers = AnswersMaxDataSerializer(answer_queryset, many=True)
                    reverse_sorted_by_count = sorted(answer_serializers.data, key=lambda x: x['answer_count'],
                                                     reverse=True)
                    return Utils.dispatch_success(OK, reverse_sorted_by_count)
                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING, error.error_messages.get(INVALID_PARAMETERS))

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Get community", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

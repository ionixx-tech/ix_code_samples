import calendar
import datetime

import requests
from django.contrib.auth.models import User
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import Sum, Max, Q
from django.utils import timezone
from django.utils.timezone import utc
from rest_framework import views, generics
from rest_framework.permissions import AllowAny

from ixcoin_backend.api.accounts.models import UserSession, ForgotPasswordRequest, Transaction, Balance, MarketValue, \
    TradeOrder
from ixcoin_backend.api.accounts.serializers import UserSerializer, CreateUserSerializer, LoginSerializer, \
    UserLoginSerializer, ForgotPasswordValidationSerializer, ForgotPasswordSerializer, TransactionSerializer, \
    BalanceSerializer, TradeOrderApiSerializer, ContactUsSerializer
from ixcoin_backend.api.blockchain.block_chain import BlockChain
from ixcoin_backend.api.utils import Utils, PageNumberPaginationDataOnly
from ixcoin_backend.error import INVALID_USER_PASSWORD, INTERNAL_SERVER_ERROR, BAD_REQUEST, OK, ACCESS_DENIED, \
    NOT_FOUND, VALIDATION_MISSING, RESOURCE_NOT_FOUND, TOKEN_EXPIRED, \
    MISSING_PARAMETERS, USERNAME_NOT_FOUND, UNAUTHORIZED_ACCESS, INVALID_OWNER, INVALID_TRADE, ACTIVATION_EXPIRED
from ixcoin_backend.settings import SESSION_EXPIRE_MINUTES, APP_NAME, FORGOT_PASSWORD_EMAIL_BODY, \
    FORGOT_PASSWORD_EMAIL_URL, CROWD_SALE_START_TIME, CROWD_SALE_END_TIME, TOTAL_TOKEN_SUPPLY, CURRENCY_SYMBOL, \
    CURRENCY_NAME, CROWD_SALE_ENABLED, USER_ACCOUNT_ACTIVATE_SUBJECT, USER_ACCOUNT_ACTIVATE_BODY, \
    USER_ACCOUNT_ACTIVATE_LINK, WEB3_URL_SELECTION


class UserList(generics.ListCreateAPIView):
    """
    Lists all users
    """
    pagination_class = PageNumberPaginationDataOnly
    serializer_class = CreateUserSerializer

    def get(self, request, *args, **kwargs):
        try:
            queryset = User.objects.all().order_by('id')
            serializer = self.get_serializer(queryset, many=True)
            return Utils.dispatch_success(OK, serializer.data)
        except Exception as e:
            print("UserList", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        """
        Create new user
        """
        try:
            self.serializer_class = CreateUserSerializer
            serializer = CreateUserSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()

                """
                Create New Row in Balance Table
                """
                Utils.create_balance_entry(serializer.data['id'])

                """
                Create New Row in Community Model for Tracking
                """
                if request.data["user_type"] == "General":
                    Utils.create_community_entry(serializer.data['id'])

                auth_token = serializer['auth_token'].value
                name = str(serializer.data['first_name'] + " " + serializer.data["last_name"]).title()
                mail_body = USER_ACCOUNT_ACTIVATE_BODY % (
                    name, "'" + serializer.data["username"] + "'",
                    USER_ACCOUNT_ACTIVATE_LINK + auth_token)
                Utils.send_mail([request.data['email']], USER_ACCOUNT_ACTIVATE_SUBJECT, mail_body)

                return Utils.dispatch_success(OK)
            return Utils.dispatch_failure(VALIDATION_MISSING, serializer.errors)
        except Exception as e:
            print("Create New User", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class UserActivation(views.APIView):
    """
    Activate user account
    """

    def post(self, request, token):
        try:
            user = User.objects.get(auth_token=token)
            if user.is_active is False:
                # If user is not already active
                user.is_active = True
                user.save()
                return Utils.dispatch_success(OK)
            else:
                return Utils.dispatch_failure(ACTIVATION_EXPIRED)
        except User.DoesNotExist:
            # If user do not have valid authentication
            return Utils.dispatch_failure(ACTIVATION_EXPIRED)
        except Exception as e:
            print("User Activation", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class UserDetail(views.APIView):
    """
    Retrieve, update or delete a user interface
    """

    def get(self, request, _id):
        """
        Gets the Detail of a user by their ID
        """
        try:
            if Utils.is_valid_user(request, _id):
                user = User.objects.get(id=_id)
                serializer = UserSerializer(user, context={'request': request})
                return Utils.dispatch_success(OK, serializer.data)
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except User.DoesNotExist:
            # If user not exist
            return Utils.dispatch_failure(NOT_FOUND)
        except Exception as e:
            print("Get User Detail", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def put(self, request, _id):
        """
        Updates the user by their ID
        """
        try:
            if Utils.is_valid_user(request, _id):
                user = User.objects.get(id=_id)
                serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Utils.dispatch_success(OK, serializer.data)

                return Utils.dispatch_failure(BAD_REQUEST, serializer.errors)
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except User.DoesNotExist:
            # If user not exist
            return Utils.dispatch_failure(NOT_FOUND)
        except Exception as e:
            print("Update User Detail", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def delete(self, _id, format=None):
        """
        Deletes the user by their ID
        """
        try:
            user = User.objects.get(id=_id)
            if user.is_superuser:
                user.delete()
                return Utils.dispatch_success(OK, ['DELETED_SUCCESSFULLY'])
            else:
                return Utils.dispatch_failure(ACCESS_DENIED)
        except Exception as e:
            print("Delete User", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class LoginView(views.APIView):
    """
    Logs in the user with a post request
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        """
        Login User
        """
        try:
            validate_user = LoginSerializer(data=request.data)
            if validate_user.is_valid():
                # If Login credential is valid
                user = validate_user.validated_data
                user.last_login = timezone.now()
                user.save()

                # Get User Profile
                serializer = UserLoginSerializer(user, context={'request': request})
                if UserSession.objects.filter(user=user).count():
                    UserSession.objects.filter(user=user).delete()
                now = datetime.datetime.utcnow().replace(tzinfo=utc)
                token = Utils.generate_unique_token()
                UserSession.objects.create(user=user, start_time=now, auth_key=token,
                                           end_time=now + datetime.timedelta(minutes=SESSION_EXPIRE_MINUTES))
                data = serializer.data

                # Add Additional information
                data['session_expiry_timeout'] = SESSION_EXPIRE_MINUTES
                data['token'] = token
                return Utils.dispatch_success(OK, data)
            else:
                return Utils.dispatch_failure(INVALID_USER_PASSWORD)
        except Exception as e:
            print("Login User", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class EmailValidation(views.APIView):
    """
    Forgot Password Initiator using email
    """
    permission_classes = (AllowAny,)
    serializer_class = ForgotPasswordValidationSerializer

    def post(self, request, *args, **kwargs):

        try:
            username = request.data.get("username")
            # Check if username parameter is on request
            if "username" not in request.data:
                return Utils.dispatch_failure(RESOURCE_NOT_FOUND)

            # Check if username is valid
            if username is None:
                return Utils.dispatch_failure(VALIDATION_MISSING)

            # Check if username is registered
            user = User.objects.get(username=username)
            if not user:
                return Utils.dispatch_failure(USERNAME_NOT_FOUND)

            # Generate unique token
            token = Utils.generate_unique_token()

            # Save forgot password details in table
            forgot_password = ForgotPasswordRequest(user=user, email=user.email, token=token,
                                                    request_time=datetime.datetime.utcnow().replace(tzinfo=utc),
                                                    expiry_time=int(30))
            forgot_password.save()

            # Send email to user for password change
            subject = APP_NAME
            body = "Hi " + user.first_name.title() + " " + user.last_name.title() + ",\n\n" + FORGOT_PASSWORD_EMAIL_BODY + FORGOT_PASSWORD_EMAIL_URL + str(
                token) + "/\n"
            Utils.send_mail([user.email, ], subject=subject, body=body)

        except MultipleObjectsReturned as e:
            return Utils.dispatch_success(OK, ["EMAIL_SEND"])
        except Exception as e:
            print("Forgot Password Request", e)
            return Utils.dispatch_success(OK, ["EMAIL_SEND"])
        return Utils.dispatch_success(OK, ["EMAIL_SEND"])


class ForgotPassword(views.APIView):
    """
    Forgot Password Handler
    """
    permission_classes = (AllowAny,)
    serializer_class = ForgotPasswordSerializer

    def get(self, request, token, ):
        """
        Forgot Password Token Validator
        """
        try:
            forgot_password_request = ForgotPasswordRequest.objects.get(token=token)
            request_time = forgot_password_request.request_time
            expiry_time_min = forgot_password_request.expiry_time
            current_time = datetime.datetime.utcnow().replace(tzinfo=utc)
            expiry_time = request_time + datetime.timedelta(minutes=expiry_time_min)

            # Validates the password change token is valid and not expired the time limit
            if expiry_time >= current_time and not forgot_password_request.is_expired:
                return Utils.dispatch_success(OK, ["TOKEN_VALID"])
            else:
                return Utils.dispatch_failure(TOKEN_EXPIRED)
        except ForgotPasswordRequest.DoesNotExist:
            return Utils.dispatch_failure(TOKEN_EXPIRED)
        except Exception as e:
            print("Forgot Password Token Validation", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def post(self, request, token, ):
        """
        Forgot Password Password Change
        """
        try:
            forgot_password_request = ForgotPasswordRequest.objects.get(token=token)
            user = forgot_password_request.user
            password = request.data.get("password")
            reenter_password = request.data.get("reenter_password")

            # Validates required Param
            if password is None or reenter_password is None:
                return Utils.dispatch_failure(MISSING_PARAMETERS)

            elif password == reenter_password and (password is not "" or reenter_password is not ""):
                if forgot_password_request.is_expired:
                    return Utils.dispatch_failure(TOKEN_EXPIRED)

                # If password is valid, save the changes to model
                u = User.objects.get(username=str(user))
                u.set_password(password)
                u.save()
                forgot_password_request.is_expired = True
                forgot_password_request.save()
            else:
                return Utils.dispatch_failure(VALIDATION_MISSING)
        except MultipleObjectsReturned:
            return Utils.dispatch_failure(TOKEN_EXPIRED)
        except ForgotPasswordRequest.DoesNotExist:
            return Utils.dispatch_failure(TOKEN_EXPIRED)
        except Exception as e:
            print("Forgot Password Password Change", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

        return Utils.dispatch_success(OK, ["PASSWORD_RESET_SUCCESSFUL"])


class CrowdSale(views.APIView):
    """
    API fetches constant values of Crowdsale Details
    """

    def get(self, request, ):
        """
        Get Crowdsale, Open API
        """
        try:
            now = datetime.datetime.now()
            current_time = now.strftime('%c')
            current_time_epoch = calendar.timegm(now.utctimetuple())

            start_time = datetime.datetime.fromtimestamp(CROWD_SALE_START_TIME).strftime('%c')
            end_time = datetime.datetime.fromtimestamp(CROWD_SALE_END_TIME).strftime('%c')
            return Utils.dispatch_success(OK, {
                "current_time": current_time,  # Crowd sale current time
                "start_time": start_time,  # Crowd sale start time
                "end_time": end_time,  # Crowd sale end time
                "current_time_epoch": current_time_epoch,  # Crowd sale current time in epoch
                "start_time_epoch": CROWD_SALE_START_TIME,  # Crowd sale start time in epoch
                "end_time_in_epoch": CROWD_SALE_END_TIME  # Crowd sale end time in epoch
            })
        except Exception as e:
            print("Get CrowdSale Status", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class CrowdSaleStatus(views.APIView):
    """
    API fetches constant Crowd_Sale Details
    """

    def get(self, request):
        """
        Get Crowd_Sale Info
        """
        try:
            crowd_sale_queryset = Transaction.objects.filter(transaction_type=Transaction.CROWDSALE)
            ether_spent = crowd_sale_queryset.aggregate(Sum('ether_spent')
                                                        )
            token_spent = crowd_sale_queryset.aggregate(Sum('token_spent'))
            total_ether_invested, total_token_distributed = ether_spent["ether_spent__sum"], token_spent[
                "token_spent__sum"]
            if total_ether_invested is None:
                total_ether_invested = 0
            if total_token_distributed is None:
                total_token_distributed = 0
            last_updated_time__sum = Balance.objects.aggregate(Max('last_updated_time'))
            last_updated_time = last_updated_time__sum["last_updated_time__max"].strftime('%c')
            last_updated_time_epoch = last_updated_time__sum["last_updated_time__max"].strftime('%s')

            total_token_supply = TOTAL_TOKEN_SUPPLY
            print(crowd_sale_queryset)
            total_investors = Transaction.objects.filter(Q(transaction_type=Transaction.CROWDSALE)).distinct('user')
            total_investors = len(total_investors)

            response = {"total_ether_invested": total_ether_invested,  # Total Ether User Invested in Crowd_Sale
                        "total_token_distributed": total_token_distributed,  # Total Token Buy By Users
                        "last_updated_time": last_updated_time,  # Last buy time of token
                        "last_updated_time_epoch": last_updated_time_epoch,  # Last buy time of token in epoch
                        "total_token_supply": total_token_supply,  # Total token supply
                        "total_investors": total_investors  # Total Number Of Investors
                        }

            return Utils.dispatch_success(OK, response)
        except Exception as e:
            print("Get CrowdSale Detailed Status", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class TransactionList(views.APIView):
    """
    List all transaction of the user and create new transaction
    """

    def get(self, request, _id, *args, **kwargs):
        """
        Get Transaction List
        """
        try:
            if Utils.is_valid_user(request, _id):
                user = User.objects.get(id=_id)
                queryset = Transaction.objects.filter(user=user)
                if len(queryset) == 0:
                    return Utils.dispatch_success(OK, ["No records found"])
                serializer = TransactionSerializer(queryset, many=True)
                return Utils.dispatch_success(OK, serializer.data)
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("List Transaction", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

    def put(self, request, _id):
        """
        Create New Transaction
        """
        try:
            index = _id
            if Utils.is_valid_user(request, index):
                request.data["user"] = index
                request.data["purchase_time"] = datetime.datetime.utcnow().replace(tzinfo=utc)
                print(request.data)
                transaction = TransactionSerializer(data=request.data, context=request)
                check, data = transaction.is_valid()
                if check:
                    transaction.save()
                    from ixcoin_backend.api.accounts.models import Balance
                    try:
                        user = Utils.get_user(index)
                        investor = Balance.objects.get(user=user)

                        # Buy Sell Calculation [Add token to user]
                        investor.total_coin_balance = total_coin_balance = investor.total_coin_balance + request.data[
                            "token_spent"]
                        investor.total_ether_spent = total_ether_spent = investor.total_ether_spent + request.data[
                            "ether_spent"]
                        if total_coin_balance <= 0:
                            investor.total_coin_balance = total_coin_balance = 0
                        if total_ether_spent <= 0:
                            investor.total_ether_spent = total_ether_spent = 0

                        investor.last_updated_time = datetime.datetime.utcnow().replace(tzinfo=utc)
                        investor.save()
                    except Balance.DoesNotExist:
                        total_coin_balance = 0 + request.data["token_spent"]
                        total_ether_spent = 0 + request.data["ether_spent"]

                        if total_coin_balance <= 0:
                            total_coin_balance = 0
                        if total_ether_spent <= 0:
                            total_ether_spent = 0

                        Utils.create_balance_entry(index, total_coin_balance,
                                                   total_ether_spent)
                    request.data['total_coin_balance'] = total_coin_balance
                    request.data['total_ether_spent'] = total_ether_spent
                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING, data)

                # To track market value for Coin supply

                market_value = MarketValue.objects.latest('last_updated_time')
                circulating_supply = (market_value.circulating_supply + request.data[
                    "token_spent"])

                # https://coinmarketcap.com/faq/
                # Market Capitalization is one way to rank the relative size of a cryptocurrency. It's calculated by multiplying the Price by the Circulating Supply.
                # Market Cap = Price X Circulating Supply.
                market_cap = market_value.price * circulating_supply

                # Based on current_price = Market Cap / Circulating Supply.
                current_price = market_cap / market_value.circulating_supply
                MarketValue(
                    coin_name=CURRENCY_NAME,
                    volume=market_value.volume,
                    market_cap=market_cap,
                    price=current_price,
                    circulating_supply=circulating_supply,
                    coin_symbol=CURRENCY_SYMBOL,
                ).save()

                return Utils.dispatch_success(OK, request.data)
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except KeyError as e:
            return Utils.dispatch_failure(VALIDATION_MISSING, {str(e): "This field is required."})
        except Exception as e:
            print("Create Transaction", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class TransactionAPI(views.APIView):
    """
    Track Transaction on coin Usage
    """

    def get(self, request, _id, transaction_hash=None):
        """
        Get Transaction of particular transaction hash
        """
        try:
            if Utils.is_valid_user(request, _id):
                if transaction_hash is None:
                    return Utils.dispatch_failure(VALIDATION_MISSING, {"transaction_hash": "This field is required."})

                queryset = Transaction.objects.filter(transaction_hash=transaction_hash)
                if len(queryset) == 0:
                    return Utils.dispatch_success(OK, ["No matching record found"])
                serializer = TransactionSerializer(queryset, many=True)

                return Utils.dispatch_success(OK, serializer.data)

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Get transaction from hash", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class BalanceAPI(views.APIView):
    """
    Track Balance of the user
    """

    def get(self, request, _id):
        """
        Get Balance Of User
        """
        try:
            if Utils.is_valid_user(request, _id):
                user = User.objects.get(id=_id)
                queryset = Balance.objects.filter(user=user)
                if len(queryset) == 0:
                    return Utils.dispatch_success(OK, ["No records found"])
                serializer = BalanceSerializer(queryset, many=True)
                return Utils.dispatch_success(OK, serializer.data)

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Get Balance", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class CollectRewardFromCoin(views.APIView):
    """
    Credit IX_COIN TO THE USER WHO HAVE CONTRIBUTED TO THE COMMUNITY PORTAL
    """

    def post(self, request, _id):
        """
        Reward Coin to User
        """

        try:
            if Utils.is_valid_user(request, _id):
                reward_address = request.data["reward_address"]
                if reward_address is "" and len(reward_address) > 10:
                    return Utils.dispatch_failure(VALIDATION_MISSING,
                                                  {'reward_address': "Parameter is invalid."})
                user = User.objects.get(id=_id)

                balance_object = Balance.objects.get(user=user)
                token_reward = balance_object.total_points

                if token_reward > 0.0:

                    '''Transfer the credit to the user account who have gained the points over community'''
                    block_chain_instant = BlockChain(WEB3_URL_SELECTION)
                    transaction_hash = block_chain_instant.transfer_token(token_reward, reward_address)
                    balance_object.total_points = 0.0
                    balance_object.save()
                    transaction_request = {"user": _id,
                                           "transaction_hash": transaction_hash,
                                           "transaction_type": "reward",
                                           "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                           "ether_spent": 0,
                                           "token_spent": token_reward}
                    transaction = TransactionSerializer(data=transaction_request)
                    check, data = transaction.is_valid()
                    if check:
                        transaction.save()
                    return Utils.dispatch_success(OK, {'transaction_hash': transaction_hash})
                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING,
                                                  ["You do not have sufficient points to process this request"])
            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except KeyError as e:
            return Utils.dispatch_failure(VALIDATION_MISSING, {str(e): "This field is required."})
        except Exception as e:
            print("Reward Coin To User", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class CryptocurrencyAPI(views.APIView):
    """
    Get Cryptocurrency Market Capitalization from https://coinmarketcap.com/api/
    """

    def get(self, request, limit=None):
        """
        Get Cryptocurrency latest trends
        """
        try:
            limit = request.GET.get("limit", None)
            start = request.GET.get("start", None)
            convert = request.GET.get("convert", None)

            # Conditions are matched depend upon the api request of coin market cap
            if limit is None and start is None and convert is None:
                url = 'https://api.coinmarketcap.com/v1/ticker/'
                ticker_data = requests.get(url).json()
            elif start is not None and limit is not None:
                url = 'https://api.coinmarketcap.com/v1/ticker/?start=' + start + '&limit=' + limit
                ticker_data = requests.get(url).json()
            elif convert is not None and limit is not None:
                url = 'https://api.coinmarketcap.com/v1/ticker/?convert=' + convert + '&limit=' + limit
                ticker_data = requests.get(url).json()
            elif limit is not None:
                url = 'https://api.coinmarketcap.com/v1/ticker/?limit=' + limit
                ticker_data = requests.get(url).json()
            else:
                ticker_data = {"No data found"}

            return Utils.dispatch_success(OK, ticker_data)
        except Exception as e:
            print("Get Crypto Currency Market Value ", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class Logout(views.APIView):
    """
    Logout user
    """

    def delete(self, request, _id):
        try:
            # Delete the User Session
            token = request.META.get('HTTP_AUTHORIZATION', None)
            token_obj = UserSession.objects.all().count()
            if token_obj == 0:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
            try:
                token_obj = UserSession.objects.get(auth_key=token)
                token_obj.delete()
            except UserSession.DoesNotExist:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
            return Utils.dispatch_success(OK)

        except Exception as e:
            print("Logout User ", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class Ixcoin(views.APIView):
    """
    API fetches Ixcoin Details with market price
    """

    def get(self, request):
        """
        Get Market value of Coin
        """
        try:
            # Get latest updated market_value
            if CROWD_SALE_ENABLED:
                market_value = MarketValue.objects.earliest('last_updated_time')
            else:
                market_value = MarketValue.objects.latest('last_updated_time')

            response = {
                "name": market_value.coin_name,  # IX COIN NAME
                "volume": market_value.volume,  # IX COIN VOLUME
                "market_cap": market_value.market_cap,  # IX COIN MARKET CAP
                "price": market_value.price,  # IX COIN Market Price
                "circulating_supply": market_value.circulating_supply,  # IX COIN CIRCULATING SUPPLY
                "symbol": market_value.coin_symbol,  # IX COIN SYMBOL
                "last_updated_time": market_value.last_updated_time,  # LAST UPDATED TIME OF IXCOIN PRICE
                "last_updated_time_epoch": market_value.last_updated_time.strftime('%s'),
            # LAST UPDATED TIME OF IXCOIN PRICE in epoch
            }

            return Utils.dispatch_success(OK, response)
        except Exception as e:
            print("Get IX_COIN", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class TradeOrderApi(views.APIView):
    """
    Bit & Ask in Trade
    """

    def get(self, request, _id, *args, **kwargs):
        """
        Get all ask, bit, open and sold_out orders
        """
        try:
            if Utils.is_valid_user(request, _id):

                # Validates the type of trade [Valid Conditions are ask,bit,open,sold_out]
                try:
                    ask = int(request.GET.get("ask"))
                except TypeError as e:
                    ask = 0
                try:
                    bit = int(request.GET.get("bit"))
                except TypeError as e:
                    bit = 0
                try:
                    open = int(request.GET.get("open"))
                except TypeError as e:
                    open = 0
                try:
                    sold_out = int(request.GET.get("sold_out"))
                except TypeError as e:
                    sold_out = 0

                if bit == 1 and ask == 1:
                    queryset = TradeOrder.objects.filter(status__startswith="WAITING FOR").order_by(
                        '-last_updated_time')
                elif open == 1 and sold_out == 1:
                    queryset = TradeOrder.objects.filter(Q(buyer=_id) | Q(seller=_id))
                elif open == 1:
                    queryset = TradeOrder.objects.filter((Q(buyer=_id) & Q(status__startswith="WAITING FOR")) | (
                        Q(seller=_id) & Q(status__startswith="WAITING FOR"))).order_by('-last_updated_time')
                elif sold_out == 1:
                    queryset = TradeOrder.objects.filter(
                        (Q(seller=_id) & Q(status="STOCK PAID")) | (Q(buyer=_id) & Q(status="STOCK PAID")) | Q(
                            buyer=_id) & Q(status="CANCELLED") | Q(seller=_id) & Q(status="CANCELLED")).order_by(
                        '-last_updated_time')
                elif bit == 1:
                    queryset = TradeOrder.objects.filter(status="WAITING FOR SELLER").order_by('-last_updated_time')
                elif ask == 1:
                    queryset = TradeOrder.objects.filter(status="WAITING FOR BUYER").order_by('-last_updated_time')
                else:
                    return Utils.dispatch_failure(RESOURCE_NOT_FOUND)

                if len(queryset) == 0:
                    return Utils.dispatch_success(OK, ["No records found"])
                serializer = TradeOrderApiSerializer(queryset, many=True)
                return Utils.dispatch_success(OK, serializer.data)

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except Exception as e:
            print("Get Trade Order", e)
            return Utils.dispatch_failure(RESOURCE_NOT_FOUND, {str(e)})

    def put(self, request, _id):
        """
        Bit & ask order
        """
        try:
            index = _id
            if Utils.is_valid_user(request, index):

                # buyer,price,amount,total,seller,trade_method,status
                # trade_method: LIMIT ORDER,MARKET ORDER
                # status: WAITING FOR SELLER,CANCELLED,STOCK PAID

                transaction_type = request.data["transaction_type"]
                if transaction_type == "BIT_REQUEST":
                    """
                    Bit in Trade - Price a buyer is willing to pay a stock
                    """

                    # BUY IN ETHER
                    request.data["buyer"] = index
                    request.data["seller"] = None
                    request.data["status"] = "WAITING FOR SELLER"

                    trade_bit = TradeOrderApiSerializer(data=request.data, context=request)
                    check, data = trade_bit.is_valid()
                    if check:

                        # Ether spent value is saved for tracking
                        total_price = float(request.data["price"]) * float(request.data["amount"])
                        user = User.objects.get(id=index)
                        user_balance = Balance.objects.get(user=user)
                        total_ether_spent = user_balance.total_ether_spent

                        user_balance.total_ether_spent = total_ether_spent + total_price
                        user_balance.save()

                        save = trade_bit.save()

                        # Transaction logged for tracking
                        transaction_request = {"transaction_type": "trade", "user": _id,
                                               "transaction_hash": request.data["transaction_hash"],
                                               "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                               "ether_spent": request.data["total"],
                                               "token_spent": request.data["amount"]
                                               }
                        transaction = TransactionSerializer(data=transaction_request, context=request)
                        check, data = transaction.is_valid()

                        if check:
                            transaction.save()
                        request.data["id"] = save.pk
                        return Utils.dispatch_success(OK, request.data)
                    else:

                        return Utils.dispatch_failure(VALIDATION_MISSING, data)
                elif transaction_type == "SELL":
                    """
                    USER SELLS THE IXCOIN FOR ETHER
                    """
                    request.data["seller"] = index
                    trade_bit = TradeOrder.objects.get(id=request.data['id'])
                    if trade_bit.status == "WAITING FOR SELLER":
                        # BUY IN IXCOIN
                        total_price = trade_bit.price * trade_bit.amount

                        user = User.objects.get(id=index)
                        user_balance = Balance.objects.get(user=user)
                        balance = user_balance.total_coin_balance

                        trade_bit.seller = user
                        trade_bit.status = "STOCK PAID"

                        user_balance.total_coin_balance = balance - total_price
                        user_balance.save()
                        trade_bit.last_updated_time = datetime.datetime.utcnow().replace(tzinfo=utc)
                        trade_bit.save()

                        # Transaction logged for tracking
                        transaction = {"transaction_type": "trade", "user": _id,
                                       "transaction_hash": request.data["transaction_hash"],
                                       "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                       "ether_spent": trade_bit.total,
                                       "token_spent": trade_bit.amount
                                       }
                        transaction = TransactionSerializer(data=transaction, context=request)
                        check, data = transaction.is_valid()

                        if check:
                            transaction.save()
                        return Utils.dispatch_success(OK, request.data)
                    else:
                        return Utils.dispatch_failure(INVALID_TRADE)
                elif transaction_type == "ASK_REQUEST":
                    """
                    Ask in Trade - Price a seller is willing to sell their shares
                    """
                    request.data["buyer"] = None
                    request.data["seller"] = index
                    request.data["status"] = "WAITING FOR BUYER"

                    trade_bit = TradeOrderApiSerializer(data=request.data, context=request)
                    check, data = trade_bit.is_valid()
                    if check:
                        # BUY IN IXCOIN
                        # IXCOIN spent value is saved for tracking
                        total_price = float(request.data["price"]) * float(request.data["amount"])
                        user = User.objects.get(id=index)
                        user_balance = Balance.objects.get(user=user)
                        balance = user_balance.total_coin_balance

                        # if balance < total_price:
                        #     return Utils.dispatch_failure(VALIDATION_MISSING,
                        #                                   ["Insufficient balance. Purchase IXCoin to "
                        #                                    "continue trading"])
                        user_balance.total_coin_balance = balance - total_price
                        user_balance.save()
                        save = trade_bit.save()

                        # Transaction logged for tracking
                        transaction = {"transaction_type": "trade", "user": _id,
                                       "transaction_hash": request.data["transaction_hash"],
                                       "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                       "ether_spent": request.data["total"],
                                       "token_spent": request.data["amount"]
                                       }
                        transaction = TransactionSerializer(data=transaction, context=request)
                        check, data = transaction.is_valid()
                        if check:
                            transaction.save()
                        request.data["id"] = save.pk
                        return Utils.dispatch_success(OK, request.data)
                    else:
                        return Utils.dispatch_failure(VALIDATION_MISSING, data)
                elif transaction_type == "BUY":
                    """
                    USER BUYS THE IXCOIN FOR ETHER
                    """
                    request.data["buyer"] = index
                    trade_bit = TradeOrder.objects.get(id=request.data['id'])
                    if trade_bit.status == "WAITING FOR BUYER":
                        # BUY IN ETHER
                        # Ether spent value is saved for tracking
                        total_price = trade_bit.price * trade_bit.amount

                        user = User.objects.get(id=index)
                        user_balance = Balance.objects.get(user=user)
                        balance = user_balance.total_coin_balance

                        # if balance < total_price:
                        #     return Utils.dispatch_failure(VALIDATION_MISSING,
                        #                                   ["Insufficient balance. Purchase IXCoin to "
                        #                                    "continue trading"])

                        trade_bit.buyer = user
                        trade_bit.status = "STOCK PAID"

                        user_balance.total_coin_balance = balance + total_price
                        user_balance.save()
                        trade_bit.last_updated_time = datetime.datetime.utcnow().replace(tzinfo=utc)
                        trade_bit.save()

                        # Transaction logged for tracking
                        transaction = {"transaction_type": "trade", "user": _id,
                                       "transaction_hash": request.data["transaction_hash"],
                                       "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                       "ether_spent": trade_bit.total,
                                       "token_spent": trade_bit.amount
                                       }
                        transaction = TransactionSerializer(data=transaction, context=request)
                        check, data = transaction.is_valid()
                        if check:
                            transaction.save()
                        return Utils.dispatch_success(OK, request.data)
                    else:
                        return Utils.dispatch_failure(INVALID_TRADE)

                elif transaction_type == "CANCEL":
                    """
                    USER CANCELS THE TRADE REQUEST
                    """
                    trade_id = request.data['id']
                    trade_bit = TradeOrder.objects.get(id=trade_id)

                    if trade_bit.transaction_type == "BIT_REQUEST":

                        if int(trade_bit.buyer.id) == int(index):

                            trade_bit.status = "CANCELLED"
                            trade_bit.last_updated_time = datetime.datetime.utcnow().replace(tzinfo=utc)
                            trade_bit.save()

                            # Transaction logged for tracking
                            transaction = {"transaction_type": "trade", "user": _id,
                                           "transaction_hash": request.data["transaction_hash"],
                                           "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                           "ether_spent": trade_bit.total,
                                           "token_spent": trade_bit.amount
                                           }
                            transaction = TransactionSerializer(data=transaction, context=request)
                            check, data = transaction.is_valid()

                            if check:
                                transaction.save()
                            return Utils.dispatch_success(OK, request.data)
                        else:

                            return Utils.dispatch_failure(INVALID_OWNER)
                    elif trade_bit.transaction_type == "ASK_REQUEST":

                        if int(trade_bit.seller.id) == int(index):

                            trade_bit.status = "CANCELLED"
                            trade_bit.save()

                            # Transaction logged for tracking
                            transaction = {"transaction_type": "trade", "user": _id,
                                           "transaction_hash": request.data["transaction_hash"],
                                           "purchase_time": datetime.datetime.utcnow().replace(tzinfo=utc),
                                           "ether_spent": trade_bit.total,
                                           "token_spent": trade_bit.amount
                                           }
                            transaction = TransactionSerializer(data=transaction, context=request)
                            check, data = transaction.is_valid()
                            if check:
                                transaction.save()
                            return Utils.dispatch_success(OK, request.data)
                        else:

                            return Utils.dispatch_failure(INVALID_OWNER)
                    else:
                        return Utils.dispatch_failure(VALIDATION_MISSING)

                else:
                    return Utils.dispatch_failure(VALIDATION_MISSING)

            else:
                return Utils.dispatch_failure(UNAUTHORIZED_ACCESS)
        except KeyError as e:
            return Utils.dispatch_failure(VALIDATION_MISSING, {str(e): "This field is required."})
        except Exception as e:
            print("Create Trade Order", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)


class ContactUsApi(views.APIView):
    """
    Contact Us - API For storing contact information
    """

    def post(self, request):
        try:
            serializer = ContactUsSerializer(data=request.data, context={'request': request})
            check, errors = serializer.is_valid()
            if check is True:
                serializer.save()
                return Utils.dispatch_success(OK)
            return Utils.dispatch_failure(VALIDATION_MISSING, serializer.errors)
        except Exception as e:
            print("Contact Us ", e)
            return Utils.dispatch_failure(INTERNAL_SERVER_ERROR)

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from ixcoin_backend.api.accounts.models import User, ForgotPasswordRequest, Transaction, Balance, TradeOrder, ContactUs
from ixcoin_backend.api.utils import Utils


class UserSerializer(serializers.ModelSerializer):
    """
    UserSerializer: Get & Update User Information
    """

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'user_type')


class LoginSerializer(serializers.Serializer):
    """
    LoginSerializer: Validates the authentication of the user
    """

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass

    # Add Required field for validation
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate and get user object; if valid
        user = authenticate(request=self.context.get('request'), username=username, password=password)

        if user:
            if not user.is_active:
                # If user is not active
                msg = 'User Account is Disabled'
                raise ValidationError(msg)
        else:
            # If supplied credential are not valid
            msg = 'Unable to login with required credentials'
            raise ValidationError(msg)

        return user

    class Meta:
        model = User
        fields = ('username', 'password')


class CreateUserSerializer(serializers.ModelSerializer):
    """
    CreateUserSerializer: Create New User
    """
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User(username=validated_data['username']
                    , email=validated_data['email']
                    , first_name=validated_data['first_name']
                    , last_name=validated_data['last_name']
                    , user_type=validated_data['user_type']
                    , is_active=False
                    , auth_token=Utils.generate_unique_token()
                    )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'password', 'user_type', 'auth_token')


class UserLoginSerializer(serializers.ModelSerializer):
    """
    UserLoginSerializer: Get Limited User Information for successful login
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'user_type')


class ForgotPasswordValidationSerializer(serializers.ModelSerializer):
    """
    ForgotPasswordValidationSerializer: Create New Forgot Password Change Request
    """

    def create(self, validated_data):
        forgot_password = ForgotPasswordRequest(
            email=validated_data['email'])
        forgot_password.save()
        return forgot_password

    class Meta:
        model = ForgotPasswordRequest
        fields = ('email',)


class ForgotPasswordSerializer(serializers.ModelSerializer):
    """
    ForgotPasswordSerializer: Validate the Password Change
    """
    reenter_password = serializers.CharField()

    class Meta:
        model = User
        fields = ('password', 'reenter_password')


class BalanceSerializer(serializers.ModelSerializer):
    """
    BalanceSerializer: Create, Get & Validate Balance Model of the user
    """

    def is_valid(self, raise_exception=False):
        if not hasattr(self, '_validated_data'):
            try:
                self._validated_data = self.run_validation(self.initial_data)
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}
        return not bool(self._errors), self._errors

    def create(self, validated_data):
        investor = Balance(user=validated_data['user'],
                           total_coin_balance=validated_data['total_coin_balance'],
                           total_ether_spent=validated_data['total_ether_spent'],
                           last_updated_time=validated_data['last_updated_time'],
                           total_points=validated_data['total_points'],
                           )
        investor.save()
        return investor

    class Meta:
        model = Balance
        fields = ('user', 'total_coin_balance', 'total_ether_spent', 'last_updated_time', 'total_points')
        extra_kwargs = Utils.init_validator_rules(fields)


class TransactionSerializer(serializers.ModelSerializer):
    """
    TransactionSerializer: Validate,Create & Get All the transaction of the user
    """

    def is_valid(self, raise_exception=False):
        if not hasattr(self, '_validated_data'):
            try:
                self._validated_data = self.run_validation(self.initial_data)
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}
        return not bool(self._errors), self._errors

    def create(self, validated_data):
        transaction = Transaction(user=validated_data['user']
                                  , transaction_hash=validated_data['transaction_hash']
                                  , transaction_type=validated_data['transaction_type']
                                  , purchase_time=validated_data['purchase_time']
                                  , ether_spent=validated_data['ether_spent']
                                  , token_spent=validated_data['token_spent']
                                  )
        transaction.save()
        return transaction

    class Meta:
        model = Transaction
        fields = ('user', 'transaction_hash', 'transaction_type', 'purchase_time', 'ether_spent', 'token_spent')
        extra_kwargs = Utils.init_validator_rules(fields)


class TradeOrderApiSerializer(serializers.ModelSerializer):
    """
    TradeOrderApiSerializer: Validate, Create & Get Trade Order progress against the user
    """

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
        transaction = TradeOrder(buyer=validated_data['buyer']
                                 , price=validated_data['price']
                                 , amount=validated_data['amount']
                                 , total=validated_data['total']
                                 , seller=validated_data['seller']
                                 , trade_method=validated_data['trade_method']
                                 , status=validated_data['status']
                                 , transaction_type=validated_data['transaction_type']
                                 , trade_reference=validated_data['trade_reference']

                                 )
        transaction.save()

        return transaction

    class Meta:
        model = TradeOrder
        fields = ('id', 'buyer', 'price', 'amount', 'total', 'seller', 'trade_method', 'transaction_type', 'status',
                  'trade_reference')
        extra_kwargs = Utils.init_validator_rules(fields)


class ContactUsSerializer(serializers.ModelSerializer):
    """
    ContactUsSerializer: Validate, Create and Get all the contact us request
    """

    def is_valid(self, raise_exception=False):
        if not hasattr(self, '_validated_data'):
            try:
                self._validated_data = self.run_validation(self.initial_data)
            except ValidationError as exc:
                self._validated_data = {}
                self._errors = exc.detail
            else:
                self._errors = {}
        return not bool(self._errors), self._errors

    def create(self, validated_data):
        contact_us = ContactUs(name=validated_data['name']
                               , email=validated_data['email']
                               , subject=validated_data['subject']
                               , message=validated_data['message'])
        contact_us.save()

        return contact_us

    class Meta:
        model = ContactUs
        fields = ('name', 'email', 'subject', 'message')
        extra_kwargs = Utils.init_validator_rules(fields)

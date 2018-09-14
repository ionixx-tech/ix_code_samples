from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models

from ixcoin_backend.messages import REQUIRED_INVALID_DATA
from ixcoin_backend.settings import CURRENCY_NAME, CURRENCY_SYMBOL

# Override Default User Model Object
GENERAL = "General"
INVESTOR = "Investor"

USER_TYPES = ((GENERAL, GENERAL), (INVESTOR, INVESTOR))
user_type = models.CharField(max_length=100, choices=USER_TYPES, default=GENERAL)
user_type.contribute_to_class(User, 'user_type')
auth_Token = models.CharField(max_length=150, null=True)
auth_Token.contribute_to_class(User, 'auth_token')


class UserSession(models.Model):
    """
    UserSession: Manage session activity of the user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auth_key = models.CharField(max_length=100, blank=True, null=True)
    start_time = models.DateTimeField(default=None)
    end_time = models.DateTimeField(default=None)
    is_first_time = models.BooleanField(default=True)

    class Meta:
        db_table = "user_session"


class ForgotPasswordRequest(models.Model):
    """
    ForgotPasswordRequest: Manage all the forgot password request of the user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    email = models.CharField(max_length=100, validators=[
        RegexValidator("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
                       message=REQUIRED_INVALID_DATA)])
    token = models.CharField(max_length=100, blank=True, null=True)
    request_time = models.DateTimeField(blank=True, null=True)
    expiry_time = models.IntegerField(default=0, null=True)
    is_expired = models.BooleanField(default=False)

    class Meta:
        db_table = "forgot_password_request"


class Balance(models.Model):
    """
    Balance: Manage wallet balance of the individual user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    total_coin_balance = models.FloatField(default=0.0, blank=True, null=True)
    total_ether_spent = models.FloatField(default=0.0, blank=True, null=True)
    last_updated_time = models.DateTimeField(blank=True, null=True)
    total_points = models.FloatField(default=0.0, blank=True, null=True)

    class Meta:
        db_table = "balance"


class Transaction(models.Model):
    """
    Transaction: Logs all the transaction happening on the application
    """
    CROWD_SALE = "crowdsale"
    IX_COIN = "ixcoin"
    TRADE = "trade"
    TRANSFER = "transfer"
    REWARD = "reward"
    transaction_id = models.AutoField(primary_key=True, null=False, )
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    transaction_hash = models.CharField(max_length=150, unique=True, default=0, blank=False)
    transaction_type = models.CharField(max_length=100,
                                        choices=(
                                            (CROWD_SALE, CROWD_SALE), (IX_COIN, IX_COIN),
                                            (TRADE, TRADE), (TRANSFER, TRANSFER), (REWARD, REWARD)),
                                        default=IX_COIN)
    purchase_time = models.DateTimeField(blank=True, null=True)
    ether_spent = models.FloatField(default=0.0, blank=True, null=True)
    token_spent = models.FloatField(default=0.0, blank=True, null=True)

    class Meta:
        db_table = "transaction"


class MarketValue(models.Model):
    """
    MarketValue: Manages the current market value of IX COIN
    """
    coin_name = models.CharField(max_length=100, default=CURRENCY_NAME)
    coin_symbol = models.CharField(max_length=15, default=CURRENCY_SYMBOL)
    market_cap = models.FloatField(blank=False, null=True)
    price = models.FloatField(blank=False, null=True)
    volume = models.FloatField(blank=False, null=True)
    circulating_supply = models.FloatField(blank=False, null=True)
    last_updated_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "market_value"


class TradeOrder(models.Model):
    """
    TradeOrder: All the trade related request & progress are handled with this model
    """
    buyer = models.ForeignKey(User, related_name='buyer_trade_order_set', null=True, on_delete=models.CASCADE)
    price = models.FloatField(null=True)
    amount = models.FloatField(null=True)
    total = models.FloatField(null=True)
    trade_reference = models.IntegerField(null=False)
    seller = models.ForeignKey(User, related_name='seller_trade_order_set', null=True, on_delete=models.CASCADE)
    trade_method = models.CharField(
        max_length=100,
        choices=(("LIMIT ORDER", "LIMIT ORDER"),
                 ("MARKET ORDER", "MARKET ORDER")))
    transaction_type = models.CharField(
        max_length=100,
        choices=(("BUY", "BUY"),
                 ("SELL", "SELL"),
                 ("BIT_REQUEST", "BIT_REQUEST"),
                 ("ASK_REQUEST", "ASK_REQUEST"),
                 ("CANCEL", "CANCEL")
                 ))
    status = models.CharField(
        max_length=100,
        choices=(
            ("WAITING FOR SELLER", "WAITING FOR SELLER"),
            ("WAITING FOR BUYER", "WAITING FOR BUYER"),
            ("CANCELLED", "CANCELLED"),
            ("STOCK PAID", "STOCK PAID")))
    last_updated_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "trade_order"


class ContactUs(models.Model):
    """
    ContactUs: All the user request for contacts are saved here
    """
    name = models.CharField(max_length=150, null=False)
    email = models.CharField(max_length=150, null=False)
    subject = models.CharField(max_length=300, null=False)
    message = models.CharField(max_length=1000, null=False)

    class Meta:
        db_table = "contact_us"

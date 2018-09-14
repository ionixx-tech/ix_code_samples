from django.contrib import admin

from ixcoin_backend.api.accounts.forms import UserSessionForm, ForgotPasswordRequestForm, TradeOrderForm, \
    MarketValueForm, TransactionForm, BalanceForm, ContactUsForm
from ixcoin_backend.api.accounts.models import UserSession, ForgotPasswordRequest, Balance, Transaction, MarketValue, \
    TradeOrder, ContactUs


class UserSessionAdmin(admin.ModelAdmin):
    """
    Include all the fields of UserSession Model in Admin Page
    """
    form = UserSessionForm
    list_display = [field.name for field in UserSession._meta.fields]


class ForgotPasswordRequestAdmin(admin.ModelAdmin):
    """
    Include all the fields of ForgotPasswordRequest Model in Admin Page
    """
    form = ForgotPasswordRequestForm
    list_display = [field.name for field in ForgotPasswordRequest._meta.fields]


class BalanceAdmin(admin.ModelAdmin):
    """
    Include all the fields of Balance Model in Admin Page
    """
    form = BalanceForm
    list_display = [field.name for field in Balance._meta.fields]


class TransactionAdmin(admin.ModelAdmin):
    """
    Include all the fields of Transaction Model in Admin Page
    """
    form = TransactionForm
    list_display = [field.name for field in Transaction._meta.fields]


class MarketValueAdmin(admin.ModelAdmin):
    """
    Include all the fields of MarketValue Model in Admin Page
    """
    form = MarketValueForm
    list_display = [field.name for field in MarketValue._meta.fields]


class TradeOrderAdmin(admin.ModelAdmin):
    """
    Include all the fields of TradeOrder Model in Admin Page
    """
    form = TradeOrderForm
    list_display = [field.name for field in TradeOrder._meta.fields]


class ContactUsAdmin(admin.ModelAdmin):
    """
    Include all the fields of ContactUs Model in Admin Page
    """
    form = ContactUsForm
    list_display = [field.name for field in ContactUs._meta.fields]


admin.site.register(UserSession, UserSessionAdmin)
admin.site.register(ForgotPasswordRequest, ForgotPasswordRequestAdmin)
admin.site.register(Balance, BalanceAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(MarketValue, MarketValueAdmin)
admin.site.register(TradeOrder, TradeOrderAdmin)
admin.site.register(ContactUs, ContactUsAdmin)

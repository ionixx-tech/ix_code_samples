from django import forms

from ixcoin_backend.api.accounts.models import UserSession, ForgotPasswordRequest, Balance, TradeOrder, MarketValue, \
    Transaction, ContactUs


class UserSessionForm(forms.ModelForm):
    """
    Create UserSession form to display in Admin Page
    """

    class Meta:
        model = UserSession
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(UserSessionForm, self).__init__(*args, **kwargs)


class ForgotPasswordRequestForm(forms.ModelForm):
    """
    Create ForgotPasswordRequest form to display in Admin Page
    """

    class Meta:
        model = ForgotPasswordRequest
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ForgotPasswordRequestForm, self).__init__(*args, **kwargs)


class BalanceForm(forms.ModelForm):
    """
    Create Balance form to display in Admin Page
    """

    class Meta:
        model = Balance
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BalanceForm, self).__init__(*args, **kwargs)


class TransactionForm(forms.ModelForm):
    """
    Create Transaction form to display in Admin Page
    """

    class Meta:
        model = Transaction
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TransactionForm, self).__init__(*args, **kwargs)


class MarketValueForm(forms.ModelForm):
    """
    Create MarketValue form to display in Admin Page
    """

    class Meta:
        model = MarketValue
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MarketValueForm, self).__init__(*args, **kwargs)


class TradeOrderForm(forms.ModelForm):
    """
    Create TradeOrder form to display in Admin Page
    """

    class Meta:
        model = TradeOrder
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TradeOrderForm, self).__init__(*args, **kwargs)


class ContactUsForm(forms.ModelForm):
    """
    Create ContactUs form to display in Admin Page
    """

    class Meta:
        model = ContactUs
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ContactUsForm, self).__init__(*args, **kwargs)

from django.conf.urls import url

from . import views

urlpatterns = [
    # User Management
    url(r'^user/(?P<_id>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^user/$', views.UserList.as_view()),
    url(r'^activate/(?P<token>[\w\-]+)/$', views.UserActivation.as_view(), name='activation'),

    # Login Management
    url(r'^login/$', views.LoginView.as_view(), name='login'),
    url(r'^user/(?P<_id>[0-9]+)/logout/$', views.Logout.as_view(), name='logout'),

    # Forgot Password
    url(r'^forgot_password/validate/$', views.EmailValidation.as_view(), name='validate-forgot-password'),
    url(r'^forgot_password/(?P<token>[\w\-]+)/$', views.ForgotPassword.as_view(), name='forgot-password'),

    # Crowd_sale
    url(r'^crowd_sale/$', views.CrowdSale.as_view(), name='crowd-sale'),
    url(r'^crowd_sale/status/$', views.CrowdSaleStatus.as_view(), name='crowd-sale-status'),

    # List Transactions
    url(r'^user/(?P<_id>[0-9]+)/transaction/(?P<transaction_hash>[\w\-]+)/$', views.TransactionAPI.as_view(),
        name='transaction'),
    url(r'^user/(?P<_id>[0-9]+)/transaction/$', views.TransactionList.as_view(), name='transaction-all'),

    # Get Balance
    url(r'^user/(?P<_id>[0-9]+)/balance/$', views.BalanceAPI.as_view(), name='balance'),

    # Collect the Rewarded tokens
    url(r'^user/(?P<_id>[0-9]+)/collect-reward/$', views.CollectRewardFromCoin.as_view(), name='collect-reward'),

    # List Market Value of Crypto Currency
    url(r'^crypto_currency/$', views.CryptocurrencyAPI.as_view(), name='crypto_currency_market_value'),

    # Market Value of IX_COIN
    url(r'^ixcoin/$', views.Ixcoin.as_view(), name='ixcoin'),

    # Manage Trade
    url(r'^user/(?P<_id>[0-9]+)/trade/order/$', views.TradeOrderApi.as_view(), name='trade'),

    # Contact Us Request
    url(r'^contact-us/$', views.ContactUsApi.as_view(), name='contact-us'),
]

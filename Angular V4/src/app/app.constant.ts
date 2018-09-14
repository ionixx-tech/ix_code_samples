export class AppConstants {
  //API server
  public static serverUrl = 'http://localhost/xehar-api';
  //JSON server
  // public static serverUrl = 'http://localhost:3000';
  public static successStatus = 'success';
  public static recordsPerPage = 10;
   public static  directNetbankingPage = 13;
  public static directOTPPage = 9;
  public static completedFlow = 15;

  public static agentBulkUploadEndpoint = '/agent/add-bulk';
  public static sampleCsvTemplate = AppConstants.serverUrl + '/csv/template';
  public static sampleXlsTemplate = AppConstants.serverUrl + '/xls/template';
  public static candidateSampleCsvTemplate = AppConstants.serverUrl + '/csv/candidate';
  public static candidateSampleXlsTemplate = AppConstants.serverUrl + '/xls/candidate';
  public static errorFileUrl = AppConstants.serverUrl + '/download-file';

  //Estimation status
  public static estimate = {
    pending : "PENDING",
    submitted : "SUBMITTED",
    approved : "APPROVED",
    completed : "COMPLETED"
  };

  public static partnerPermisiion = {
    partnerAddAccess : 'CREATE_PARTNER',
    partnerEditAccess : 'EDIT_PARTNER',
    partnerListAllAccess : 'LIST_ALL_PARTNER',
    partnerListIndividualAccess : 'LIST_INDIVIDUAL_PARTNER',
    partnerBlockAccess : 'BLOCK_PARTNER',
    partnerDeleteAccess : 'DELETE_PARTNER',
    partnerStatusChangeAccess: 'CHANGE_PARTNER_STATUS'
  };

  public static urlRoute = {
      loginRoute : 'login',
      errorRoute : 'error',
      registerRoute : 'register',
      candidateRoute : 'candidate/invite',
      otpRoute : 'otp',
      securityRoute : 'security',
      bankAuthentication: 'bankauthentication',
      completeRoute : 'complete',
      changePasswordRoute: 'choose-password',
      forgotPasswordRoute: 'forgot-password',
  };

}

export class ErrorConstants {
  public static serverError = 'Server Error Occured';
  public static userNameError = 'Enter a valid username';
  public static emailError = 'Enter a valid email address';
  public static passwordError = 'Enter your password';
  public static invalidUser = 'Invalid credentials';
  public static wentWrongMessage = 'something went wrong . please try again later';
  public static candidateErrors = {
      // 'E_WRONG_CREDENTIALS': 'Please try after some time with valid credentials',
      // 'E_USER_CANCELLED': 'You have cancelled the transaction',
      // 'E_USER_BLOCKED': 'You have been blocked because of giving wrong credentials',
      'E_INSTITUTION_ERROR': 'Please try after sometime',
      'LOARejected': 'You had rejected the Letter of Authorization',
      'NetBankingDone': 'Your Digital Employment Verification Process completed.',
      'InvitationDeclined': 'You have Declined the invitation',
      'InvitationExpired': 'Your invitation has been expired.',
      'CandidateNotExist': 'Requested candidate not exist.',
      'DeclineProcess': 'Your request has been send to the company.',
      'AuthenticationMismatched': 'Bank selection mismatched.',
      'OTPInvalid': 'Please enter the OTP that you have received.',
      'E_AMOUNT_BALANCE_MISMATCH' : 'Calculated amounts/balances do not match actual values',
      'E_API_SESSION_EXPIRED': 'API session expired without the client taking any further action',
      'E_NOT_ACCEPTED' : 'Transaction did not meet the criteria set by acceptance policy',
      'E_NO_ACCOUNT' : 'User has no bank accounts',
      'E_NO_ERROR' : 'No errors',
      'E_OTHER': 'Some other error occurred',
      'E_SITE': 'Site error',
      'E_SYSTEM' : 'System (Perfios) error',
      'E_USER_ACTION' : 'Error caused by User action',
      'E_USER_BLOCKED' : 'User blocked for providing wrong user name or password for institution(s) multiple times',
      'E_USER_CANCELLED' : ' Perfios transaction was cancelled by user',
      'E_USER_SESSION_EXPIRED' : ' Session expired without the user taking any further action',
      'E_WRONG_CREDENTIALS' : ' User provided wrong user name or password for institution',
  };


}

export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",
  BLOCKED_USER = "You have been blocked, contact the restaurant!",
  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  NO_MEMBER_NICK = "No member with that member nick!",
  WRONG_PASSWORD = "Wrong password, please try again!",
  WRONG_EMAIL = "Wrong Email entered, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated, Please Login first!",
  TOKEN_CREATION_FAILED = "Token creation error!",
  GOOGLE_ID_NOT_SET = "Google Id is not set!",
  INVALID_REDIRECT = "Invalid redirect URI!",
  INVALID_STATE = "Invalid state!",
  MISSING_AUTHORIZATION_CODE = "Missing authorization code!",
  GOOGLE_CLIENT_CONFIGURATION = "Google client configuration error!",
  KAKAO_CLIENT_CONFIGURATION = "Kakao client configuration error!",
  NAVER_CLIENT_CONFIGURATION = "Naver client configuration error!",
  INVALID_TOKEN_TYPE = "Invalid token type!",
  INVALID_TOKEN_PAYLOAD = "Invalid token payload",
  REFRESH_TOKEN_EXPIRED = "Refresh token expired!",
  NAVER_ID_NOT_SET = "Naver Id is not set!",
  KAKAO_ID_NOT_SET = "Kakao Id is not set!",
  FAILED_TO_FETCH_USER_INFO = "fail fetching the user",
  INVALID_REQUEST = "Invalid request",
  MEMBER_NOT_FOUND = "MEMBER_NOT_FOUND",
  CHATGPT_TEXT_ERROR = "Error on text or session on request",
  DELETE_FAILED = "DELETE FAILED",
}
class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;

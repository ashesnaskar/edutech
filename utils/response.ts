const enum StatusCode {
    SUCCESS = 0,
    INVALID_CREDENTIALS = 1,
    INSUFFICIENT_CREDENTIALS = 2,
    OBJECT_NOT_FOUND = 3,
    INCORRECT_CREDENTIALS = 4,
    DUPLICATE_CREDENTIALS = 5,
    FILE_TOO_LARGE = 6,
    UNSUPPORTED_FILE = 7,
    FILE_NOT_FOUND = 8,
    INVALID_FILE_PASSWORD = 9,
    INVALID_REQUEST = 10,
    MISSING_PARAMETERS = 11,
    OPERATION_ERROR = 12,
    DUPLICATE_REQUEST = 13,
    INVALID_PARAMETER = 14,
    VALIDATION_ERROR = 15,
    SERVER_ERROR = 16,
    // MISSING_PARAMETERS = 99,
    UNKNOWN_ERROR = 100
}

type ResponseType = { message: string, type: string};

const responseType: {[statusCode: number]: ResponseType} = {
    0: {
        message: "Successfully loaded data",
        type: "OK"
    },
    1: {
        message: "Invalid credentials",
        type: "InvalidJwt"
    },
    2: {
        message: "Insufficient credentials",
        type: "Unauthorized"
    },
    3: {
        message: "Unable to find object",
        type: "ObjectNotFound"
    },
    4: {
        message: "Incorrect email id or password provided",
        type: "IncorrectCredentials"
    },
    5: {
        message: "Already registered with this email or phone number",
        type: "DuplicateCredentials"
    },
    6: {
        message: "The uploaded file is too large, please upload a file < 10MB",
        type: "FileTooLarge"
    },
    7: {
        message: "Unsupported file. Please upload a valid PDF only",
        type: "UnsupportedFileType"
    },
    8: {
        message: "No file found, please try reuploading",
        type: "FileNotFound"
    },
    9: {
        message: "Invalid password for the bill",
        type: "InvalidFilePassword"
    },
    10: {
        message: "Request is rejected",
        type: "InvalidRequest"
    },
    11: {
        message: "Email Not provided",
        type: "MissingParameters"
    },
    12: {
        message: "Unable to perform Operations currently",
        type: "OperationError"
    },
    13: {
        message: "Another Request for Reset password is in progress",
        type: "DuplicateRequest"
    },
    14: {
        message: "Invalid Product Type",
        type: "InvalidParameter"
    },
    15: {
        message: "Validation errors found",
        type: "ValidationError",
    },
    16: {
        message: "Internal Server Error",
        type: "ServerError",
    },
    17: {
        message: "Invalid File",
        type: "ServerError",
    },
    18: {
        message: "File Size Exceeds",
        type: "ServerError",
    },
    99: {
        message: "Missing parameters",
        type: "InsufficientParameters"
    },
    100: {
        message: "An unknown error occurred.",
        type: "UnknownError"
    }
};

class Common {
    public static generateResponse(code: StatusCode= 0, result: any= {}, message: string= "") {
        if (message == "") {
            message = responseType[code].message;
        }
        return {
            code: code,
            result: result,
            type: responseType[code].type,
            message: message
        };
    }
}

export = Common;
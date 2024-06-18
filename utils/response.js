"use strict";
var responseType = {
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
    99: {
        message: "Missing parameters",
        type: "InsufficientParameters"
    },
    100: {
        message: "An unknown error occurred.",
        type: "UnknownError"
    }
};
var Common = /** @class */ (function () {
    function Common() {
    }
    Common.generateResponse = function (code, result, message) {
        if (code === void 0) { code = 0; }
        if (result === void 0) { result = {}; }
        if (message === void 0) { message = ""; }
        if (message == "") {
            message = responseType[code].message;
        }
        return {
            code: code,
            result: result,
            type: responseType[code].type,
            message: message
        };
    };
    return Common;
}());
module.exports = Common;
//# sourceMappingURL=response.js.map
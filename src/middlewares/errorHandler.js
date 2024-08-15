const {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ValidationError,
  CrapNotFoundError,
  CrapOwnershipError,
  ImageUploadError,
} = require("../utils/errors");
const logger = require("../utils/logger");

const globalErrorHandler = (err, req, res, next) => {
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthenticatedError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof ValidationError ||
    err instanceof CrapNotFoundError ||
    err instanceof CrapOwnershipError ||
    err instanceof ImageUploadError
  ) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error(err);

  const internalError = new InternalServerError();

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      error: internalError.message,
      details: err.message,
      stack: err.stack,
    });
  } else {
    return res.status(internalError.statusCode).json({
      error: internalError.message,
    });
  }
};

module.exports = globalErrorHandler;

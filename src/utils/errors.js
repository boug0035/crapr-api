class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class UnauthenticatedError extends Error {
  constructor(message = "Unauthenticated") {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = 401;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

class ValidationError extends Error {
  constructor(message = "Validation Error") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
  }
}

class CrapNotFoundError extends Error {
  constructor(message = "Crap not found") {
    super(message);
    this.name = "CrapNotFoundError";
    this.statusCode = 404;
  }
}

class CrapOwnershipError extends Error {
  constructor(
    message = "You do not have permission to view or modify this Crap"
  ) {
    super(message);
    this.name = "CrapOwnershipError";
    this.statusCode = 403;
  }
}

class ImageUploadError extends Error {
  constructor(message = "Image upload failed") {
    super(message);
    this.name = "ImageUploadError";
    this.statusCode = 400;
  }
}

module.exports = {
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
};

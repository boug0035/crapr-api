const mongoose = require("mongoose");
const { BadRequestError } = require("../utils/errors");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new BadRequestError("Invalid ID format"));

  next();
};

module.exports = validateObjectId;

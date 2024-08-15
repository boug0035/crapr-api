const CrapModel = require("../models/Crap.model");
const {
  BadRequestError,
  CrapNotFoundError,
  ForbiddenError,
  CrapOwnershipError,
  ValidationError,
} = require("../utils/errors");
const ImagesService = require("./images.service");

exports.listAllCrap = async ({ query, lat, long, distance, show_taken }) => {
  const filters = {};

  if (query)
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];

  if (show_taken === "true") {
    filters.status = { $ne: "FLUSHED" };
  } else {
    filters.status = "AVAILABLE";
  }

  if (lat && long && distance) {
    filters.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
        $maxDistance: parseFloat(distance),
      },
    };
  }

  const crapList = await CrapModel.find(filters)
    .select("-location -buyer -suggestion -__v")
    .populate("owner", "name");

  return crapList;
};

exports.getById = async (crapId, user) => {
  try {
    const crap = await CrapModel.findById(crapId)
      .populate("owner", "name")
      .populate("buyer", "name");

    if (!crap) throw new CrapNotFoundError();

    if (!isBuyerOrSeller(user, crap)) {
      crap.location = undefined;
      crap.buyer = undefined;
      crap.suggestion = undefined;
    }

    return crap;
  } catch (error) {
    throw error;
  }
};

exports.findCrapByUser = async (user) => {
  try {
    const crapList = await CrapModel.find({
      $or: [{ owner: user._id }],
    })
      .populate("owner", "name")
      .populate("buyer", "name");

    return crapList;
  } catch (error) {
    throw error;
  }
};

exports.create = async (data, user, files) => {
  try {
    const tempCrap = new CrapModel({
      ...data,
      owner: user._id,
      status: "AVAILABLE",
    });
    await tempCrap.validate();

    const imageUrls = await ImagesService.uploadMany(files);

    const crapData = {
      ...data,
      images: imageUrls,
      owner: user._id,
      status: "AVAILABLE",
    };

    const crap = new CrapModel(crapData);
    return crap.save();
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(error.message);
    }
    throw error;
  }
};

exports.replaceCrap = async (crapId, newCrapData, user) => {
  try {
    const existingCrap = await CrapModel.findById(crapId);

    if (!existingCrap) throw new CrapNotFoundError();

    if (String(user.id) !== String(existingCrap.owner._id))
      throw new CrapOwnershipError();

    existingCrap.title = newCrapData.title || existingCrap.title;
    existingCrap.description =
      newCrapData.description || existingCrap.description;
    existingCrap.location = newCrapData.location || existingCrap.location;
    existingCrap.images = newCrapData.images || existingCrap.images;
    existingCrap.status = newCrapData.status || existingCrap.status;

    const updatedCrap = await existingCrap.save();

    return updatedCrap;
  } catch (error) {
    throw error;
  }
};

exports.updateCrap = async (crapId, updates, user) => {
  try {
    const existingCrap = await CrapModel.findById(crapId);

    if (!existingCrap) throw new CrapNotFoundError("Crap not found");

    if (String(user.id) !== String(existingCrap.owner._id))
      throw new ForbiddenError(
        "You do not have permission to update this Crap"
      );

    Object.keys(updates).forEach((key) => {
      if (key in existingCrap) existingCrap[key] = updates[key];
    });

    const updatedCrap = await existingCrap.save();

    return updatedCrap;
  } catch (error) {
    throw error;
  }
};

exports.deleteCrap = async (crapId, user) => {
  try {
    const existingCrap = await CrapModel.findById(crapId);

    if (!existingCrap) throw new CrapNotFoundError("Crap not found");

    if (String(user.id) !== String(existingCrap.owner._id))
      throw new ForbiddenError(
        "You do not have permission to delete this Crap"
      );

    await existingCrap.deleteOne();

    return;
  } catch (error) {
    throw error;
  }
};

exports.showInterest = async (crapId, user) => {
  const crap = await CrapModel.findById(crapId);

  if (!crap) throw new CrapNotFoundError();

  if (String(user._id) === String(crap.owner._id))
    throw new BadRequestError("You cannot show interest in your own crap.");

  if (crap.status !== "AVAILABLE")
    throw new BadRequestError("Crap is not available.");

  crap.status = "INTERESTED";
  crap.buyer = user._id;

  return await crap.save();
};

exports.suggestDate = async (crapId, suggestion, user) => {
  const crap = await CrapModel.findById(crapId);

  if (!crap) throw new CrapNotFoundError();

  if (crap.status !== "INTERESTED")
    throw new BadRequestError("Crap is not in an interested state.");

  if (String(user._id) !== String(crap.owner))
    throw new ForbiddenError("Only the seller can suggest a date and address.");

  crap.status = "SCHEDULED";
  crap.suggestion = suggestion;

  return await crap.save();
};

exports.agreeToCrap = async (crapId, user) => {
  const crap = await CrapModel.findById(crapId);

  if (!crap) throw new CrapNotFoundError();

  if (crap.status !== "SCHEDULED")
    throw new BadRequestError("Crap is not in a scheduled state.");

  if (String(user._id) !== String(crap.buyer))
    throw new ForbiddenError("Only the buyer can agree to the suggestion.");

  crap.status = "AGREED";

  return await crap.save();
};

exports.disagreeToCrap = async (crapId, user) => {
  const crap = await CrapModel.findById(crapId);

  if (!crap) throw new CrapNotFoundError();

  if (crap.status !== "SCHEDULED")
    throw new BadRequestError("Crap is not in a scheduled state.");

  if (String(user._id) !== String(crap.buyer))
    throw new ForbiddenError(
      "Only the buyer can disagree with the suggested time."
    );
};

exports.resetCrap = async (crapId, user) => {
  const crap = await CrapModel.findById(crapId);

  if (!crap) throw new CrapNotFoundError();

  if (crap.status === "FLUSHED")
    throw new BadRequestError("Cannot reset a flushed crap.");

  if (
    String(user._id) !== String(crap.owner) &&
    String(user._id) !== String(crap.buyer)
  )
    throw new ForbiddenError("Only the buyer or seller can reset the crap.");

  crap.status = "AVAILABLE";
  crap.buyer = null;
  crap.suggestion = null;

  return await crap.save();
};

const CrapService = require("../services/crap.service");
const ImagesService = require("../services/images.service");
const logger = require("../utils/logger");

exports.listAllCrap = async (req, res, next) => {
  try {
    const { query, lat, long, distance, show_taken } = req.query;
    const crapList = await CrapService.listAllCrap({
      query,
      lat,
      long,
      distance,
      show_taken,
    });
    res.json({ data: crapList });
  } catch (error) {
    next(error);
  }
};

exports.getCrapById = async (req, res, next) => {
  try {
    const crap = await CrapService.getById(req.params.id, req.user);
    res.json({ data: crap });
  } catch (error) {
    next(error);
  }
};

exports.listMyCrap = async (req, res, next) => {
  try {
    const crapList = await CrapService.findCrapByUser(req.user);

    res.json({ data: crapList });
  } catch (error) {
    logger.error(
      `Error listing crap for user ${req.user.id}: ${error.message}`
    );
    next(error);
  }
};

exports.createCrap = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;

    // Parse the location field from string to JSON
    const parsedLocation = JSON.parse(location);

    // Delegate the rest of the logic to the service layer
    const crapData = {
      title,
      description,
      location: parsedLocation,
    };

    const crap = await CrapService.create(crapData, req.user, req.files);
    res.status(201).json({ data: crap });
  } catch (error) {
    next(error);
  }
};

// exports.createCrap = async (req, res, next) => {
//   try {
//     const { title, description, location } = req.body;

//     const parsedLocation = JSON.parse(location);

//     const crapData = {
//       title,
//       description,
//       location: parsedLocation,
//     };

//     // Validate the data before uploading images
//     const tempCrap = new CrapModel(crapData);
//     await tempCrap.validate();

//     // Upload the images using the image service
//     const imageUrls = await ImagesService.uploadMany(req.files);
//     crapData.images = imageUrls;

//     const crap = await CrapService.create(crapData, req.user);
//     res.status(201).json({ data: crap });
//   } catch (error) {
//     next(error);
//   }
// };

exports.replaceCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;
    // const crapData = req.body;
    const { title, description, location } = req.body;
    const imageUrls = await ImagesService.uploadMany(req.files);
    const crapData = { title, description, location, images: imageUrls };

    const updatedCrap = await CrapService.replaceCrap(crapId, crapData, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error replacing crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.updateCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;
    const updates = req.body; // Partial data to update the existing crap

    if (req.files && req.files.length > 0) {
      const imageUrls = await ImagesService.uploadMany(req.files);
      updates.images = imageUrls;
    }

    // Call the service to update the crap item
    const updatedCrap = await CrapService.updateCrap(crapId, updates, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error updating crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.deleteCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    // Call the service to delete the crap item
    await CrapService.deleteCrap(crapId, user);

    res.json({ message: "Crap successfully deleted." });
  } catch (error) {
    logger.error(
      `Error deleting crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.showInterest = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    const updatedCrap = await CrapService.showInterest(crapId, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error showing interest in crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.suggestDate = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;
    const { suggestion } = req.body;

    const updatedCrap = await CrapService.suggestDate(crapId, suggestion, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error suggesting date for crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.agreeToCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    const updatedCrap = await CrapService.agreeToCrap(crapId, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error agreeing to crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.disagreeToCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    const updatedCrap = await CrapService.disagreeToCrap(crapId, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error disagreeing to crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.resetCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    const updatedCrap = await CrapService.resetCrap(crapId, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error resetting crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

exports.flushCrap = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const user = req.user;

    const updatedCrap = await CrapService.flushCrap(crapId, user);

    res.json({ data: updatedCrap });
  } catch (error) {
    logger.error(
      `Error flushing crap with ID ${req.params.id}: ${error.message}`
    );
    next(error);
  }
};

const crapRouter = require("express").Router();
const CrapController = require("../controllers/crap.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const validateObjectId = require("../middlewares/validateObjectId");
const pickImages = require("../middlewares/pickImages");

crapRouter.use(isAuthenticated);

crapRouter.get("/", CrapController.listAllCrap);
crapRouter.get("/mine", CrapController.listMyCrap);
crapRouter.get("/:id", validateObjectId, CrapController.getCrapById);
crapRouter.put(
  "/:id",
  pickImages,
  validateObjectId,
  CrapController.replaceCrap
);
crapRouter.patch(
  "/:id",
  pickImages,
  validateObjectId,
  CrapController.updateCrap
);
crapRouter.delete("/:id", validateObjectId, CrapController.deleteCrap);
crapRouter.post("/", pickImages, CrapController.createCrap);
crapRouter.post(
  "/:id/interested",
  validateObjectId,
  CrapController.showInterest
);
crapRouter.post("/:id/suggest", validateObjectId, CrapController.suggestDate);
crapRouter.post("/:id/agree", validateObjectId, CrapController.agreeToCrap);
crapRouter.post(
  "/:id/disagree",
  validateObjectId,
  CrapController.disagreeToCrap
);
crapRouter.post("/:id/reset", validateObjectId, CrapController.resetCrap);
crapRouter.post("/:id/flush", validateObjectId, CrapController.flushCrap);

module.exports = crapRouter;

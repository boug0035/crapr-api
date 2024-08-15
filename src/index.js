"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const createMongoClient = require("./config/database");
const { PORT } = require("./config");
const sanitizeBody = require("./middlewares/sanitizeBody");
const sanitizeMongo = require("express-mongo-sanitize");
const logger = require("./utils/logger");
const compression = require("compression");
const authRouter = require("./routes/auth.routes");
const globalErrorHandler = require("./middlewares/errorHandler");
const crapRouter = require("./routes/crap.routes");
const { NotFoundError } = require("./utils/errors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(sanitizeBody);
app.use(sanitizeMongo());
app.use(compression());
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/auth", authRouter);
app.use("/api/crap", crapRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/success", (_req, res) => {
  res.send("Success");
});

app.get("/fail", (_req, res) => {
  res.send("Fail");
});

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(globalErrorHandler);

async function startServer() {
  const mongoClient = createMongoClient();

  try {
    await mongoClient.connect();
    logger.info("MongoDB connected successfully");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();

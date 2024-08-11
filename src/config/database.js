const mongoose = require("mongoose");
const debug = require("debug")("crapr-api:db");
const { DATABASE_URL, DATABASE_PASSWORD } = require("./index");
const logger = require("../utils/logger");

function createMongoClient() {
  if (!DATABASE_URL || !DATABASE_PASSWORD) {
    logger.info("Database configuration is missing");
    throw new Error("Database configuration is missing");
  }

  const dbUri = DATABASE_URL.replace("<password>", DATABASE_PASSWORD);
  let connected = false;

  async function connect() {
    if (connected) {
      logger.info("Already connected to MongoDB");
      return;
    }
    try {
      await mongoose.connect(dbUri);
      connected = true;
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error("Error connecting to MongoDB", error);
      process.exit(1);
    }
  }

  async function disconnect() {
    if (!connected) {
      logger.info("Not connected to MongoDB");
      return;
    }
    try {
      await mongoose.disconnect();
      connected = false;
      logger.info("Disconnected from MongoDB");
    } catch (error) {
      logger.error("Error disconnecting from MongoDB", error);
    }
  }

  return {
    connect,
    disconnect,
  };
}

module.exports = createMongoClient;

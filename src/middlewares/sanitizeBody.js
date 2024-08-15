const debug = require("debug")("sanitize:body");
const xss = require("xss");
const { res, req, next } = require("express");

const sanitize = (sourceString) => {
  return xss(sourceString, {
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });
};

const stripTags = (payload) => {
  const attributes = { ...payload };
  for (const key in attributes) {
    if (Array.isArray(attributes[key])) {
      attributes[key] = attributes[key].map((element) => {
        return typeof element === "object"
          ? stripTags(element)
          : sanitize(element);
      });
    } else if (attributes[key] instanceof Object) {
      attributes[key] = stripTags(attributes[key]);
    } else {
      attributes[key] = sanitize(attributes[key]);
    }
  }
  return attributes;
};

const sanitizeBody = (req, res, next) => {
  const { id, _id, ...attributes } = req.body;
  const sanitizedBody = stripTags(attributes);
  req.sanitizedBody = sanitizedBody;
  next();
};

module.exports = sanitizeBody;

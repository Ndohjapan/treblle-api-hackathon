const { check, validationResult, param } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateCreateMessageInput = [
  check("connectionId")
    .not()
    .isEmpty()
    .withMessage(en.id_null)
    .bail()
    .isString()
    .withMessage(en.id_format)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(en.userId_format);
      }
      return true;
    }),
  check("text")
    .notEmpty()
    .withMessage(en.text_null)
    .bail()
    .isString()
    .withMessage(en.text_format),
  check("images")
    .optional()
    .bail()
    .isArray()
    .withMessage(en.images_format)
    .custom((array) => {
      if (!array.every((url) => typeof url === "string" && isURL(url))) {
        throw new Error(en.images_url_format);
      }
      return true;
    }),
  check("videos")
    .optional()
    .bail()
    .isArray()
    .withMessage(en.images_format)
    .custom((array) => {
      if (!array.every((url) => typeof url === "string" && isURL(url))) {
        throw new Error(en.videos_url_format);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateMessageId = [
  param("id")
    .not()
    .isEmpty()
    .withMessage(en.id_null)
    .bail()
    .isString()
    .withMessage(en.id_format)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(en.userId_format);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

function isURL(url) {
  var urlPattern = /^(https?:\/\/)?([^\s/?#]+\.?)+(\/[^\s]*)?$/;
  return urlPattern.test(url);
}

module.exports = { validateCreateMessageInput, validateMessageId };

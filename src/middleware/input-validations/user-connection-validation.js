const { check, validationResult, param } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateCreateUserConnectionInput = [
  check("userId")
    .notEmpty()
    .withMessage(en.userId_null)
    .bail()
    .isString()
    .withMessage(en.userId_format)
    .bail()
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

const validateUserConnectionId = [
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

module.exports = { validateCreateUserConnectionInput, validateUserConnectionId };

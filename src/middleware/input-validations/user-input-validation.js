const { validationResult, param, check } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateUserId = [
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

const validateUserUpdateInput = [
  check("firstname")
    .optional()
    .bail()
    .isString()
    .withMessage(en.firstname_format),
  check("lastname")
    .optional()
    .bail()
    .isString()
    .withMessage(en.lastname_format),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateUserId, validateUserUpdateInput };

const { validationResult, check } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateFileUploadInput = [
  check("connectionId")
    .notEmpty()
    .withMessage(en.id_null)
    .bail()
    .isString()
    .withMessage(en.id_format)
    .bail()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(en.id_format);
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


module.exports = { validateFileUploadInput };

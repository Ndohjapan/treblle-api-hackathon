const { check, validationResult } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");

const validateUserLoginInput = [
  check("username")
    .notEmpty()
    .withMessage(en.username_null)
    .bail()
    .isString()
    .withMessage(en.username_format),
  check("password")
    .notEmpty()
    .withMessage(en.password_null)
    .bail()
    .isString()
    .withMessage(en.password_format),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateUserSignupInput = [
  check("username")
    .notEmpty()
    .withMessage(en.username_null)
    .bail()
    .isString()
    .withMessage(en.username_format),
  check("password")
    .notEmpty()
    .withMessage(en.password_null)
    .bail()
    .isString()
    .withMessage(en.password_format)
    .bail()
    .isLength({ min: 8 })
    .withMessage(en.password_length)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(en.password_requirement),
  check("firstname")
    .notEmpty()
    .withMessage(en.firstname_null)
    .bail()
    .isString()
    .withMessage(en.firstname_format),
  check("lastname")
    .notEmpty()
    .withMessage(en.lastname_null)
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

module.exports = { validateUserLoginInput, validateUserSignupInput };

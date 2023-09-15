import { NextResponse } from "next/server";
import { resetPassword } from "../../core/db/auth";

const Validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = (data) => {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export async function POST(req) {
  const res = NextResponse;
  console.log(req.body);

  // Form validation
  if (!req.body) {
    return res.json({}, { status: 500 });
  }
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors, { status: 400 });
  }

  const { token, password } = req.body;

  const response = await resetPassword(token, password);

  console.log("Password reset for user ", response);

  console.log(response);

  return res.status(200).json({ ...response }, { status: 200 });
}

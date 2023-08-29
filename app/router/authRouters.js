const express = require("express");
const ajv = require("../validator/authValidator");
const authValidator = require("../validator/authValidator");
const authController = require("../controller/authController");
const tokenVerify = require("../middleware/authMiddleware");
const authRouter = express.Router();
authRouter.post("/auth/createAccount", async (req, res) => {
  const userAuthSchema = {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string", format: "email" },
      mobileNo: { type: "string" },
      password: { type: "string" },
      authToken: { type: "string" },
      dateOfBirth: { type: "string" },
      age: { type: "integer", minimum: 18, maximum: 99 },
    },
    required: ["firstName", "lastName", "email", "password", "mobileNo"],
    additionalProperties: false,
  };
  const authValidator = ajv.compile(userAuthSchema);
  const validStatus = authValidator(req.body);
  if (!validStatus) {
    res.status(400).json({ Errors: authValidator.errors });
  } else {
    response = await authController.createAccount(req, res);
    res.status(200).json({ success: response });
  }
});
authRouter.post("/auth/loginAccount", async (req, res) => {
  const userLogSchema = {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    required: ["email", "password"],
    additionalProperties: false,
  };
  const userLogValidator = ajv.compile(userLogSchema);
  const validStatus = userLogValidator(req.body);
  if (!validStatus) {
    res.status(400).json({ Errors: userLogValidator.errors });
  } else {
    response = await authController.loginAccount(req, res);
    res.status(200).json({ success: response });
  }
});
authRouter.put("/auth/updateAccount", tokenVerify, async (req, res) => {
  if (req.isAuthenticated) {
    const userAuthSchema = {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        mobileNo: { type: "string" },
        dateOfBirth: { type: "string" },
        age: { type: "integer", minimum: 18, maximum: 80 },
      },
      required: ["firstName", "lastName", "mobileNo", "dateOfBirth", "age"],
      additionalProperties: false,
    };
    const authValidator = ajv.compile(userAuthSchema);
    const validStatus = authValidator(req.body);
    if (!validStatus) {
      res.status(400).json({ Errors: authValidator.errors });
    } else {
      const response = await authController.updateAccount(req, res);
      if (response.status == "Success") {
        res.status(200).json({ success: response });
      } else {
        res.status(400).json({ errors: response });
      }
    }
  } else {
    res
      .status(400)
      .json({ status: "Failed", message: "Authentication session time out" });
  }
});
authRouter.get("/auth/getAccount/", tokenVerify, async (req, res) => {
  if (req.isAuthenticated) {
    const getUsers = await authController.getAccount(req, res);
    if (getUsers.status == "Success") {
      res.status(200).json(getUsers);
    } else {
      res.status(400).json({ status: "Failed", message: "Bad request..!" });
    }
  } else {
    res
      .status(400)
      .json({ status: "Failed", message: "Authentication failed" });
  }
});
authRouter.get("/auth/getAccount/:email", tokenVerify, async (req, res) => {
  if (req.isAuthenticated) {
    const getUser = await authController.getAccountByEmail(req, res);
    if (getUser.status == "Success") {
      res.status(200).json(getUser);
    } else {
      res.status(400).json({ status: "Failed", message: "Bad request..!" });
    }
  } else {
    res
      .status(400)
      .json({ status: "Failed", message: "Authentication failed" });
  }
});
authRouter.patch("/auth/resetPassword", tokenVerify, async (req, res) => {
  if (req.isAuthenticated) {
    const passwordSchema = {
        type: "object",
        properties: {
        password: { type: "string" },
        confirmPassword: { type: "string"},
        },
        required: ["password", "confirmPassword"],
        additionalProperties: false,
    };
    if(req.body.password !== req.body.confirmPassword ){
        res.status(400).json({ Errors: "Password and confirm password not matched..!" });
    }
    const passwordValidator = ajv.compile(passwordSchema);
    const validStatus = passwordValidator(req.body);
    if (!validStatus) {
        res.status(400).json({ Errors: passwordValidator.errors });
    } else {
        const getUserPassword = await authController.resetPasswrdByEmail(req, res);
        if (getUserPassword.status == "Success") {
            res.status(200).json({getUserPassword});
        } else {
            res.status(400).json({ status: "Failed", message: "Bad request..!" });
        }
    }
  } else {
    res.status(400).json({ status: "Failed", message: "Authentication failed" });
  }
});
authRouter.post("/auth/tokenVerify", tokenVerify, async (req, res) => {
  res.status(200).json({ user: req.user });
});
module.exports = authRouter;

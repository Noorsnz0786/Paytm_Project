const express = require("express");
const { sign } = require("jsonwebtoken");
const zod = require("zod");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");

const router = express.Router();
const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(400).json({
      message: "Email already taken",
    });
  }
  const user = await User.create({
    username: req.body.username,
    password : req.body.password,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
  });
  const userId = user._id;

  const token = sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const parseResult = signinSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.json({
      message: "User logged in successfully",
      token: token,
    });
    return;
  }
  res.status(401).json({
    message: "Invalid username or password",
  });
});

module.exports = router;

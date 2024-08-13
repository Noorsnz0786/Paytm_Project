const express = require("express");
const { sign } = require("jsonwebtoken");
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleWare } = require("../middleware");

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
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;
await Account.create({
    userId: userId,
    Balance : 1+ Math.random()*10000
})
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

const updateBodySchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/update", authMiddleWare, async (req, res) => {
  const { success } = updateBodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Error while updating information",
    });
  }
  const user = await User.updateOne(
    {
      _id: req.user.userId,
    },
    req.body
  );
  res.json({
    message: "User information updated successfully",
  })
});

router.get('/bulk', async (req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName : {
                "$regex" : filter
            },
            lastName : {
                "$regex" : filter
            }
            }]
    })
    res.json({
        user : users.map(user=>{
            return {
                id: user._id,
                username : user.username,
                firstName: user.firstName,
                lastName: user.lastName
                }
        })
    })
})
module.exports = router;

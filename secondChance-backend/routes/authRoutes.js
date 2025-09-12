const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const connectToDatabase = require("../models/db");
const dotenv = require("dotenv");
const pino = require("pino");
dotenv.config();

const logger = pino();

//Create JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const existingEmail = await collection.findOne({ email: req.body.email });

    if (existingEmail) {
      logger.error("Email id already exists");
      return res.status(400).send("Email is already exists");
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    const payload = { user: { id: newUser.insertedId } };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info(`User registered successfully`);
    res.json({ authtoken, email });
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: req.body.email });

    if (user) {
      let result = await bcryptjs.compare(req.body.password, user.password);
      if (!result) {
        logger.error("Passwords do not match");
        return res.status(400).send("Wrong password");
      }

      let payload = { user: { id: user._id.toString() } };

      const userName = user.firstName;
      const userEmail = user.email;
      //Create JWT authentication if passwords match
      const authtoken = jwt.sign(payload, JWT_SECRET);
      logger.info(`User logged in successfully`);
      return res.status(200).json({ authtoken, userName, userEmail });
    } else {
      logger.error("User not found");
      return res.status(400).json({ error: "User not found" });
    }
  } catch (e) {
    logger.error(e);
    return res
      .status(500)
      .json({ error: "Internal server error", details: e.message });
  }
});

module.exports = router;

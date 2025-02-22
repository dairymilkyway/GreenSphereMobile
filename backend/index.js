require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const UserModel = require("./model/User");
const { verifyUser } = require("./middleware/auth");
const sendOtpEmail = require('./mailer');
const generateOtp = require('./otp');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8082; // Use port from .env or default to 8082
const MONGO_URI = process.env.MONGO_URI;


const corsOptions = {
  origin: 'http://localhost:8081', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

  app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = "user"; // Default role is user
        let otp = null;
        let otpExpires = null;
        if (role === "user") {
            otp = generateOtp();
            otpExpires = Date.now() + 3600000; // 1 hour from now
            sendOtpEmail(email, otp);
        }
        const newUser = new UserModel({ name, email, password: hashedPassword, role, otp, otpExpires });
        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully. Please check your email for the OTP if you are a user." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "No Records Found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password does not match!" });
        }

        // If user is NOT verified, redirect them to verify OTP
        if (user.role === "user" && user.isVerified === false) {
            return res.json({
                message: "Please verify your email with the OTP sent to you.",
                redirect: "/verify-otp",
                email: email, // Send email for use in frontend
            });
        }

        // Store user session after verification
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return res.json({ message: "Success", role: user.role });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not Authenticated");
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
      const { email, otp } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }
      if (user.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
      }
      if (user.otpExpires < Date.now()) {
          return res.status(400).json({ message: "OTP has expired" });
      }
      user.isVerified = true;
      user.otp = null; // Clear the OTP
      user.otpExpires = null; // Clear the OTP expiration
      await user.save();
      res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/resend-otp", async (req, res) => {
  try {
      const { email } = req.body;

      // Check if the user exists
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Generate new OTP
      const newOtp = generateOtp();
      const otpExpires = Date.now() + 3600000; // Expires in 1 hour

      // Update user record with new OTP
      user.otp = newOtp;
      user.otpExpires = otpExpires;
      await user.save();

      // Resend OTP via email
      sendOtpEmail(email, newOtp);

      res.json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
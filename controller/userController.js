const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { google } = require("googleapis");

// Lấy OAuth2 từ googleapis
const OAuth2 = google.auth.OAuth2;

const login = async (req, res) => {
  try {
    const { User } = req.db; // Import User từ database
    const { email, password } = req.body;

    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Login failed, email or password is incorrect!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Login failed, password is incorrect!" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, idUser: user.user_id });
  } catch (error) {
    console.error("Error occurred during login: ", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
};

const getUserById = async (req, res) => {
  try {
    const { User } = req.db;
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist in the system.",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error occurred while retrieving user: ", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
};

const signup = async (req, res) => {
  try {
    const { User } = req.db;
    const { password, email, name } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email address." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    console.log("Signup error: ", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
};
const reset_password = async (req, res) => {
  const { User } = req.db;
  const { id, token } = req.params;
  const { password } = req.body;

  console.log("Received id:", id); // Debugging
  console.log("Received token:", token); // Debugging

  if (!id || !token) {
    return res.status(400).json({ message: "ID and token are required." });
  }

  try {
    // Tìm user theo ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const secret = process.env.RESET_PASSWORD_KEY;

    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.id !== user.user_id) {
        return res.status(401).json({ message: "Invalid token." });
      }

      // Mã hóa mật khẩu mới
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Cập nhật mật khẩu của user
      await User.update(
        { password: encryptedPassword },
        { where: { user_id: user.user_id } }
      );

      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", error: err.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const requestResetPassword = async (req, res) => {
  const { User } = req.db;
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    const secret = process.env.RESET_PASSWORD_KEY;
    const token = jwt.sign({ id: user.user_id }, secret, { expiresIn: "5m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${user.user_id}/${token}`;

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_APP_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_APP_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>If you did not request a password reset, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error("Error occurred while sending password reset email:", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
};

module.exports = {
  signup,
  login,
  reset_password,
  getUserById,
  requestResetPassword,
};

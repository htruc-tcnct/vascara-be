const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const login = async (req, res) => {
  try {
    const { User } = req.db;
    const { email, phone_number, password } = req.body;

    // Kiểm tra nếu chỉ có `email` hoặc `phone_number` được cung cấp
    if (!password || (!email && !phone_number)) {
      return res
        .status(400)
        .json({ message: "Email or phone number and password are required." });
    }

    // Tạo điều kiện tìm kiếm dựa vào `email` hoặc `phone_number`
    const user = await User.findOne({
      where: {
        [Op.or]: [
          email ? { email } : {}, // Nếu `email` có giá trị, thêm vào điều kiện tìm kiếm
          phone_number ? { phone_number } : {}, // Nếu `phone_number` có giá trị, thêm vào điều kiện tìm kiếm
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Login failed, email/phone number or password is incorrect!",
      });
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

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error occurred during login: ", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
};
const signup = async (req, res) => {
  try {
    const { User } = req.db;
    const { password, email, phone_number } = req.body;
    const existngUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone_number }],
      },
    });
    if (existngUser) {
      return res
        .status(400)
        .json({ message: "email or phone number already exists.!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      phone_number,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Signup succesfull", user: newUser });
  } catch (error) {
    console.log("Signup error: ", error);
    res
      .status(500)
      .json({ message: "We have an error, please try again later" });
  }
};

module.exports = {
  signup,
  login,
};

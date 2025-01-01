const axios = require("axios");

const addNewAddress = async (req, res) => {
  const { Address } = req.db;

  const userId = req.user?.userId; // Assuming `id` is the field set in the JWT payload
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing from the request." });
  }

  const { province_code, district_code, ward_code, specific_address } =
    req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!province_code || !district_code || !ward_code || !specific_address) {
    return res.status(400).json({
      error: "All fields are required",
      missingFields: {
        province: !province_code,
        district: !district_code,
        ward: !ward_code,
        specific_address: !specific_address,
      },
    });
  }

  try {
    // Fetch tên của tỉnh, huyện, xã từ API
    const [provinceData, districtData, wardData] = await Promise.all([
      axios.get(`https://provinces.open-api.vn/api/p/${province_code}`),
      axios.get(`https://provinces.open-api.vn/api/d/${district_code}`),
      axios.get(`https://provinces.open-api.vn/api/w/${ward_code}`),
    ]);

    const province_name = provinceData.data.name;
    const district_name = districtData.data.name;
    const ward_name = wardData.data.name;

    // Tạo địa chỉ mới
    const newAddress = await Address.create({
      user_id: userId,
      province_code,
      district_code,
      ward_code,
      specific_address,
    });

    return res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (err) {
    console.error("Error adding address:", err.message);
    return res.status(500).json({
      error:
        "An error occurred while adding the address. Please try again later.",
    });
  }
};
const getAddressById = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract userId from the request object
    const { Address, User } = req.db; // Address and User models from database

    if (!userId) {
      return res.status(400).json({ error: "UserId is required to search" });
    }

    // Fetch address data
    const address = await Address.findAll({
      where: {
        user_id: userId,
      },
    });

    // Fetch user data
    const user = await User.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!address) {
      return res
        .status(404)
        .json({ error: "Address not found for the given criteria" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found for the given criteria" });
    }

    // Combine address and user data into a single response object
    const combinedData = {
      address,
      user,
    };

    return res.status(200).json({ success: true, data: combinedData });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching address or user:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addNewAddress,
  getAddressById,
};

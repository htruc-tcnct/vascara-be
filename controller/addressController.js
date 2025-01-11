const axios = require("axios");

const addNewAddress = async (req, res) => {
  const { Address } = req.db;

  const userId = req.user?.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing from the request." });
  }

  const { province_code, district_code, ward_code, specific_address } =
    req.body;

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
    const [province_data, district_data, ward_data] = await Promise.all([
      axios.get(`${process.env.API_MAP_VN}/p/${province_code}`).catch((err) => {
        console.error(
          "Error fetching province:",
          err.response?.data || err.message
        );
        return null;
      }),
      axios.get(`${process.env.API_MAP_VN}/d/${district_code}`).catch((err) => {
        console.error(
          "Error fetching district:",
          err.response?.data || err.message
        );
        return null;
      }),
      axios.get(`${process.env.API_MAP_VN}/w/${ward_code}`).catch((err) => {
        console.error(
          "Error fetching ward:",
          err.response?.data || err.message
        );
        return null;
      }),
    ]);

    if (!province_data || !district_data || !ward_data) {
      return res.status(400).json({
        error: "Failed to fetch one or more address components",
        details: {
          province: province_data?.data || "Not found",
          district: district_data?.data || "Not found",
          ward: ward_data?.data || "Not found",
        },
      });
    }
    console.log("province_data: ", province_data.data);
    const newAddress = await Address.create({
      user_id: userId,
      province_code,
      district_code,
      ward_code,
      province_name: province_data?.data?.name || "Unknown Province",
      district_name: district_data?.data?.name || "Unknown District",
      ward_name: ward_data?.data?.name || "Unknown Ward",
      specific_address,
    });

    console.log("newAddress: ", newAddress);
    return res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (err) {
    console.error("Error adding address:", err.message);
    return res.status(500).json({
      error:
        "An error occurred while adding the address. Please try again later.",
      detail: err.message,
    });
  }
};
const deleteAddress = async (req, res) => {
  const { Address } = req.db;
  const userId = req.user?.userId;
  const addressId = req.params.id;
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing from the request." });
  }
  if (!addressId) {
    return res
      .status(400)
      .json({ error: "Address ID is missing from the request." });
  }
  try {
    const address = await Address.findOne({
      where: {
        user_id: userId,
        address_id: addressId,
      },
    });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    await address.destroy();
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateAddress = async (req, res) => {
  const { Address } = req.db;
  const userId = req.user?.userId;
  const addressId = req.params.id;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing from the request." });
  }
  if (!addressId) {
    return res
      .status(400)
      .json({ error: "Address ID is missing from the request." });
  }

  const { province_code, district_code, ward_code, specific_address } =
    req.body;

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

  let addressUpdate;
  try {
    addressUpdate = await Address.findOne({
      where: {
        user_id: userId,
        address_id: addressId,
      },
    });

    if (!addressUpdate) {
      return res.status(404).json({ error: "Address not found" });
    }
  } catch (err) {
    console.error("Error fetching address:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const [province_data, district_data, ward_data] = await Promise.all([
      axios.get(`${process.env.API_MAP_VN}/p/${province_code}`).catch((err) => {
        console.error(
          "Error fetching province:",
          err.response?.data || err.message
        );
        return null;
      }),
      axios.get(`${process.env.API_MAP_VN}/d/${district_code}`).catch((err) => {
        console.error(
          "Error fetching district:",
          err.response?.data || err.message
        );
        return null;
      }),
      axios.get(`${process.env.API_MAP_VN}/w/${ward_code}`).catch((err) => {
        console.error(
          "Error fetching ward:",
          err.response?.data || err.message
        );
        return null;
      }),
    ]);

    if (!province_data?.data || !district_data?.data || !ward_data?.data) {
      return res.status(400).json({
        error: "Failed to fetch one or more address components",
        details: {
          province: province_data?.data || "Not found",
          district: district_data?.data || "Not found",
          ward: ward_data?.data || "Not found",
        },
      });
    }

    const updatedAddress = await addressUpdate.update({
      province_code,
      district_code,
      ward_code,
      province_name: province_data.data.name || "Unknown Province",
      district_name: district_data.data.name || "Unknown District",
      ward_name: ward_data.data.name || "Unknown Ward",
      specific_address,
    });

    return res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error.message);
    return res.status(500).json({ error: "Internal server error" });
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
  deleteAddress,
  updateAddress,
};

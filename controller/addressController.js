const addNewAddress = async (req, res) => {
  const { Address } = req.db;

  const userId = req.user?.userId; // Assuming `id` is the field set in the JWT payload
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID is missing from the request.", m: req.user });
  }

  const { province, district, ward, detail } = req.body;

  // Check if all required fields are present
  if (!province || !district || !ward || !detail) {
    return res.status(400).json({
      error: "All fields are required",
      missingFields: {
        province: !province,
        district: !district,
        ward: !ward,
        detail: !detail,
      },
    });
  }

  try {
    // Attempt to create the new address
    const newAddress = await Address.create({
      user_id: userId,
      province,
      district,
      ward,
      specific_address: detail, // Ensure the database column matches this field
    });

    return res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (err) {
    console.error("Error adding address:", err);
    return res.status(500).json({
      error:
        "An error occurred while adding the address. Please try again later.",
    });
  }
};

module.exports = {
  addNewAddress,
};

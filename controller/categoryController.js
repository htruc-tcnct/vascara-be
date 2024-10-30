const getAllCategories = async (req, res) => {
  try {
    const { Category } = req.db;
    const categories = await Category.findAll();
    res.json({
      categories: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
};

module.exports = {
  getAllCategories,
};

const { Op, where, or } = require("sequelize");
const getAllProducts = async (req, res) => {
  try {
    const { Product, ProductTranslation, ProductImage } = req.db;

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      include: [
        {
          model: ProductTranslation,
          as: "translations",
        },
        {
          model: ProductImage,
          as: "product_images",
        },
      ],
      limit: limit,
      offset: offset,
    });

    // Count total products for pagination metadata
    const totalProducts = await Product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching products with translations and images:",
      error
    );
    res
      .status(500)
      .send("Error fetching products with translations and images");
  }
};
const getProductWithCondition = async (req, res) => {
  try {
    const { category_id, priceRange, sortSelect, keyword } = req.query;
    const { Product, ProductTranslation, ProductImage, Size } = req.db;

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    let filterConditions = {};
    const orderConditions = [];

    // Filter by category ID if provided
    if (category_id) {
      filterConditions.category_id = category_id;
    }

    // Filter by price range if provided
    if (priceRange) {
      if (priceRange.startsWith(">")) {
        const min = Number(priceRange.slice(1).trim());
        if (!isNaN(min)) {
          filterConditions.price = { [Op.gt]: min };
        }
      } else if (priceRange.startsWith("<")) {
        const max = Number(priceRange.slice(1).trim());
        if (!isNaN(max)) {
          filterConditions.price = { [Op.lt]: max };
        }
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          filterConditions.price = { [Op.between]: [min, max] };
        }
      }
    }

    // Sorting condition if provided
    if (sortSelect) {
      switch (sortSelect) {
        case "price_asc":
          orderConditions.push(["price", "ASC"]);
          break;
        case "price_desc":
          orderConditions.push(["price", "DESC"]);
          break;
        case "normal":
          orderConditions.push(["", ""]);
          break;
      }
    }

    // Translation and Size filter conditions based on category
    let translationFilterConditions = {};
    let sizeFilterConditions = {};

    if (category_id === "1") {
      // Apply keyword filter on ProductTranslation if category_id is 1
      if (keyword) {
        translationFilterConditions.name = { [Op.like]: `%${keyword}%` };
      }
    } else if (category_id === "3") {
      // Apply keyword filter on Size if category_id is 3
      if (keyword) {
        sizeFilterConditions.size = { [Op.like]: `%${keyword}%` };
      }
    }

    // Fetch products with the provided filters and includes
    const products = await Product.findAll({
      where: filterConditions,
      order: orderConditions,
      include: [
        {
          model: ProductTranslation,
          as: "translations",
          where: Object.keys(translationFilterConditions).length
            ? translationFilterConditions
            : undefined,
        },
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Size,
          as: "sizes",
          where: Object.keys(sizeFilterConditions).length
            ? sizeFilterConditions
            : undefined,
          attributes: ["size", "stock"],
        },
      ],
      limit: limit,
      offset: offset,
    });

    // Count distinct products with filters, avoiding duplicate counts for translations and sizes
    const totalProducts = await Product.count({
      where: filterConditions,
      distinct: true,
      col: "product_id",
      include: [
        {
          model: ProductTranslation,
          as: "translations",
          where: Object.keys(translationFilterConditions).length
            ? translationFilterConditions
            : undefined,
        },
        {
          model: Size,
          as: "sizes",
          where: Object.keys(sizeFilterConditions).length
            ? sizeFilterConditions
            : undefined,
        },
      ],
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      },
    });
  } catch (err) {
    console.error("Error fetching products with filters:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = {
  getAllProducts,
  getProductWithCondition,
};

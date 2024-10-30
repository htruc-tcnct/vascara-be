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
    const { category_id, priceRange, sortSelect } = req.query;
    const { Product, ProductTranslation, ProductImage } = req.db;

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    let filterConditions = {};
    const orderConditions = [];
    if (category_id) {
      filterConditions.category_id = category_id;
    }

    if (priceRange) {
      if (priceRange.startsWith(">")) {
        const min = Number(priceRange.slice(1).trim());
        if (!isNaN(min)) {
          filterConditions.price = { [Op.gt]: min }; // Điều kiện lớn hơn
        }
      } else if (priceRange.startsWith("<")) {
        const max = Number(priceRange.slice(1).trim());
        if (!isNaN(max)) {
          filterConditions.price = { [Op.lt]: max }; // Điều kiện nhỏ hơn
        }
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          filterConditions.price = { [Op.between]: [min, max] }; // Điều kiện trong khoảng
        }
      }
    }
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
    // Lấy sản phẩm
    const products = await Product.findAll({
      where: filterConditions,
      order: orderConditions,
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
  } catch (err) {
    console.error("Error fetching products with filters:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = {
  getAllProducts,
  getProductWithCondition,
};

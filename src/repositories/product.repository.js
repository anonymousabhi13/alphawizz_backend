const { Product, ProductVariant, ProductImage, Category } = require('../models');
const { Op } = require('sequelize');

class ProductRepository {
  async findAllCategories() {
    return await Category.findAll({ where: { status: 'ACTIVE' } });
  }

  async findProducts({ page = 1, limit = 20, category_id, search, sort }) {
    const offset = (page - 1) * limit;
    const where = { status: 'ACTIVE' };

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let order = [['created_at', 'DESC']]; // default sort
    
    // Note: sorting by price when price is inside ProductVariant requires careful ordering.
    // If sort is price_asc or price_desc, we can sort variants or handle it.
    // Let's implement basic sorting options.
    if (sort === 'price_asc') {
      order = [[{ model: ProductVariant, as: 'variants' }, 'price', 'ASC']];
    } else if (sort === 'price_desc') {
      order = [[{ model: ProductVariant, as: 'variants' }, 'price', 'DESC']];
    } else if (sort === 'name_asc') {
      order = [['name', 'ASC']];
    } else if (sort === 'name_desc') {
      order = [['name', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order,
      distinct: true,
      include: [
        {
          model: ProductVariant,
          as: 'variants',
          where: { status: 'ACTIVE' },
          required: false
        }
      ]
    });

    // Map each product to format:
    // { id, name, thumbnail, price, sale_price, has_variants }
    // where price and sale_price are fetched from lowest variant price
    const mappedProducts = rows.map(product => {
      const variants = product.variants || [];
      const hasVariants = variants.length > 0;
      
      let price = 0;
      let salePrice = null;

      if (hasVariants) {
        // Find lowest price variant
        const sortedVariants = [...variants].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        price = parseFloat(sortedVariants[0].price);
        salePrice = sortedVariants[0].sale_price ? parseFloat(sortedVariants[0].sale_price) : null;
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        thumbnail: product.thumbnail,
        price,
        sale_price: salePrice,
        has_variants: hasVariants,
        is_featured: product.is_featured
      };
    });

    return {
      products: mappedProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  async findDetailById(id) {
    const product = await Product.findOne({
      where: { id, status: 'ACTIVE' },
      include: [
        { model: ProductVariant, as: 'variants', where: { status: 'ACTIVE' }, required: false },
        { model: ProductImage, as: 'images' }
      ]
    });

    if (!product) return null;

    // Fetch related products (e.g. same category, excluding current product, limit 4)
    const related = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id },
        status: 'ACTIVE'
      },
      limit: 4,
      include: [{ model: ProductVariant, as: 'variants', where: { status: 'ACTIVE' }, required: false }]
    });

    const mappedRelated = related.map(p => {
      const variants = p.variants || [];
      const hasVariants = variants.length > 0;
      let price = 0;
      let salePrice = null;
      if (hasVariants) {
        const sorted = [...variants].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        price = parseFloat(sorted[0].price);
        salePrice = sorted[0].sale_price ? parseFloat(sorted[0].sale_price) : null;
      }
      return {
        id: p.id,
        name: p.name,
        thumbnail: p.thumbnail,
        price,
        sale_price: salePrice,
        has_variants: hasVariants
      };
    });

    return {
      product: {
        id: product.id,
        category_id: product.category_id,
        name: product.name,
        slug: product.slug,
        short_description: product.short_description,
        description: product.description,
        brand: product.brand,
        sku: product.sku,
        thumbnail: product.thumbnail,
        status: product.status,
        is_featured: product.is_featured
      },
      images: product.images || [],
      variants: product.variants || [],
      related_products: mappedRelated
    };
  }

  async findVariantById(id) {
    return await ProductVariant.findByPk(id);
  }

  async findProductById(id) {
    return await Product.findByPk(id);
  }
}

module.exports = new ProductRepository();

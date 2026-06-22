const { sequelize, Category, Product, ProductVariant, ProductImage, User } = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding.');

    // Clear existing data
    await sequelize.sync({ force: true });
    console.log('Database cleared (tables recreated).');

    // 1. Seed Categories matching dashboard categories
    const categories = await Category.bulkCreate([
      {
        name: 'Fashion',
        slug: 'fashion',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
        description: 'Trending clothes, shoes and apparel',
        status: 'ACTIVE'
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
        description: 'Smartphones, watches and devices',
        status: 'ACTIVE'
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500',
        description: 'Comfortable chairs, sofas and tables',
        status: 'ACTIVE'
      },
      {
        name: 'Groceries',
        slug: 'groceries',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        description: 'Daily fresh grocery items',
        status: 'ACTIVE'
      }
    ]);

    const fashionId = categories[0].id;
    const electronicsId = categories[1].id;
    const furnitureId = categories[2].id;
    const groceriesId = categories[3].id;

    // 2. Seed Products

    // -- Product 1: Nike Air Force 1 (Fashion/Shoes)
    const nikeAirForce = await Product.create({
      category_id: fashionId,
      name: 'Nike Air Force 1',
      slug: 'nike-air-force-1',
      short_description: 'Classic basketball shoe design with premium leather style.',
      description: 'Nike is one of the world\'s leading sportswear brands, known for its innovation, quality, and iconic designs. From high-performance footwear to everyday essentials, Nike products are crafted to enhance comfort, support movement, and elevate.',
      brand: 'NIKE',
      sku: 'NIKE-AF1',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', // Premium shoe view
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', sort_order: 1 },
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', sort_order: 2 }, // Orange variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', sort_order: 3 }, // Black variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', sort_order: 4 }  // Blue variant
    ]);

    // Seed size & color combinations as variants
    const colors = ['Green', 'Orange', 'Black', 'Blue'];
    const sizes = ['4', '5', '6', '7', '8'];
    const colorPrices = { 'Green': 285.00, 'Orange': 295.00, 'Black': 310.00, 'Blue': 300.00 };

    for (const color of colors) {
      for (const size of sizes) {
        await ProductVariant.create({
          product_id: nikeAirForce.id,
          variant_name: 'Colour & Size',
          variant_value: `${color} / UK ${size}`,
          sku: `NK-AF1-${color.toUpperCase()}-${size}`,
          price: colorPrices[color],
          sale_price: colorPrices[color] - 10,
          stock: 45,
          weight: 0.8,
          status: 'ACTIVE'
        });
      }
    }

    // -- Product 2: Adidas Ultraboost (Fashion/Shoes)
    const adidasUltraboost = await Product.create({
      category_id: fashionId,
      name: 'Adidas Ultraboost',
      slug: 'adidas-ultraboost',
      short_description: 'High energy return running shoes.',
      description: 'Experience pure comfort and energy return with every stride. Primeknit upper and Boost midsole cushioning make this perfect for daily running.',
      brand: 'ADIDAS',
      sku: 'ADI-BOOST',
      thumbnail: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500', // Adidas styled shoe image
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductVariant.bulkCreate([
      { product_id: adidasUltraboost.id, variant_name: 'Size', variant_value: 'UK 7', sku: 'AD-BS-7', price: 3499.00, stock: 20, status: 'ACTIVE' },
      { product_id: adidasUltraboost.id, variant_name: 'Size', variant_value: 'UK 8', sku: 'AD-BS-8', price: 3599.00, stock: 25, status: 'ACTIVE' }
    ]);

    // -- Product 3: New Balance 574 (Fashion/Shoes)
    const nb574 = await Product.create({
      category_id: fashionId,
      name: 'New Balance 574',
      slug: 'new-balance-574',
      short_description: 'Iconic retro sneaker comfort.',
      description: 'The most New Balance shoe ever. Classic suede and mesh design, ENCAP midsole cushioning delivers all-day support.',
      brand: 'NEW BALANCE',
      sku: 'NB-574',
      thumbnail: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', // NB image
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductVariant.bulkCreate([
      { product_id: nb574.id, variant_name: 'Size', variant_value: 'UK 7', sku: 'NB-574-7', price: 3199.00, stock: 15, status: 'ACTIVE' },
      { product_id: nb574.id, variant_name: 'Size', variant_value: 'UK 8', sku: 'NB-574-8', price: 3299.00, stock: 12, status: 'ACTIVE' }
    ]);

    // -- Product 4: ASICS Gel-Kayano (Fashion/Shoes)
    const asicsKayano = await Product.create({
      category_id: fashionId,
      name: 'ASICS Gel-Kayano',
      slug: 'asics-gel-kayano',
      short_description: 'Premium stability running footwear.',
      description: 'Designed to provide advanced stability and cushioning properties for long runs. Gel technology ensures impact protection.',
      brand: 'ASICS',
      sku: 'ASICS-GK',
      thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', // Athletic shoe
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductVariant.bulkCreate([
      { product_id: asicsKayano.id, variant_name: 'Size', variant_value: 'UK 7', sku: 'AS-GK-7', price: 4199.00, stock: 18, status: 'ACTIVE' },
      { product_id: asicsKayano.id, variant_name: 'Size', variant_value: 'UK 8', sku: 'AS-GK-8', price: 4299.00, stock: 10, status: 'ACTIVE' }
    ]);

    // -- Product 5: Loop Silicone Strong Magnetic Watch (Electronics)
    const loopWatch = await Product.create({
      category_id: electronicsId,
      name: 'Loop Silicone Strong Magnetic Watch',
      slug: 'loop-silicone-strong-magnetic-watch',
      short_description: 'Loop silicone strap watch with high compatibility magnetic loop.',
      description: 'Elegant smartwatch featuring silicone strap loops, active heart-rate tracker, sleep tracker, notifications, and modular magnetic closure locks.',
      brand: 'APPLE',
      sku: 'LP-WATCH',
      thumbnail: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500', // Premium watch image
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductVariant.bulkCreate([
      {
        product_id: loopWatch.id,
        variant_name: 'Band Size',
        variant_value: '44mm / Regular',
        sku: 'LP-WT-44',
        price: 1330.00,
        stock: 50,
        status: 'ACTIVE'
      }
    ]);

    // -- Product 6: Eames Lounge Chair (Furniture)
    const loungeChair = await Product.create({
      category_id: furnitureId,
      name: 'Eames Lounge Chair',
      slug: 'eames-lounge-chair',
      short_description: 'Mid-century modern master lounge chair.',
      description: 'Handcrafted luxury seat with premium leather upholstery and rosewood veneer shells.',
      brand: 'HERMAN MILLER',
      sku: 'EAMES-LC',
      thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', // Aesthetic chair image
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductVariant.bulkCreate([
      { product_id: loungeChair.id, variant_name: 'Material', variant_value: 'Walnut Leather', sku: 'EM-LC-WAL', price: 1800.00, stock: 5, status: 'ACTIVE' }
    ]);

    // 3. Seed Default User
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await User.create({
      name: 'Shreya Shah',
      email: 'test@example.com',
      mobile: '9876543210',
      password: hashedPassword,
      status: 'ACTIVE'
    });

    console.log('Seeded User: test@example.com / password123');

    // 4. Seed User Default Shipping Address
    await user.createAddress({
      name: 'Shreya Shah',
      mobile: '9876543210',
      address_line_1: '123 Main Street',
      address_line_2: 'Apartment 4B',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postal_code: '78701',
      is_default: true
    });

    console.log('✅ Seeding complete! Database is populated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

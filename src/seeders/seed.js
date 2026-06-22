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
      description: 'Nike is one of the world\'s leading sportswear brands, known for its innovation, quality, and iconic designs.',
      brand: 'NIKE',
      sku: 'NIKE-AF1',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', sort_order: 1 }, // Green/Volt variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', sort_order: 2 }, // Orange variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', sort_order: 3 }, // Black variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500', sort_order: 4 }, // Red variant
      { product_id: nikeAirForce.id, image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', sort_order: 5 }  // White variant
    ]);

    // Size/Color combinations for Nike
    for (const color of ['Volt', 'Orange', 'Black', 'Crimson Red', 'Classic White']) {
      for (const size of ['7', '8', '9']) {
        await ProductVariant.create({
          product_id: nikeAirForce.id,
          variant_name: 'Colour & Size',
          variant_value: `${color} / UK ${size}`,
          sku: `NK-AF1-${color.toUpperCase().replace(' ', '-')}-${size}`,
          price: 295.00,
          sale_price: 265.00,
          stock: 30,
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
      description: 'Experience pure comfort and energy return with every stride.',
      brand: 'ADIDAS',
      sku: 'ADI-BOOST',
      thumbnail: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: adidasUltraboost.id, image_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500', sort_order: 1 }, // Core Black
      { product_id: adidasUltraboost.id, image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', sort_order: 2 }  // Cloud White
    ]);

    for (const color of ['Core Black', 'Cloud White']) {
      for (const size of ['7', '8', '9']) {
        await ProductVariant.create({
          product_id: adidasUltraboost.id,
          variant_name: 'Colour & Size',
          variant_value: `${color} / UK ${size}`,
          sku: `AD-UB-${color.toUpperCase().replace(' ', '-')}-${size}`,
          price: 349.00,
          sale_price: 319.00,
          stock: 25,
          status: 'ACTIVE'
        });
      }
    }

    // -- Product 3: New Balance 574 (Fashion/Shoes)
    const nb574 = await Product.create({
      category_id: fashionId,
      name: 'New Balance 574',
      slug: 'new-balance-574',
      short_description: 'Iconic retro sneaker comfort.',
      description: 'The most New Balance shoe ever.',
      brand: 'NEW BALANCE',
      sku: 'NB-574',
      thumbnail: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: nb574.id, image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', sort_order: 1 }
    ]);

    for (const size of ['7', '8', '9', '10']) {
      await ProductVariant.create({
        product_id: nb574.id,
        variant_name: 'Size',
        variant_value: `UK ${size}`,
        sku: `NB-574-UK${size}`,
        price: 120.00,
        sale_price: 105.00,
        stock: 15,
        status: 'ACTIVE'
      });
    }

    // -- Product 4: Puma Suede Classic (Fashion/Shoes)
    const pumaSuede = await Product.create({
      category_id: fashionId,
      name: 'Puma Suede Classic',
      slug: 'puma-suede-classic',
      short_description: 'Streetwear style definition.',
      description: 'Featuring full suede upper and classic contrast side stripe.',
      brand: 'PUMA',
      sku: 'PUMA-SUEDE',
      thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: pumaSuede.id, image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', sort_order: 1 }, // Classic Black
      { product_id: pumaSuede.id, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', sort_order: 2 }  // Cabernet Red
    ]);

    for (const color of ['Classic Black', 'Cabernet Red']) {
      for (const size of ['6', '7', '8', '9']) {
        await ProductVariant.create({
          product_id: pumaSuede.id,
          variant_name: 'Colour & Size',
          variant_value: `${color} / UK ${size}`,
          sku: `PM-SD-${color.toUpperCase().replace(' ', '-')}-${size}`,
          price: 85.00,
          stock: 40,
          status: 'ACTIVE'
        });
      }
    }

    // -- Product 5: Loop Silicone Strong Magnetic Watch (Electronics)
    const loopWatch = await Product.create({
      category_id: electronicsId,
      name: 'Loop Silicone Strong Magnetic Watch',
      slug: 'loop-silicone-strong-magnetic-watch',
      short_description: 'Strap watch with high compatibility magnetic loop.',
      description: 'Elegant smartwatch featuring silicone strap loops.',
      brand: 'APPLE',
      sku: 'LP-WATCH',
      thumbnail: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: loopWatch.id, image_url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500', sort_order: 1 }, // Midnight Black
      { product_id: loopWatch.id, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', sort_order: 2 }  // Starlight Silver
    ]);

    await ProductVariant.bulkCreate([
      { product_id: loopWatch.id, variant_name: 'Band Color', variant_value: 'Midnight Black', sku: 'LP-WT-BLK', price: 1330.00, stock: 50, status: 'ACTIVE' },
      { product_id: loopWatch.id, variant_name: 'Band Color', variant_value: 'Starlight Silver', sku: 'LP-WT-SLV', price: 1330.00, stock: 40, status: 'ACTIVE' }
    ]);

    // -- Product 6: iPhone 15 Pro (Electronics)
    const iphone15 = await Product.create({
      category_id: electronicsId,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      short_description: 'Titanium design with A17 Pro chip.',
      description: 'Super strong titanium casing, dynamic island, and advanced camera array.',
      brand: 'APPLE',
      sku: 'IPHONE-15PRO',
      thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: iphone15.id, image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500', sort_order: 1 }, // Natural Titanium
      { product_id: iphone15.id, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', sort_order: 2 }  // Black Titanium
    ]);

    for (const color of ['Natural Titanium', 'Black Titanium']) {
      for (const storage of ['128GB', '256GB', '512GB']) {
        let price = storage === '128GB' ? 999.00 : storage === '256GB' ? 1099.00 : 1299.00;
        await ProductVariant.create({
          product_id: iphone15.id,
          variant_name: 'Colour & Storage',
          variant_value: `${color} / ${storage}`,
          sku: `IP15-${color.substring(0, 3).toUpperCase()}-${storage}`,
          price: price,
          sale_price: price - 20,
          stock: 20,
          status: 'ACTIVE'
        });
      }
    }

    // -- Product 7: Sony WH-1000XM5 (Electronics)
    const sonyHeadphones = await Product.create({
      category_id: electronicsId,
      name: 'Sony WH-1000XM5 ANC Headphones',
      slug: 'sony-wh-1000xm5',
      short_description: 'Industry leading active noise cancellation.',
      description: 'Magnificent sound, crystal clear calls, and incredible battery life.',
      brand: 'SONY',
      sku: 'SONY-XM5',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: sonyHeadphones.id, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', sort_order: 1 }, // Platinum Silver
      { product_id: sonyHeadphones.id, image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', sort_order: 2 }  // Midnight Black
    ]);

    await ProductVariant.bulkCreate([
      { product_id: sonyHeadphones.id, variant_name: 'Colour', variant_value: 'Platinum Silver', sku: 'SN-XM5-SLV', price: 399.00, stock: 15, status: 'ACTIVE' },
      { product_id: sonyHeadphones.id, variant_name: 'Colour', variant_value: 'Midnight Black', sku: 'SN-XM5-BLK', price: 399.00, stock: 25, status: 'ACTIVE' }
    ]);

    // -- Product 8: Mechanical Keyboard K2 (Electronics)
    const keychronK2 = await Product.create({
      category_id: electronicsId,
      name: 'Keychron K2 Keyboard',
      slug: 'keychron-k2',
      short_description: '75% Layout wireless mechanical keyboard.',
      description: 'Mac and Windows compatible, bluetooth pairing, and tactile feedback switches.',
      brand: 'KEYCHRON',
      sku: 'KC-K2',
      thumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: keychronK2.id, image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: keychronK2.id, variant_name: 'Switch Type', variant_value: 'Gateron Brown (Tactile)', sku: 'KC-K2-BRN', price: 95.00, stock: 35, status: 'ACTIVE' },
      { product_id: keychronK2.id, variant_name: 'Switch Type', variant_value: 'Gateron Red (Linear)', sku: 'KC-K2-RED', price: 95.00, stock: 30, status: 'ACTIVE' },
      { product_id: keychronK2.id, variant_name: 'Switch Type', variant_value: 'Gateron Blue (Clicky)', sku: 'KC-K2-BLU', price: 95.00, stock: 20, status: 'ACTIVE' }
    ]);

    // -- Product 9: Eames Lounge Chair (Furniture)
    const loungeChair = await Product.create({
      category_id: furnitureId,
      name: 'Eames Lounge Chair',
      slug: 'eames-lounge-chair',
      short_description: 'Mid-century modern master lounge chair.',
      description: 'Handcrafted luxury seat with premium leather upholstery.',
      brand: 'HERMAN MILLER',
      sku: 'EAMES-LC',
      thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: loungeChair.id, image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', sort_order: 1 }, // Walnut Wood / Black Leather
      { product_id: loungeChair.id, image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500', sort_order: 2 }  // Palisander Wood / White Leather
    ]);

    await ProductVariant.bulkCreate([
      { product_id: loungeChair.id, variant_name: 'Wood Finish', variant_value: 'Walnut / Black Leather', sku: 'EM-LC-WAL', price: 1800.00, stock: 5, status: 'ACTIVE' },
      { product_id: loungeChair.id, variant_name: 'Wood Finish', variant_value: 'Palisander / White Leather', sku: 'EM-LC-PAL', price: 1950.00, stock: 3, status: 'ACTIVE' }
    ]);

    // -- Product 10: Minimalist Oak Desk (Furniture)
    const oakDesk = await Product.create({
      category_id: furnitureId,
      name: 'Minimalist Oak Desk',
      slug: 'minimalist-oak-desk',
      short_description: 'Sturdy solid oak home-office desk.',
      description: 'Spacious workspace surface, built-in wire organizers, and sleek modern metal legs.',
      brand: 'WOODENART',
      sku: 'OAK-DESK',
      thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: oakDesk.id, image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: oakDesk.id, variant_name: 'Size', variant_value: '120cm Width', sku: 'DK-OAK-120', price: 299.00, stock: 12, status: 'ACTIVE' },
      { product_id: oakDesk.id, variant_name: 'Size', variant_value: '150cm Width', sku: 'DK-OAK-150', price: 349.00, stock: 8, status: 'ACTIVE' }
    ]);

    // -- Product 11: Velvet Armchair (Furniture)
    const velvetChair = await Product.create({
      category_id: furnitureId,
      name: 'Luxury Velvet Armchair',
      slug: 'luxury-velvet-armchair',
      short_description: 'Emerald green statement accent chair.',
      description: 'Elegant accent chair styled with premium soft velvet fabrics.',
      brand: 'SOFASTYLE',
      sku: 'VELVET-AC',
      thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: velvetChair.id, image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500', sort_order: 1 }, // Emerald Green
      { product_id: velvetChair.id, image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', sort_order: 2 }, // Midnight Blue
      { product_id: velvetChair.id, image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500', sort_order: 3 }  // Charcoal Grey
    ]);

    await ProductVariant.bulkCreate([
      { product_id: velvetChair.id, variant_name: 'Colour', variant_value: 'Emerald Green', sku: 'CH-VL-GRN', price: 220.00, stock: 15, status: 'ACTIVE' },
      { product_id: velvetChair.id, variant_name: 'Colour', variant_value: 'Midnight Blue', sku: 'CH-VL-BLU', price: 220.00, stock: 10, status: 'ACTIVE' },
      { product_id: velvetChair.id, variant_name: 'Colour', variant_value: 'Charcoal Grey', sku: 'CH-VL-GRY', price: 210.00, stock: 18, status: 'ACTIVE' }
    ]);

    // -- Product 12: Ergonomic Office Chair (Furniture)
    const officeChair = await Product.create({
      category_id: furnitureId,
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      short_description: 'Breathable mesh chair for long work hours.',
      description: 'Adjustable lumber support and high density seat cushion.',
      brand: 'STEELCASE',
      sku: 'ERGO-CHAIR',
      thumbnail: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: officeChair.id, image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500', sort_order: 1 }, // Grey Frame
      { product_id: officeChair.id, image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', sort_order: 2 }  // Black Frame
    ]);

    await ProductVariant.bulkCreate([
      { product_id: officeChair.id, variant_name: 'Frame Color', variant_value: 'Starlight Grey Frame', sku: 'CH-ER-SLV', price: 285.00, stock: 20, status: 'ACTIVE' },
      { product_id: officeChair.id, variant_name: 'Frame Color', variant_value: 'Classic Black Frame', sku: 'CH-ER-BLK', price: 260.00, stock: 35, status: 'ACTIVE' }
    ]);

    // -- Product 13: Organic Arabica Coffee Beans (Groceries)
    const coffeeBeans = await Product.create({
      category_id: groceriesId,
      name: 'Organic Arabica Coffee Beans',
      slug: 'organic-coffee-beans',
      short_description: 'Medium roast single-origin beans.',
      description: 'Slow roasted 100% Arabica beans displaying notes of chocolate.',
      brand: 'KAPHI',
      sku: 'CF-BEANS',
      thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: coffeeBeans.id, image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: coffeeBeans.id, variant_name: 'Pack Size', variant_value: '250g Pack', sku: 'CF-BN-250', price: 12.00, stock: 100, status: 'ACTIVE' },
      { product_id: coffeeBeans.id, variant_name: 'Pack Size', variant_value: '500g Pack', sku: 'CF-BN-500', price: 22.00, stock: 80, status: 'ACTIVE' },
      { product_id: coffeeBeans.id, variant_name: 'Pack Size', variant_value: '1kg Bulk Pack', sku: 'CF-BN-1KG', price: 39.00, stock: 50, status: 'ACTIVE' }
    ]);

    // -- Product 14: Pure Himalayan Pink Salt (Groceries)
    const pinkSalt = await Product.create({
      category_id: groceriesId,
      name: 'Himalayan Pink Salt',
      slug: 'himalayan-pink-salt',
      short_description: 'Natural mineral rich coarse pink cooking salt.',
      description: 'Organic unrefined kitchen salt mined directly from the foothills of the Himalayas.',
      brand: 'NATURALS',
      sku: 'SALT-PINK',
      thumbnail: 'https://images.unsplash.com/photo-1614749514757-793574929a00?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: pinkSalt.id, image_url: 'https://images.unsplash.com/photo-1614749514757-793574929a00?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: pinkSalt.id, variant_name: 'Pack Size', variant_value: '500g Pouch', sku: 'ST-PK-500', price: 4.50, stock: 150, status: 'ACTIVE' },
      { product_id: pinkSalt.id, variant_name: 'Pack Size', variant_value: '1kg Container', sku: 'ST-PK-1KG', price: 7.90, stock: 100, status: 'ACTIVE' }
    ]);

    // -- Product 15: Premium Extra Virgin Olive Oil (Groceries)
    const oliveOil = await Product.create({
      category_id: groceriesId,
      name: 'Extra Virgin Olive Oil',
      slug: 'extra-virgin-olive-oil',
      short_description: 'Cold pressed organic cooking oil.',
      description: 'Rich in antioxidants, cold pressed olives, perfect for healthy cooking.',
      brand: 'BORGES',
      sku: 'OIL-OLIVE',
      thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
      status: 'ACTIVE',
      is_featured: true
    });

    await ProductImage.bulkCreate([
      { product_id: oliveOil.id, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: oliveOil.id, variant_name: 'Volume', variant_value: '500ml Bottle', sku: 'OL-OIL-500', price: 14.00, stock: 70, status: 'ACTIVE' },
      { product_id: oliveOil.id, variant_name: 'Volume', variant_value: '1 Litre Can', sku: 'OL-OIL-1L', price: 25.00, stock: 60, status: 'ACTIVE' }
    ]);

    // -- Product 16: Raw Organic Honey (Groceries)
    const rawHoney = await Product.create({
      category_id: groceriesId,
      name: 'Raw Organic Honey',
      slug: 'raw-organic-honey',
      short_description: '100% Pure wildflower natural honey.',
      description: 'Unpasteurized and unfiltered raw honey harvested directly from forest beehives.',
      brand: 'BEEWELL',
      sku: 'HONEY-RAW',
      thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
      status: 'ACTIVE',
      is_featured: false
    });

    await ProductImage.bulkCreate([
      { product_id: rawHoney.id, image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', sort_order: 1 }
    ]);

    await ProductVariant.bulkCreate([
      { product_id: rawHoney.id, variant_name: 'Weight', variant_value: '250g Jar', sku: 'HN-RW-250', price: 8.50, stock: 90, status: 'ACTIVE' },
      { product_id: rawHoney.id, variant_name: 'Weight', variant_value: '500g Jar', sku: 'HN-RW-500', price: 15.00, stock: 75, status: 'ACTIVE' }
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

    console.log('✅ Seeding complete! Database is populated with 16 products.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

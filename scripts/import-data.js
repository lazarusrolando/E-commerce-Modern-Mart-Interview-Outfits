const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function importData() {
  try {
    await db.connect();

    // Read data from data.json
    const dataPath = path.join(__dirname, '../../data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`📊 Importing ${data.length} products...`);

    // Insert categories first
    const categories = [
      { name: 'Men - Shirts', description: 'Professional shirts for men' },
      { name: 'Men - Pants', description: 'Professional pants for men' },
      { name: 'Men - Shoes', description: 'Professional shoes for men' },
      { name: 'Women - Shirts', description: 'Professional shirts for women' },
      { name: 'Women - Pants', description: 'Professional pants for women' },
      { name: 'Women - Shoes', description: 'Professional shoes for women' },
      { name: 'Accessories - Ties', description: 'Professional ties' },
      { name: 'Accessories - Watches', description: 'Professional watches' },
      { name: 'Accessories - Bags', description: 'Professional bags' },
      { name: 'Accessories - Socks', description: 'Professional socks' }
    ];

    for (const category of categories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
    }

    // Get category IDs
    const categoryRows = await db.all('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(row => categoryMap[row.name] = row.id);

    // Insert brands
    const brands = [
      { name: 'Professional Elite', description: 'Premium professional wear' },
      { name: 'Corporate Classic', description: 'Classic corporate attire' },
      { name: 'Executive Style', description: 'Executive-level professional wear' },
      { name: 'Interview Ready', description: 'Specialized interview outfits' }
    ];

    for (const brand of brands) {
      await db.run(
        'INSERT OR IGNORE INTO brands (name, description) VALUES (?, ?)',
        [brand.name, brand.description]
      );
    }

    // Get brand IDs
    const brandRows = await db.all('SELECT id, name FROM brands');
    const brandMap = {};
    brandRows.forEach(row => brandMap[row.name] = row.id);

    // Process each product from data.json
    for (const item of data) {
      // Determine category based on image path
      let categoryName = 'Accessories - Bags'; // default
      if (item.images.includes('men-shirts')) categoryName = 'Men - Shirts';
      else if (item.images.includes('men-pants')) categoryName = 'Men - Pants';
      else if (item.images.includes('men-shoes')) categoryName = 'Men - Shoes';
      else if (item.images.includes('women-shirts')) categoryName = 'Women - Shirts';
      else if (item.images.includes('women-pants')) categoryName = 'Women - Pants';
      else if (item.images.includes('women-shoes')) categoryName = 'Women - Shoes';
      else if (item.images.includes('ties')) categoryName = 'Accessories - Ties';
      else if (item.images.includes('watches')) categoryName = 'Accessories - Watches';
      else if (item.images.includes('bags')) categoryName = 'Accessories - Bags';
      else if (item.images.includes('socks')) categoryName = 'Accessories - Socks';

      const categoryId = categoryMap[categoryName] || 1; // fallback to first category
      const brandId = brandMap['Professional Elite'] || 1; // default brand

      // Generate slug from product name
      const slug = item.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // replace multiple hyphens with single
        .trim();

      // Insert product
      await db.run(
        `INSERT OR REPLACE INTO products
         (id, name, description, price, stock_quantity, category_id, brand_id, slug)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.name, // using name as description for now
          item.price,
          50, // default stock
          categoryId,
          brandId,
          slug
        ]
      );

      // Insert product image
      const imageUrl = item.images.replace('/database/images/', '');
      await db.run(
        `INSERT OR REPLACE INTO product_images
         (product_id, image_url)
         VALUES (?, ?)`,
        [item.id, imageUrl]
      );
    }

    console.log('✅ Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();

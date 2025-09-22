const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDB() {
  try {
    await db.connect();

    // Insert sample categories based on user feedback
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

    // Insert sample brands
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

    // Get category and brand IDs
    const categoryMap = {};
    const brandMap = {};

    const categoryRows = await db.all('SELECT id, name FROM categories');
    const brandRows = await db.all('SELECT id, name FROM brands');

    categoryRows.forEach(row => categoryMap[row.name] = row.id);
    brandRows.forEach(row => brandMap[row.name] = row.id);

    // Insert sample products
    const products = [
      {
        name: 'Classic White Dress Shirt',
        description: 'Premium white dress shirt for professional interviews',
        price: 89.99,
        stock_quantity: 25,
        category_id: categoryMap['Men - Shirts'],
        brand_id: brandMap['Professional Elite'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Professional Navy Dress Shirt',
        description: 'Elegant navy dress shirt for formal interviews',
        price: 79.99,
        stock_quantity: 20,
        category_id: categoryMap['Men - Shirts'],
        brand_id: brandMap['Corporate Classic'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Women\'s Professional Blouse',
        description: 'Professional women\'s blouse with modern fit',
        price: 69.99,
        stock_quantity: 30,
        category_id: categoryMap['Women - Shirts'],
        brand_id: brandMap['Executive Style'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Classic Dress Pants - Black',
        description: 'Classic black dress pants for professional wear',
        price: 129.99,
        stock_quantity: 50,
        category_id: categoryMap['Men - Pants'],
        brand_id: brandMap['Interview Ready'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Women\'s Professional Trousers',
        description: 'Elegant professional trousers for women',
        price: 119.99,
        stock_quantity: 40,
        category_id: categoryMap['Women - Pants'],
        brand_id: brandMap['Corporate Classic'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Leather Dress Shoes - Brown',
        description: 'Professional brown leather dress shoes',
        price: 199.99,
        stock_quantity: 35,
        category_id: categoryMap['Men - Shoes'],
        brand_id: brandMap['Professional Elite'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Women\'s Professional Heels',
        description: 'Professional heels suitable for interviews',
        price: 159.99,
        stock_quantity: 28,
        category_id: categoryMap['Women - Shoes'],
        brand_id: brandMap['Executive Style'],
        size_chart: 'xs,s,m,l,xl,xxl'
      },
      {
        name: 'Silk Professional Tie Set',
        description: 'Set of professional silk ties for interviews',
        price: 49.99,
        stock_quantity: 60,
        category_id: categoryMap['Accessories - Ties'],
        brand_id: brandMap['Interview Ready'],
        size_chart: ''
      },
      {
        name: 'Professional Leather Watch',
        description: 'Elegant leather watch for professional settings',
        price: 299.99,
        stock_quantity: 15,
        category_id: categoryMap['Accessories - Watches'],
        brand_id: brandMap['Professional Elite'],
        size_chart: ''
      },
      {
        name: 'Executive Leather Briefcase',
        description: 'Professional leather briefcase for documents',
        price: 249.99,
        stock_quantity: 20,
        category_id: categoryMap['Accessories - Bags'],
        brand_id: brandMap['Corporate Classic'],
        size_chart: ''
      },
      {
        name: 'Professional Dress Socks Pack',
        description: 'Pack of professional dress socks',
        price: 24.99,
        stock_quantity: 100,
        category_id: categoryMap['Accessories - Socks'],
        brand_id: brandMap['Interview Ready'],
        size_chart: 'xs,s,m,l,xl,xxl'
      }
    ];

    for (const product of products) {
      await db.run(
        `INSERT OR IGNORE INTO products
         (name, description, price, stock_quantity, category_id, brand_id, size_chart)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product.name, product.description, product.price, product.stock_quantity,
         product.category_id, product.brand_id, product.size_chart]
      );
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await db.run(
      `INSERT OR IGNORE INTO users 
       (email, password, first_name, last_name, phone, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['test@example.com', hashedPassword, 'Test', 'User', '+1234567890', true]
    );

    console.log('✅ Database seeded successfully');
    console.log('📧 Test user: test@example.com');
    console.log('🔑 Test password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();

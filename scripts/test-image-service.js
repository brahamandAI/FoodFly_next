// Using built-in fetch (available in Node.js 18+)
require('dotenv').config();

async function testImageService() {
  console.log('🧪 Testing Image Processing Service...\n');

  try {
    // Test 1: Test the API endpoint
    console.log('1️⃣ Testing API endpoint...');
    
    const testData = {
      menuItems: [
        {
          _id: 'test_001',
          name: 'Butter Chicken',
          category: 'Main Course'
        }
      ],
      mode: 'single'
    };

    const response = await fetch('http://localhost:3003/api/admin/process-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token_123'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API test successful!');
      console.log('   Response:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ API test failed:');
      console.log('   Status:', response.status);
      console.log('   Error:', error);
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Check environment variables
console.log('🔍 Environment Check:');
console.log(`   CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not set'}`);
console.log(`   CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`   CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`   UNSPLASH_ACCESS_KEY: ${process.env.UNSPLASH_ACCESS_KEY ? '✅ Set' : '❌ Not set'}`);
console.log();

if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.error('❌ UNSPLASH_ACCESS_KEY is required for testing');
  process.exit(1);
}

// Run tests
testImageService();

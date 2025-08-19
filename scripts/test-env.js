require('dotenv').config();

console.log('🔍 Testing Environment Variables...\n');

const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET',
  'UNSPLASH_ACCESS_KEY'
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allSet = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allSet) {
  console.log('🎉 All environment variables are set!');
  console.log('You can now test the image processing system.');
} else {
  console.log('⚠️  Some environment variables are missing.');
  console.log('Please check your .env file and ensure all required variables are set.');
}

console.log('\n📝 Next steps:');
console.log('1. Run: node scripts/test-image-service.js');
console.log('2. Go to: http://localhost:3003/admin/images');
console.log('3. Test the image processing functionality');

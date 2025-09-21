#!/usr/bin/env node

/**
 * Development setup script for BuildInPublic Mini App
 *
 * This script helps developers set up their local development environment
 * by creating necessary configuration files and providing setup instructions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🚀 BuildInPublic Mini App - Development Setup');
console.log('==============================================\n');

// Check if .env.local already exists
const envLocalPath = path.join(projectRoot, '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local file already exists');
} else {
  // Create .env.local file
  const envContent = `# BuildInPublic Mini App - Local Development Configuration

# API Configuration
# Set this to your actual API endpoint URL
NEXT_PUBLIC_API_URL=https://api.buildinpublic.xyz

# Optional: Override the default API endpoint
# NEXT_PUBLIC_API_URL=https://your-custom-api.com

# Note: The app will fall back to https://api.buildinpublic.xyz if this is not set
`;

  try {
    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ Created .env.local file');
  } catch (error) {
    console.error('❌ Failed to create .env.local file:', error.message);
  }
}

// Check if development components are available
const devAppPath = path.join(projectRoot, 'src', 'components', 'App.dev.tsx');
if (fs.existsSync(devAppPath)) {
  console.log('✅ Development components are available');
} else {
  console.log('⚠️  Development components not found');
}

console.log('\n📋 Next Steps:');
console.log('1. Edit .env.local and set your API endpoint URL');
console.log('2. Run "npm run dev" to start the development server');
console.log(
  '3. Use the "Dev Mode" button in the app to test different profiles'
);
console.log('4. Test both Builder and Yapper UI styles');

console.log('\n🔧 Development Features:');
console.log('- Dev Mode toggle for testing without API calls');
console.log('- Sample Builder and Yapper profiles');
console.log('- Easy switching between test roles');
console.log('- Loading and error state testing');

console.log('\n📚 Documentation:');
console.log('- Check SETUP.md for detailed configuration instructions');
console.log('- Review src/lib/config.ts for customization options');
console.log('- See src/lib/types.ts for API response format');

console.log('\n🎯 Testing Your API:');
console.log('1. Ensure your API endpoint returns data in the expected format');
console.log('2. Test with the sample data provided in TestProfile.tsx');
console.log('3. Verify both Builder and Yapper roles render correctly');
console.log('4. Test loading states and error handling');

console.log('\n✨ Happy Building!');


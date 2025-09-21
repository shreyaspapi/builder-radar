# BuildInPublic Mini App Setup Guide

## Overview

BuildInPublic is a Farcaster Mini App that helps users discover whether they are a "Builder" or "Yapper" in the Farcaster ecosystem. The app dynamically renders different UI styles based on the user's role while maintaining a consistent layout.

## Features

- **Dynamic UI Styling**: Vibrant and tacky UI for Yappers, minimal and aesthetic UI for Builders
- **Consistent Layout**: Same structure regardless of user role
- **Real-time Profile Generation**: Fetches user data from configurable API endpoint
- **Loading States**: Engaging loading experience with rotating messages and tech facts
- **Error Handling**: Comprehensive error handling with retry functionality
- **Responsive Design**: Works on both mobile and web platforms

## Configuration

### API Endpoint Configuration

The app fetches user profile data from a configurable API endpoint. To configure this:

1. **Create a `.env.local` file** in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

2. **Update the configuration** in `src/lib/config.ts` if needed:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.buildinpublic.xyz',
  PROFILE_ENDPOINT: '/api/profile',
  // ... other config
};
```

### API Endpoints

The app uses two API endpoints with automatic fallback:

1. **Primary Endpoint (GET)**: `https://getuserdata-gj2nphvrna-uc.a.run.app?fid={fid}`
2. **Fallback Endpoint (POST)**: `https://processuser-gj2nphvrna-uc.a.run.app` with JSON body `{"fid": "2"}`

### API Response Format

Both endpoints should return data in this format:

```json
{
  "success": true,
  "message": "Builder profile generated successfully! :rocket:",
  "data": {
    "Role": "Builder", // or "Yapper"
    "Name": "vitalik.eth",
    "JoinDate": "2021-01-15T10:30:00.000Z",
    "Summary": "The OG Ethereum chad who's still shipping while others are just vibing",
    "Description": "This absolute unit has been building the future since before most people knew what a blockchain was.",
    "NumberOfCasts": 1337,
    "Engagement": 42069,
    "MVPCasts": [
      { "Cast1": "Just shipped another protocol update :fire:" },
      { "Cast2": "Building in public hits different" },
      { "Cast3": "Ethereum is for everyone" }
    ],
    "BuilderLevel": "Legendary Builder",
    "Vibe": "Big Brain Vibes",
    "SuperPower": "Protocol Whisperer",
    "BuildStreak": 69,
    "CommunityImpact": "Thought Leader",
    "EmojiFlair": ":brain::zap:",
    "BuilderArchetype": "The Visionary",
    "FavoriteTopics": ["Ethereum", "Scaling", "DeFi", "Public Goods"],
    "BuildingMood": "Ship Mode"
  }
}
```

## Installation & Development

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env.local
# Edit .env.local with your API endpoint
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Build for production**:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx          # Main page with metadata
│   └── app.tsx           # App wrapper
├── components/            # React components
│   ├── App.tsx           # Main app component
│   └── ui/               # UI components
│       ├── LoadingProfile.tsx    # Loading state
│       ├── ErrorDisplay.tsx      # Error handling
│       ├── UserProfile.tsx       # Profile display
│       └── SimpleNavigation.tsx  # Bottom navigation
├── hooks/                 # Custom React hooks
│   └── useUserProfile.ts  # Profile data management
└── lib/                   # Utility libraries
    ├── api.ts            # API service functions
    ├── config.ts         # Configuration constants
    └── types.ts          # TypeScript type definitions
```

## Customization

### UI Styling

The app uses Tailwind CSS for styling. To customize the appearance:

- **Builder Theme**: Pink/red color scheme (`pink-600`, `pink-500`, etc.)
- **Yapper Theme**: Green color scheme (`green-600`, `green-500`, etc.)
- **Layout**: Consistent structure defined in `UserProfile.tsx`

### Loading Messages & Tech Facts

Customize the loading experience in `src/lib/config.ts`:

```typescript
export const UI_CONFIG = {
  LOADING_MESSAGES: [
    'We are building your profile...',
    'Analyzing your Farcaster activity...',
    // Add your custom messages
  ],
  TECH_FACTS: [
    'The first computer bug was an actual bug...',
    // Add your custom tech facts
  ],
};
```

### API Configuration

Modify API behavior in `src/lib/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com',
  PROFILE_ENDPOINT: '/custom/endpoint',
  API_TIMEOUT: 15000, // 15 seconds
  MAX_RETRIES: 5, // 5 retry attempts
};
```

## Farcaster Mini App Integration

This app is designed as a Farcaster Mini App and includes:

- **SDK Integration**: Uses `@farcaster/miniapp-sdk`
- **Splash Screen Management**: Automatically hides splash screen when ready
- **Environment Detection**: Detects Mini App vs regular web environment
- **Metadata**: Proper `fc:miniapp` and `fc:frame` meta tags for sharing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **API Endpoint Not Working**:

   - Check your `.env.local` file
   - Verify the API endpoint is accessible
   - Check browser console for CORS errors

2. **Profile Not Loading**:

   - Ensure the API returns data in the correct format
   - Check network tab for failed requests
   - Verify the user has a valid FID

3. **Mini App Not Working**:
   - Ensure you're using the Farcaster Mini App SDK
   - Check that `sdk.actions.ready()` is called
   - Verify metadata is properly configured

### Debug Mode

Enable debug logging by adding to your browser console:

```javascript
localStorage.setItem('debug', 'buildinpublic:*');
```

## Support

For issues or questions:

1. Check the browser console for error messages
2. Verify your API endpoint configuration
3. Ensure all dependencies are properly installed
4. Check the Farcaster Mini App documentation

## License

This project is open source and available under the MIT License.

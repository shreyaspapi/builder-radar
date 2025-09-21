# BuildInPublic - Farcaster Mini App

A Farcaster Mini App that helps users discover whether they are a "Builder" or "Yapper" in the Farcaster ecosystem. The app dynamically renders different UI styles based on the user's role while maintaining a consistent layout.

## 🎨 Features

- **Dynamic UI Styling**:
  - **Yappers**: Vibrant and tacky green UI theme
  - **Builders**: Minimal and aesthetic pink/red UI theme
- **Consistent Layout**: Same structure regardless of user role
- **Real-time Profile Generation**: Fetches user data from configurable API endpoint
- **Engaging Loading States**: Rotating messages and interesting tech facts
- **Comprehensive Error Handling**: Retry functionality and user-friendly error messages
- **Responsive Design**: Works seamlessly on both mobile and web platforms
- **Farcaster Integration**: Built as a proper Mini App with SDK integration

## 🚀 Quick Start

### 1. Setup Development Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd buildinpublic

# Install dependencies
npm install

# Run setup script
npm run setup

# Start development server
npm run dev
```

### 2. Configure API Endpoint (Optional)

The app comes pre-configured with working API endpoints:

- **Primary**: `https://getuserdata-gj2nphvrna-uc.a.run.app`
- **Fallback**: `https://processuser-gj2nphvrna-uc.a.run.app`

To use your own endpoint, create a `.env.local` file:

```bash
# API Configuration (optional - defaults to working endpoints)
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

### 3. Test the App

- Use the "Dev Mode" button to test different profiles without API calls
- Switch between Builder and Yapper roles to see different UI styles
- Test loading states and error handling

## 🏗️ Architecture

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx          # Main page with Mini App metadata
│   └── app.tsx           # App wrapper
├── components/            # React components
│   ├── App.tsx           # Production app component
│   ├── App.dev.tsx       # Development app with test profiles
│   └── ui/               # UI components
│       ├── LoadingProfile.tsx    # Loading state with rotating messages
│       ├── ErrorDisplay.tsx      # Error handling with retry
│       ├── UserProfile.tsx       # Dynamic profile display
│       └── SimpleNavigation.tsx  # Bottom navigation
├── hooks/                 # Custom React hooks
│   └── useUserProfile.ts  # Profile data management
└── lib/                   # Utility libraries
    ├── api.ts            # API service functions
    ├── config.ts         # Configuration constants
    └── types.ts          # TypeScript type definitions
```

## 🔧 Configuration

### API Response Format

Your API endpoint should return data in this format:

```json
{
  "success": true,
  "message": "Builder profile generated successfully! :rocket:",
  "data": {
    "Role": "Builder", // or "Yapper"
    "Name": "vitalik.eth",
    "JoinDate": "2021-01-15T10:30:00.000Z",
    "Summary": "The OG Ethereum chad who's still shipping...",
    "Description": "This absolute unit has been building the future...",
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

### Customization Options

- **UI Styling**: Modify color schemes in `UserProfile.tsx`
- **Loading Messages**: Customize in `src/lib/config.ts`
- **API Behavior**: Configure timeouts and retries in `src/lib/config.ts`

## 🎯 Development

### Development Mode

The app includes a development mode that allows you to:

- Test different profiles without API calls
- Switch between Builder and Yapper roles
- Test loading and error states
- Develop and debug UI components

### Testing

```bash
# Run setup script
npm run setup

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Farcaster Mini App Integration

This app is designed as a Farcaster Mini App and includes:

- **SDK Integration**: Uses `@farcaster/miniapp-sdk`
- **Splash Screen Management**: Automatically hides splash screen when ready
- **Environment Detection**: Detects Mini App vs regular web environment
- **Metadata**: Proper `fc:miniapp` and `fc:frame` meta tags for sharing

## 📱 Deployment

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

## 🐛 Troubleshooting

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

## 📚 Documentation

- **Setup Guide**: See `SETUP.md` for detailed configuration instructions
- **API Reference**: Check `src/lib/api.ts` for API service functions
- **Type Definitions**: Review `src/lib/types.ts` for data structures
- **Configuration**: See `src/lib/config.ts` for customization options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:

1. Check the browser console for error messages
2. Verify your API endpoint configuration
3. Ensure all dependencies are properly installed
4. Check the Farcaster Mini App documentation
5. Review the troubleshooting section above

---

**Built with ❤️ for the Farcaster ecosystem**

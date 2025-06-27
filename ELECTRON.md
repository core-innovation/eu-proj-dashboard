# Electron Desktop App Setup

This document provides instructions for running and building the EU Projects Dashboard as a desktop application using Electron.

## Prerequisites

- Node.js (v18 or higher)
- npm
- macOS (for building macOS applications)

## Development

### Running in Development Mode

To run the application in development mode with hot-reload:

```bash
npm run electron-dev
```

This command will:
1. Start the Vite development server
2. Wait for the server to be ready
3. Launch the Electron application
4. Open DevTools automatically

### Building for Production

To build the application for macOS:

```bash
npm run electron-build-mac
```

This creates:
- `build/mac/EU Projects.app` - Intel (x64) version
- `build/mac-arm64/EU Projects.app` - Apple Silicon (arm64) version
- ZIP files for distribution

## File Structure

```
electron/
├── main.cjs          # Main Electron process
└── preload.cjs       # Preload script (for future use)
```

## Configuration

The Electron configuration is defined in `package.json` under the `build` field:

- **App ID**: `com.yourcompany.eu-proj`
- **Product Name**: `EU Projects`
- **Categories**: Productivity
- **Targets**: DMG and ZIP for macOS
- **Architectures**: x64 and arm64

## Security

The application follows Electron security best practices:
- Context isolation enabled
- Node integration disabled
- External links open in default browser
- Navigation restricted to localhost in development

## Troubleshooting

### Common Issues

1. **Port conflicts**: If Vite runs on a different port, update the `electron-dev` script in package.json
2. **Build failures**: Ensure all dependencies are installed with `npm ci`
3. **macOS permissions**: You may need to allow the app in System Preferences > Security & Privacy

### Development vs Production

- **Development**: Loads from `http://localhost:5173`
- **Production**: Loads from `dist/index.html`

## Distribution

The built applications can be distributed as:
- Direct `.app` bundles (requires users to handle Gatekeeper)
- ZIP files (recommended for easy distribution)
- DMG files (requires proper icon setup)

For production distribution, consider:
- Code signing for macOS
- Notarization for macOS
- Custom app icons
- Auto-updater integration

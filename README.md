# Forum - Worldcoin Mini App

A human-verified community platform designed as a Worldcoin mini app that runs within Worldcoin's World App.

## 🌍 Overview

Forum is the world's first human-verified forum platform for authentic community discussions. Built to operate as a Worldcoin mini app, it provides a native mobile experience within the World App ecosystem.

### ✨ Key Features

- **Human Verification**: All users are verified through Worldcoin's World ID
- **Community Forums**: Organized discussion channels for various topics
- **Real-time Chat**: Live messaging within community channels
- **Mobile-First Design**: Optimized for mobile devices and mini app environment
- **Modern UI**: Clean, accessible interface using Radix UI components

### 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: Radix UI with Tailwind CSS
- **State Management**: React hooks
- **Theme Support**: Dark/light mode with next-themes
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd worldcoinforum-development

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 📱 App Structure

### Screens
- **Splash Screen**: Animated app introduction
- **Login Screen**: Wallet-based authentication
- **Communities**: Browse available communities
- **Community Detail**: View community info and rules
- **Chat**: Real-time messaging
- **Discover**: Find new communities
- **Profile**: User profile and settings

### Navigation
- Bottom tab navigation with 5 main sections
- Screen transitions and back navigation
- Mobile-optimized touch interactions

## 🎨 Customization

The app is designed to be easily customizable for different branding and features:

### Theme Configuration
- Modify `app/globals.css` for custom CSS variables
- Update color schemes in `tailwind.config.js`
- Configure theme switching behavior

### Content Management
- Community data in `lib/data.ts`
- App configuration in `lib/constants.ts`
- User interface text throughout components

### Branding
- Logo and icons in component files
- App metadata in `app/layout.tsx`
- Splash screen animations in `components/splash-screen.tsx`

## 🔧 Mini App Integration

This app is designed to integrate with Worldcoin's World App as a mini app:

### Requirements Met
- Mobile-first responsive design
- Native app-like user experience
- Optimized performance and loading
- Proper navigation patterns
- Accessibility considerations

### Future Integration Steps
1. World ID integration for authentication
2. World App SDK implementation
3. Mini app manifest configuration
4. Testing within World App environment
5. Deployment to World App ecosystem

## 📦 Dependencies

### Core
- **Next.js**: React framework
- **React**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **next-themes**: Theme management

### Development
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **TypeScript**: Type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

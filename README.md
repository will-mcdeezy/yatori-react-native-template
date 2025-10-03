# Yatori Solana dApp Template 🚀

A powerful React Native template for building Solana dApps with Yatori integration. This template provides everything you need to get started with Solana blockchain development, including wallet connections, token transfers, and Yatori API integration.

## Features

- 🔗 **Wallet Integration**: Connect to Solflare and Backpack wallets
- 💰 **Token Support**: Built-in support for USDC, USDT, and BONK tokens
- 🌐 **Yatori API**: Seamless integration with Yatori's data services
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light mode support
- ⚡ **Fast Development**: Built with Expo Router for rapid development

## Quick Start

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the development server

   ```bash
   bun dev
   ```

3. Open your app in:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal  
   - **Web Browser**: Press `w` in the terminal

## Solana Integration

This template includes pre-configured components for:

- **Wallet Connection**: Connect users with Solflare or Backpack
- **Token Operations**: Send/receive USDC, USDT, and BONK tokens
- **Transaction Handling**: Built-in transaction management and error handling
- **Yatori API**: Access to Yatori's comprehensive Solana data services

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home screen with wallet connection
│   └── explore.tsx        # Token operations and features
├── _layout.tsx            # Root layout
└── modal.tsx              # Transaction details modal

components/
├── wallet/                # Wallet connection components
├── tokens/                # Token operation components
└── ui/                   # Reusable UI components
```

## Development

### Adding New Tokens

To add support for additional tokens, update the token configuration in `constants/tokens.ts`.

### Customizing Wallet Providers

Modify wallet connection logic in `components/wallet/` to add support for additional wallet providers.

### Yatori API Integration

Configure your Yatori API endpoints in `services/yatori.ts` and update the API calls as needed.

## Learn More

- [Solana Documentation](https://docs.solana.com/): Learn about Solana blockchain development
- [Yatori API Docs](https://docs.yatori.com/): Explore Yatori's data services
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing for React Native

## Support

- [Yatori Discord](https://discord.gg/yatori): Join our developer community
- [GitHub Issues](https://github.com/yatori/templates/issues): Report bugs and request features

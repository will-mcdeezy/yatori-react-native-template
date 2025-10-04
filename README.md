# Yatori Solana dApp Template 🚀

A powerful React Native template for building Solana dApps with Yatori integration. This template provides everything you need to get started with Solana blockchain development, including wallet connections, token transfers, and Yatori API integration.

## Features

- 🔗 **Wallet Integration**: Connect to Backpack mobile wallet with encryption
- 💰 **Token Support**: Built-in support for USDC, PYUSD, USDT transfers (BONK, CROWN, SOL coming soon)
- 🌐 **Yatori API**: Seamless integration with Yatori's Arrow API for transaction data
- 📋 **Token Reference**: Complete mint address reference with copy functionality
- 📱 **Cross-Platform**: Works on iOS, Android
- ⚡ **Fast Development**: Built with Expo Router for rapid development

## Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm start
   ```

3. Open your app in:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal  
   - **Web Browser**: Press `w` in the terminal

## Solana Integration

This template includes pre-configured components for:

- **Wallet Connection**: Connect users with Backpack wallet using encryption
- **Token Operations**: Send USDC, PYUSD, and USDT tokens (1 cent transfers)
- **Transaction Handling**: Built-in transaction management with Backpack signing
- **Yatori API**: Access to Yatori's Arrow API for raw transaction data
- **Token Reference**: Complete mint address library with copy functionality

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home screen with wallet connection and token transfers
│   └── explore.tsx        # Token mint addresses reference
├── _layout.tsx            # Root layout
├── onConnectBackpack.tsx  # Backpack wallet connection screen
└── modal.tsx              # Transaction details modal

hooks/
└── useBackpackConnection.ts # Backpack wallet connection hook
```

## Development

### Adding New Tokens

To add support for additional tokens, update the token configuration in `app/(tabs)/index.tsx` and `app/(tabs)/explore.tsx`.

### Customizing Wallet Providers

Modify wallet connection logic in `hooks/useBackpackConnection.ts` and `app/onConnectBackpack.tsx` to add support for additional wallet providers.

### Yatori API Integration

The Arrow API integration is configured in `app/(tabs)/index.tsx` for token transfer functionality.

## Learn More

- [Solana Documentation](https://docs.solana.com/): Learn about Solana blockchain development
- [Yatori API Docs](https://docs.yatori.com/): Explore Yatori's data services
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing for React Native

## Support

- [Yatori Website](https://yatori.io): Visit our official website
- [Twitter](https://twitter.com/Yatori_io): Follow us on Twitter
- [GitHub Issues](https://github.com/yatori/templates/issues): Report bugs and request features

# Wallet Integration Guide

This template includes Backpack wallet integration for Solana dApps. Here's how to use and extend it.

## Features

- ✅ **Backpack Wallet Connection**: Connect to Backpack wallet with deep linking
- ✅ **Secure Storage**: Wallet data stored securely using AsyncStorage
- ✅ **Deep Link Handling**: Automatic handling of wallet connection responses
- ✅ **Connection State Management**: Real-time connection status and error handling

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Deep Links

The app is already configured with the scheme `yatori-solana-dapp://` in `app.json`. Make sure your associated domain is set up correctly for Backpack integration.

### 3. Use the Wallet Connection

The wallet connection is already integrated into the home screen. Users can:

1. **Connect**: Tap "Connect Backpack" to open the Backpack app
2. **View Status**: See connection status and public key
3. **Disconnect**: Tap "Disconnect" to clear wallet data

## Code Structure

### Core Files

- `hooks/useBackpackConnection.ts` - Main wallet connection hook
- `utils/secureStorage.ts` - Secure storage for wallet data
- `utils/deepLinkHandler.ts` - Deep link handling for wallet responses
- `app/(tabs)/index.tsx` - UI integration

### Key Components

#### useBackpackConnection Hook

```typescript
const {
  isConnected,      // boolean - connection status
  publicKey,        // string | null - wallet public key
  isLoading,       // boolean - connection in progress
  error,           // string | null - error message
  connectToBackpack, // function - initiate connection
  disconnect,      // function - disconnect wallet
} = useBackpackConnection();
```

#### Secure Storage

```typescript
// Store wallet data
await SecureStorage.setWalletPublicKey(publicKey);
await SecureStorage.setWalletConnectionData(connectionData);

// Retrieve wallet data
const publicKey = await SecureStorage.getWalletPublicKey();
const connectionData = await SecureStorage.getWalletConnectionData();
```

## How It Works

### 1. Connection Flow

1. User taps "Connect Backpack"
2. App generates encryption key pair using `tweetnacl`
3. Opens Backpack app with connection parameters
4. Backpack processes connection and returns to app via deep link
5. App handles response and stores wallet data securely

### 2. Deep Link Handling

- **Scheme**: `yatori-solana-dapp://`
- **Response Path**: `/onConnectBackpack`
- **Parameters**: `public_key`, `encrypted_data`

### 3. Security

- Encryption keys generated per connection
- Wallet data stored in AsyncStorage (encrypted on device)
- No sensitive data in URL parameters
- Automatic cleanup on disconnect

## Extending the Integration

### Add More Wallets

To add Solflare or Phantom support:

1. Create new hooks similar to `useBackpackConnection`
2. Update the UI to show multiple wallet options
3. Add deep link handlers for each wallet

### Customize Storage

Modify `utils/secureStorage.ts` to:
- Add more wallet data fields
- Implement additional security measures
- Add wallet-specific storage keys

### Error Handling

The integration includes comprehensive error handling:
- Connection failures
- Deep link parsing errors
- Storage errors
- User cancellation

## Troubleshooting

### Common Issues

1. **Deep Link Not Working**
   - Check app.json scheme configuration
   - Verify associated domains setup
   - Test deep link URL format

2. **Storage Errors**
   - Check AsyncStorage permissions
   - Verify data serialization
   - Check storage quota

3. **Connection Failures**
   - Verify Backpack app is installed
   - Check network connectivity
   - Verify URL parameters

### Debug Mode

Enable debug logging by adding console.log statements in:
- `useBackpackConnection.ts`
- `deepLinkHandler.ts`
- `secureStorage.ts`

## Next Steps

1. **Token Operations**: Implement USDC, USDT, BONK token transfers
2. **Yatori API**: Integrate with Yatori's data services
3. **Transaction History**: Add transaction tracking
4. **Multi-Wallet**: Support additional wallet providers

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Verify all dependencies are installed correctly
- Test deep link handling in development mode
